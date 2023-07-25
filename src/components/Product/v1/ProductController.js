import { ProductModel } from '../model/index.js';
import sequelize from '../../../utils/dbConfig/db.Config.js';
import { ProductMaster } from '../schema/index.js';

class ProductController {

    // Add Products logic

    async add(req, res) {
        let transaction;
        try {
            const products = req.body;
            if (!Array.isArray(products)) {
                // Check if products is an array
                throw new Error("Products must be an array");
            }

            transaction = await sequelize.transaction();
            for (const product of products) {
                let { id, title, description, price, discount_percentage, rating, stock, brand, category, thumbnail, images } = product;
                const productData = await ProductModel.addOne({
                    id,
                    title,
                    description,
                    price,
                    discount_percentage,
                    rating,
                    stock,
                    brand,
                    category,
                    thumbnail,
                    images
                }, transaction);
            }
            await transaction.commit();
            return res.status(200).json({ message: "Product Added successfully" });

        } catch (error) {
            console.log("Can't Add Product \n" + error);
            return res.status(500).json({ error: "Unable to add product" });
        }
    }


    // Get Product Iteam logic

    async get(req, res) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            const productData = await ProductModel.getAll(["id", "title", "description", "price", "discount_percentage", "rating", "stock", "brand", "category",
                "thumbnail", "images"
            ]);
            await transaction.commit();
            return res.status(200).json(productData);
        } catch (error) {
            console.log("Can't Find Products \n" + error);
            await transaction.rollback();
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getcategories(req, res) {
        try {
            const productCategories = await ProductModel.getCategories(["category"])
            return res.status(200).json(productCategories);
        } catch (error) {
            console.log("Can't Find Products Categories \n" + error);
            return res.status(500).json({ error: "Internal Server Error" });
        }

    }

    async getcategory(req, res) {
        try {
            let category = req.params.category

            // Check if category is present in the product
            const categories = await ProductMaster.findOne({ where: { category } });
            if (!categories) {
                return res.status(404).json({ message: `'${category}' category is not present in the Product.` });
            }

            const productcategory = await ProductModel.getOneCategoryBrand({ category }, ["id", "title", "description", "price", "discount_percentage", "rating", "stock", "brand",
                "thumbnail", "images"
            ]);
            if (productcategory) {
                return res.status(200).json(productcategory);
            } else {
                return res.status(404).json({ message: "Product Category Data not found." });
            }
        } catch (error) {
            console.log("Can't Find Products Categories data \n" + error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }


    async getcategorybrand(req, res) {
        try {
            let category = req.params.category
            let brand = req.params.brand
            // Check if category is present in the product
            const categories = await ProductMaster.findOne({ where: { category, brand } });
            if (!categories) {
                return res.status(404).json({ message: `The '${category}' category inside the '${brand}' brand is not present in the Product.` });
            }
            const productcategory = await ProductModel.getOneCategory({ category, brand }, ["id", "title", "description", "price", "discount_percentage", "rating", "stock", "category",
                "thumbnail", "images"
            ]);
            if (productcategory) {
                return res.status(200).json(productcategory);
            } else {
                return res.status(404).json({ message: "Product Category Data not found." });
            }
        } catch (error) {
            console.log("Can't Find Products Categories data \n" + error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Get by ProductID logic

    async getOneProduct(req, res) {

        let transaction;
        try {
            let id = req.params.id; // retrieve the value of `id` from the URL parameter
            transaction = await sequelize.transaction();
            const productData = await ProductModel.getOne({ id }, ["id", "title", "description", "price", "discount_percentage", "rating", "stock", "brand", "category",
                "thumbnail", "images"
            ]);
            await transaction.commit();
            if (productData) {
                return res.status(200).json(productData);
            } else {
                return res.status(404).json({ message: "Product not found." });
            }
        } catch (error) {
            console.log("Can't Find particular Product \n" + error);
            await transaction.rollback();
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    // Update by ProductID logic

    async updateOneProduct(req, res) {

        try {
            let id = parseInt(req.params.id);
            const product = await ProductMaster.findOne({ where: { id } });
            if (!product) {
                return res.status(404).json({ message: `Product with the ID '${id}' does not exist. Please check product ID` });
            }
            console.log(id)
            let { title, description, price, discount_percentage, rating, stock, brand, category, thumbnail, images } = req.body;

            const productData = await ProductModel.updateOneProduct({ id }, {
                id,
                title,
                description,
                price,
                discount_percentage,
                rating,
                stock,
                brand,
                category,
                thumbnail,
                images
            });

            return res.status(200).send({ Message: 'Product updated successfully' });
            //return res.send(customerData);

        } catch (error) {
            console.log("Can't updated Product details \n" + error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }


    // Update only require filed in product

    async updateOneProducts(req, res) {
        try {
            let id = parseInt(req.params.id);
            let { title, description, price, discount_percentage, rating, stock, brand, category, thumbnail, images } = req.body;

            // Get the old stock quantity of the product
            const productData = await ProductMaster.findOne({
                where: {
                    id
                }
            });

            // Calculate the difference between old stock and updated stock
            let stockDifference = stock - productData.stock;

            // Update the product details in the product table
            await ProductModel.updateOne({
                title,
                description,
                price,
                discount_percentage,
                rating,
                stock,
                brand,
                category,
                thumbnail,
                images
            }, {
                where: {
                    id
                }
            });

            // Update stock quantity in product table
            productData.stock += stockDifference;

            // Save the updated product data
            await productData.save();

            return res.status(200).send({ Message: 'Product updated successfully', productData: productData });
        } catch (error) {
            console.log("Can't updated Product details \n" + error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }




    // Delete Product logic

    async deleteProduct(req, res) {
        let transaction;
        try {
            let id = req.params.id;
            const product = await ProductMaster.findOne({ where: { id } });
            if (!product) {
                return res.status(404).json({ message: `The Product with the ID '${id}' does not exist.` });
            }
            console.log(id)
            transaction = await sequelize.transaction();
            const productData = await ProductModel.dropProduct({ id });
            await transaction.commit();
            return res.status(200).json({ Message: 'Product deleted successfully' });
        } catch (error) {
            console.log("Can't Delete Product \n" + error);
            await transaction.rollback();
            return res.status(500).json({ error: "Internal server error" });
        }
    }

}
export default new ProductController();