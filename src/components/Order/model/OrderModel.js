import { OrderMaster } from "../schema/index.js";
import { CartIteamMaster } from "../../CartIteam/schema/index.js";
import { Transaction } from "sequelize";
import CustomerMaster from "../../Customer/schema/CustomerSchema.js";
import ProductMaster from "../../Product/schema/ProductSchema.js";

class OrderModel {

    // Add Order 

    async addOne(
        adminObj,
        transaction = null
    ) {
        try {
            return await OrderMaster.create(adminObj, { transaction });
        } catch (error) {
            console.log("Failed to add Order detail " + error);
            return res.status(500).json({ error: "Failed to add Order detail. Please try again later. " + error });
        }
    }

    // all list of order
    async getAll(attributes = []) {
        try {
            return await OrderMaster.findAll({ attributes });
        } catch (error) {
            console.log("Failed to find Order detail \n" + error)
            return res.status(500).json({ error: "Failed to find Order detail. Please try again later." });
        }
    }


    // Get particuler Order Detail

    async getOne(condition = {}, attributes = ["order_id", "total_price", "status", "created_at"], adminObj, transaction = null) {
        try {
            return await OrderMaster.findOne({
                where: condition,
                attributes,
                include: [{
                    model: CustomerMaster,
                    attributes: ['customer_id', 'customer_name', 'customer_number', 'customer_address'],
                    required: true,
                }, {
                    model: CartIteamMaster,
                    attributes: ['cart_id', 'product_id', 'quantity', 'price', 'created_at', 'updated_at'],
                    as: CartIteamMaster,
                    include: [{
                        model: ProductMaster,
                        attributes: ['id', 'title', 'description', 'price', 'discount_percentage', 'stock', 'rating', 'brand', 'category', 'thumbnail', 'images'],

                    }]
                },]
            }, adminObj, transaction);
        } catch (error) {
            console.log("Failed to find particuler Order detail " + error)
            return res.status(500).json({ error: "Failed to find particuler Order detail. Please try again later. " + error });
        }
    }

    // Delete perticuler Order ID And detail

    async dropOrder(condition = {}, attributes = ["order_id"], transaction = null) {
        try {
            return await OrderMaster.update({ status: 'Canceled' }, { where: condition, attributes }, transaction)
        } catch (error) {
            console.log("Failed to delete Order " + error);
            return res.status(500).json({ error: "Failed to delete Order detail. Please try again later. " + error });
        }
    }
};


export default new OrderModel();