import sequelize from '../../../utils/dbConfig/db.Config.js';
import { CartIteamMaster } from '../../CartIteam/schema/index.js';
import { OrderModel } from '../model/index.js';
import { CartIteamModel } from '../../CartIteam/model/index.js';
import { CustomerMaster } from '../../Customer/schema/index.js';
import { ProductMaster } from '../../Product/schema/index.js';
import { NUMBER, where } from 'sequelize';
import OrderMaster from '../schema/OrderSchema.js';


class OrderController {

    // all oder list
    async get(req, res) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            const orderData = await OrderModel.getAll(['order_id', 'customer_id', 'cart_id', 'total_price', 'status', 'created_at'])
            await transaction.commit();
            return res.status(201).json(orderData);
        } catch (error) {
            console.log("Can't Find order Data " + error);
            await transaction.rollback(); // Rollback the transaction in case of error
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // CART ADD!

    async add_Cart(req, res) {
        // let transaction;
        try {

            // CART ADD
            let cart_id = req.body.cart_id
            let cartDetail = req.body.cart_detail
            let cartData = [];
            //console.log(req.body)

            for (const product of cartDetail) {

                const productDetail = await ProductMaster.findOne({
                    where: {
                        id: product.product_id
                    }
                })
                if (productDetail.stock < product.qty) {
                    return res.status(422).json({ message: `${productDetail.title} has only ${productDetail.stock} in stock.` })
                }
                await CartIteamModel.addOne({
                    cart_id,
                    product_id: product.product_id,
                    quantity: product.qty,
                    price: Number(product.qty) * Number(productDetail.price)
                });
                // Update stock quantity in product table
                // productDetail.stock -= product.qty;
                // await productDetail.save();
            }
            //await transaction.commit();
            return res.status(200).json({ message: "Cart added successfully" });
        } catch (error) {
            console.log("Can't Add Carts\ n " + error);
            return res.status(500).json({ error: "Failed to add cart. Please try again later." });
        }
    }

    // Order added!

    async place_order(req, res) {
        let transaction;
        try {

            let customer_id = req.body.customer_id
            let cart_id = req.body.cart_id
            let total_price = 0;

            transaction = await sequelize.transaction();
            // Retrieve the cart items from the database
            const cartItems = await CartIteamMaster.findAll({
                where: { cart_id: cart_id }
            });
            console.log(cartItems);
            // Get the product IDs and quantities from the cart items
            const productQuantities = cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }));
            console.log(productQuantities);
            // Loop through the product IDs and quantities and update the stock quantity
            for (const product of productQuantities) {
                const productDetail = await ProductMaster.findOne({ where: { id: product.product_id } });
                productDetail.stock -= product.quantity;
                await productDetail.save();
            }


            // Retrieve the total price from CartIteamMaster model
            const orders = await CartIteamMaster.findAll({
                attributes: ['cart_id', [sequelize.fn('SUM', sequelize.col('price')), 'total_price']],
                where: {
                    cart_id: cart_id
                },
                group: ['cart_id']
            });

            // Extract the total price from the Sequelize result
            if (orders && orders.length > 0) {
                total_price = orders[0].dataValues.total_price || 0;
            }

            //let status = [req.body.status]

            const OrderData = await OrderModel.addOne({

                customer_id,
                cart_id,
                total_price,
                status: 'pending',

            }, transaction);
console.log(OrderData);
            await transaction.commit();

            //#region setTimeOut

            // Schedule automatic status update after 2 minutes
            setTimeout(async () => {
                try {
                    // Fetch the order from the database
                    const order = await OrderMaster.findOne({ where: { order_id: OrderData.order_id } });

                    // Update order status to 'processing'
                    if (order && order.status === 'pending') {
                        order.status = 'processing';
                        await order.save();
                        console.log(`Order with ID ${OrderData.order_id} status updated to 'processing' after 30 second.`);
                    }
                } catch (error) {
                    console.log(`Failed to update order status after 30 second: ${error}`);
                }
            }, 30000); // 30 s  in milliseconds

            // Schedule automatic status update after 1 minutes
            setTimeout(async () => {
                try {
                    // Fetch the order from the database
                    const order = await OrderMaster.findOne({ where: { order_id: OrderData.order_id } });

                    // Update order status to 'shipped'
                    if (order && order.status === 'processing') {
                        order.status = 'shipped';
                        await order.save();
                        console.log(`Order with ID ${OrderData.order_id} status updated to 'shipped' after 1 minutes.`);
                    }
                } catch (error) {
                    console.log(`Failed to update order status after 1 minutes: ${error}`);
                }
            }, 60000); // 1 minutes in milliseconds

            // Schedule automatic status update after 2 minutes
            setTimeout(async () => {
                try {
                    // Fetch the order from the database
                    const order = await OrderMaster.findOne({ where: { order_id: OrderData.order_id } });

                    // Update order status to 'delivered'
                    if (order && order.status === 'shipped') {
                        order.status = 'delivered';
                        await order.save();
                        console.log(`Order with ID ${OrderData.order_id} status updated to 'delivered' after 2 minutes.`);

                    }
                } catch (error) {
                    console.log(`Failed to update order status after 2 minutes: ${error}`);
                }
            }, 120000); // 2 minutes in milliseconds

            //#endregion setTimeOut

            return res.status(201).json({
                message: 'Order added successfully',
                data: OrderData,
            });

        } catch (error) {
            console.log("Can't Add Orders \n " + error);
            await transaction.rollback(); // Rollback the transaction in case of error
            return res.status(500).json({
                message: 'Error adding order: ' + error,
            });
        }

    }

    // Get particular order Detail

    async getOneOrder(req, res) {
        let transaction;
        try {
            let order_id = req.params.id;
            // Check if product_id is present in the order
            const order = await OrderMaster.findOne({ where: { order_id } });
            if (!order) {
                return res.status(404).json({ message: `The order with the ID '${order_id}' does not exist.` });
            }
            console.log(order_id)
            transaction = await sequelize.transaction();
            const orderData = await OrderModel.getOne({ order_id });
            await transaction.commit();
            if (!orderData) {
                return res.status(404).json({ message: "Order not found" });
            }
            return res.status(200).json(orderData);
        } catch (error) {
            console.log("Can't Find particular Order Data " + error);
            await transaction.rollback(); // Rollback the transaction in case of error
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Update using CartID_(OrderID) logic.

    async update_Cart(req, res) {

        try {
            const cart_id = req.params.id;
            const cartDetail = req.body.cart_detail;
            const cartData = [];
            // Check if cart is present in the cart table
            const cartu = await CartIteamMaster.findOne({ where: { cart_id } });
            if (!cartu) {
                return res.status(404).json({ message: `The Cart with the ID '${cart_id}' does not exist. Please cheack cart ID.` });
            }
            console.log(cart_id)

            for (const product of cartDetail) {
                const productDetail = await ProductMaster.findOne({
                    where: {
                        id: product.product_id,
                    },
                });

                if (productDetail.stock < product.qty) {
                    return res.status(422).json({ message: `${productDetail.title} having only ${productDetail.stock}.` })
                }
                console.log(cartDetail);
                console.log(cart_id, product.product_id);
                await CartIteamModel.updateone({ cart_id, product_id: product.product_id }, {

                    quantity: product.qty,
                    price: Number(product.qty) * Number(productDetail.price),

                })
            }
            return res.status(200).json({ message: "Cart updated successfully......" });
        } catch (error) {
            console.log("Can't Update Carts  " + error);
            await transaction.rollback(); // Rollback the transaction in case of error
            return res.status(500).json({ message: "Unable to update the cart." });
        }
    }

    // First, delete the order and then " delete the cart ID ", rather than only deleting the cart.

    async deleteCart(req, res) {
        let transaction;
        try {
            let cart_id = req.params.id;
            console.log(cart_id)
            transaction = await sequelize.transaction();
            const customerData = await CartIteamModel.dropCart({ cart_id });
            await transaction.commit();
            if (customerData) {
                return res.status(200).json({ message: "Cart deleted successfully" });
            } else {
                return res.status(404).json({
                    message:
                        `The specified Cart ID '${cart_id}' is not found.Unable to delete cart.`
                });
            }
        } catch (error) {
            console.log("Can't Delete Carts " + error);
            await transaction.rollback(); // Rollback the transaction in case of error
            return res.status(500).json({ message: 'Cannot delete Cart because it has associated records in another table.' });
        }
    }

    // Delete Cart's Product 

    async deleteCartProduct(req, res) {

        try {
            let cart_id = req.params.id;
            let product_id = req.body.product_id
            console.log(cart_id, product_id)

            // Check if product_id is present in the cart
            const cartItem = await CartIteamMaster.findOne({ where: { cart_id, product_id } });
            if (!cartItem) {
                return res.status(404).json({ message: `The specified product '${product_id}' is not found in the cart.` });
            }

            await CartIteamModel.dropCartProducts({ cart_id, product_id });
            return res.status(200).json({ message: 'Product removed successfully.' });
        } catch (error) {
            console.log("Can't Delete Cart's Product " + error);

            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Delete Order 

    async deleteOrder(req, res) {
        let transaction;
        try {
            let order_id = req.params.id;
            transaction = await sequelize.transaction();
            const status = 'Canceled';
            // Check if product_id is present in the order
            const order = await OrderMaster.findOne({ where: { order_id } });
            if (!order) {
                return res.status(404).json({ message: `The order with the ID '${order_id}' does not exist.` });
            }
            const orderStatus = await OrderMaster.findOne({ where: { order_id, status } });
            if (orderStatus) {
                return res.status(404).json({ message: `The order with the ID '${order_id}' is all ready Canceld order` });
            }
            console.log(order_id)


            //await OrderMaster.update({ status: 'Canceled' }, { where: { order_id } });
            await OrderModel.dropOrder({ order_id });

            //const orederData = await OrderMaster.destroy({ where: { order_id } });
            await transaction.commit();
            return res.status(200).json({ message: 'Order deleted successfully.' });
        } catch (error) {
            console.log("Can't delete order: " + error);
            await transaction.rollback(); // Rollback the transaction in case of error
            return res.status(500).json({ message: "Failed to delete order." });
        }
    }

};

export default new OrderController();