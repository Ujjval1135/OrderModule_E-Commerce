import { CartIteamMaster } from '../schema/index.js';
import { Transaction } from 'sequelize';


class CartIteamModel {

    // Add new Cart

    async addOne(adminObj) {
        try {
            return await CartIteamMaster.create(adminObj);
        } catch (error) {
            console.log("Failed to add Cart detail " + error);
            return res.status(500).json({ error: "Failed to add Cart detail. Please try again later. " + error });
        }
    }

    // Update Cart Detail

    async updateone(condition = {}, value = {}, attributes = ["cart_id"], transaction = null) {
        try {
            return await CartIteamMaster.update(value, { where: condition, attributes }, transaction)
        } catch (error) {
            console.log("Failed to Update Cart detail " + error);
            return res.status(500).json({ error: "Failed to update Cart detail. Please try again later. " + error });
        }
    }


    // Delete Cart Detail for Database

    async dropCart(condition = {}, attributes = ["cart_id"]) {
        try {
            return await CartIteamMaster.destroy({ where: condition, attributes })
        } catch (error) {
            console.log("Failed to Delete Cart detail " + error);
            return res.status(500).json({ error: "Failed to delete Cart detail. Please try again later. " + error });
        }
    }

    // Delete Cart Product Detail for Database

    async dropCartProducts(condition = {}, attributes = ["cart_id", "product_id"]) {
        try {
            return await CartIteamMaster.destroy({ where: condition, attributes })
        } catch (error) {
            console.log("Failed to Delete Cart detail " + error);
            return res.status(500).json({ error: "Failed to delete Cart-Product detail. Please try again later. " + error });
        }
    }

};

export default new CartIteamModel();