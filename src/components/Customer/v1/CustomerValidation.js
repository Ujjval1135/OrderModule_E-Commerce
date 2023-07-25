import { createValidationResponse } from '../../../utils/helper/indx.js';
import isLength from 'validator/lib/isLength.js';
import { isEmail } from '../../../utils/validator/validator.js';

class CustomerValidation {

    // At this time, the customer is adding information for the first time.

    add(req, res, next) {
        let {
            customer_name,
            customer_number,
            customer_email,
            customer_address
        } = req.body;
        let errors = {};

        if (!customer_name) {
            errors.customer_name = res.__('CUSTOMER.VALIDATIONS.customer_name.required');
        } else if (!isLength(customer_name, { min: 1, max: 255 })) {
            errors.customer_name = res.__('CUSTOMER.VALIDATIONS.customer_name.valid');
        } else if (typeof customer_name !== 'string') {
            errors.customer_name = res.__('CUSTOMER.VALIDATIONS.customer_name.type');
        }

        if (!customer_number) {
            errors.customer_number = res.__('CUSTOMER.VALIDATIONS.customer_number.required');
        } else if (!isLength(customer_number, { min: 1, max: 50 })) {
            errors.customer_number = res.__('CUSTOMER.VALIDATIONS.customer_number.valid');
        } else if (typeof customer_number !== 'string') {
            errors.customer_number = res.__('CUSTOMER.VALIDATIONS.customer_number.type');
        }

        if (!customer_email) {
            errors.customer_email = res.__('CUSTOMER.VALIDATIONS.customer_email.required');
        } else if (typeof customer_email !== 'string') {
            errors.customer_email = res.__('CUSTOMER.VALIDATIONS.customer_email.type');
        } else if (!(isEmail(customer_email) && isLength(customer_email, { min: 1, max: 255 }))) {
            errors.customer_email = res.__('CUSTOMER.VALIDATIONS.customer_email.valid');
        }
        //else if (customer_email === customer_email) {
        //     errors.customer_email = res.__('CUSTOMER.VALIDATIONS.email.This email is already registered. Please try different email ID. ');
        // }

        if (!customer_address) {
            errors.customer_address = res.__('CUSTOMER.VALIDATIONS.customer_address.required');
        } else if (!isLength(customer_address, { min: 1, max: 500 })) {
            errors.customer_address = res.__('CUSTOMER.VALIDATIONS.customer_address.valid');
        } else if (typeof customer_address !== 'string') {
            errors.customer_address = res.__('CUSTOMER.VALIDATIONS.customer_address.type');
        }

        if (Object.keys(errors).length > 0) {
            createValidationResponse(res, errors);
        } else {
            next();
        }

    }

    update(req, res, next) {
        let {
            customer_name,
            customer_number,
            customer_email,
            customer_address
        } = req.body;
        let errors = {};

        if (!customer_name) {
            errors.customer_name = res.__('CUSTOMER.VALIDATIONS.customer_name.required');
        } else if (!isLength(customer_name, { min: 1, max: 255 })) {
            errors.customer_name = res.__('CUSTOMER.VALIDATIONS.customer_name.valid');
        } else if (typeof customer_name !== 'string') {
            errors.customer_name = res.__('CUSTOMER.VALIDATIONS.customer_name.type');
        }

        if (!customer_number) {
            errors.customer_number = res.__('CUSTOMER.VALIDATIONS.customer_number.required');
        } else if (!isLength(customer_number, { min: 1, max: 50 })) {
            errors.customer_number = res.__('CUSTOMER.VALIDATIONS.customer_number.valid');
        } else if (typeof customer_number !== 'string') {
            errors.customer_number = res.__('CUSTOMER.VALIDATIONS.customer_number.type');
        }

        if (!customer_email) {
            errors.customer_email = res.__('CUSTOMER.VALIDATIONS.customer_email.required');
        } else if (!isLength(customer_email, { min: 1, max: 250 })) {
            errors.customer_email = res.__('CUSTOMER.VALIDATIONS.customer_email.valid');
        } else if (typeof customer_email !== 'string') {
            errors.customer_email = res.__('CUSTOMER.VALIDATIONS.customer_email.type');
        }

        if (!customer_address) {
            errors.customer_address = res.__('CUSTOMER.VALIDATIONS.customer_address.required');
        } else if (!isLength(customer_address, { min: 1, max: 500 })) {
            errors.customer_address = res.__('CUSTOMER.VALIDATIONS.customer_address.valid');
        } else if (typeof customer_address !== 'string') {
            errors.customer_address = res.__('CUSTOMER.VALIDATIONS.customer_address.type');
        }

        if (Object.keys(errors).length > 0) {
            createValidationResponse(res, errors);
        } else {
            next();
        }

    }

}

export default new CustomerValidation();