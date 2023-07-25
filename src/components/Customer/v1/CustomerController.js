import { CustomerModel } from '../model/index.js';
import sequelize from '../../../utils/dbConfig/db.Config.js';
import { CustomerMaster } from '../schema/index.js';
import { where } from 'sequelize';
import bcrypt from "bcrypt";
import { ForeignKeyConstraintError } from "sequelize"


class CustomerController {

    // Add Customers logic

    async add(req, res) {
        try {
            const { customer_name, customer_number, customer_email, customer_address } = req.body;

            // Check if customer email already exists
            const customer = await CustomerMaster.findOne({ where: { customer_email } });
            if (customer) {
                return res.status(409).json({ error: 'Email exists in the database. Please try a different email ID.' });
            }

            // Start database transaction
            const transaction = await sequelize.transaction();

            // Add customer data
            const customerData = await CustomerModel.addOne({
                customer_name,
                customer_number,
                customer_email,
                customer_address,
            }, transaction);

            // Commit transaction
            await transaction.commit();

            // Send success response
            return res.status(201).json({
                message: 'Customer added successfully',
                data: customerData,
            });
        } catch (error) {
            console.log("Failed to add customer: \n" + error);
            if (transaction) {
                await transaction.rollback();
            }
            return res.status(500).json({ error: "Failed to add customer. Please try again later." });
        }
    }


    // Get Customers logic

    async get(req, res) {
        try {
            const customerData = await CustomerModel.getAll(["customer_id", "customer_name", "customer_number", "customer_email", "customer_address"]);
            return res.status(200).json(customerData);
        } catch (error) {
            console.log("Failed to retrieve customer data: " + error);
            let transaction;
            try {
                transaction = await sequelize.transaction();
                await transaction.rollback();
            } catch (rollbackError) {
                console.log("Failed to rollback transaction: " + rollbackError);
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }


    // Get by particular CustomerID logic
    async getOneCustomer(req, res) {
        try {
            let customer_id = req.params.id; // retrieve the value of `id` from the URL parameter
            let transaction = await sequelize.transaction();
            const customerData = await CustomerModel.getOne({ customer_id }, ["customer_id", "customer_name", "customer_number", "customer_email", "customer_address"]);
            await transaction.commit();
            if (customerData) {
                return res.status(200).json(customerData); // send 200 OK status and the customer data
            } else {
                return res.status(404).json({ error: "Customer Not Found" }); // send 404 Not Found status if customer data is not found
            }
        } catch (error) {
            console.log("Failed to retrieve customer data: " + error);
            let transaction;
            try {
                transaction = await sequelize.transaction();
                await transaction.rollback();
            } catch (rollbackError) {
                console.log("Failed to rollback transaction: " + rollbackError);
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }


    // Update by CustomersID logic

    async updateOneCustomer(req, res) {
        let transaction = null;
        try {
            let customer_id = parseInt(req.params.id);
            const Customer = await CustomerMaster.findOne({ where: { customer_id } });
            if (!Customer) {
                return res.status(404).json({ message: `The Customer with the ID '${customer_id}' does not exist. Please check your id.` });
            }
            let { customer_name, customer_number, customer_email, customer_address } = req.body;
            transaction = await sequelize.transaction();
            const customerData = await CustomerModel.updateOneCustomer({ customer_id }, {
                customer_name,
                customer_number,
                customer_email,
                customer_address
            }, transaction);
            await transaction.commit();
            if (customerData) {
                return res.status(200).json({ message: "Customer data updated successfully" }); // send 200 OK status and success message
            } else {
                return res.status(404).json({ error: "Customer Not Found" }); // send 404 Not Found status if customer data is not found
            }


        } catch (error) {
            console.log("Can't Update Customer data \n " + error);
            if (transaction) {
                await transaction.rollback(); // Rollback the transaction in case of error
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Delete Customers logic

    async deleteCustomer(req, res) {
        try {
            let customer_id = req.params.id;
            // Check if Cusromer is present in the Customers Table
            const Customer = await CustomerMaster.findOne({ where: { customer_id } });
            if (!Customer) {
                return res.status(404).json({ message: `The Customer with the ID '${customer_id}' does not exist.` });
            }
            console.log(customer_id)
            const customerData = await CustomerModel.dropCustomer({ customer_id });
            if (customerData) {
                return res.status(200).json({ message: "Customer is successfully deleted" }); // send 200 OK status and success message
            } else {
                return res.status(404).json({ error: "Customer Not Found" }); // send 404 Not Found status if customer data is not found
            }
        } catch (error) {
            console.log("Can't Delete Customer ");
            // if (err instanceof Sequelize.ForeignKeyConstraintError) {
            //     next({ status: 501, status_message: 'Invalid Crop', error: err.message });
            // } else {
            //     next({ status: 500, status_message: 'Internal Server Error', error: err.message });
            // }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }


}
export default new CustomerController();