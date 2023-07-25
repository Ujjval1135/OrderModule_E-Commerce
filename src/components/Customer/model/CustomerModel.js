import { CustomerMaster } from "../schema/index.js";
import { Transaction } from "sequelize";
//const { Sequelize, DataTypes } = require('sequelize');

class CustomerModel {

    // Add new Customer Details

    async addOne(adminObj,
        transaction = Transaction) {
        try {
            return await CustomerMaster.create(adminObj, { transaction });
        } catch (error) {
            console.log("Failed to add Customer detail \n" + error);
            return res.status(500).json({ error: "Failed to add Customer detail. Please try again later. " + error });
        }
    }

    // Get all Customer Details

    async getAll(attributes = []) {
        try {
            return await CustomerMaster.findAll({ attributes });
        } catch (error) {
            console.log("Failed to find Customer detail \n" + error)
            return res.status(500).json({ error: "Failed to find Customer detail. Please try again later." });
        }
    }

    // Get particuler Customer Detail

    async getOne(condition = {}, attributes = ['customer_id'], adminObj, transaction = Transaction) {
        try {
            return await CustomerMaster.findOne({ where: condition, attributes }, adminObj, transaction);
        } catch (error) {
            console.log("Failed to find customer details \n" + error)
            return res.status(500).json({ error: "Failed to find particuler Customer detail. Please try again later." });
        }
    }

    // Update Customer Detail

    async updateOneCustomer(condition = {}, value = {}, attributes = ["customer_id"], transaction = null) {
        try {
            return await CustomerMaster.update(value, { where: condition, attributes }, transaction)
        } catch (error) {
            console.log("Failed to Update customer details \n" + error);
            return res.status(500).json({ error: "Failed to update Customer detail. Please try again later." });
        }
    }

    // Delete Customer Detail for Database

    async dropCustomer(condition = {}, attributes = ["customer_id"], adminObj, transaction = Transaction) {
        try {
            return await CustomerMaster.destroy({ where: condition, attributes }, transaction)
        } catch (error) {
            console.log("Failed to Delete customer \n" + error);
            return res.status(500).json({ error: "Failed to delete Customer. Please try again later." });
        }
    }

}
export default new CustomerModel();