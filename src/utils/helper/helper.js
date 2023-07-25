import STATUS_CODES from 'http-status-codes';



export const createResponse = (
    res,
    status,
    message,
    // payload = {},
    // pager = {}
) => {
    return res.status(status).json({
        status,
        message,
        // payload,
        // pager: typeof pager !== 'undefined' ? pager : {},
    });
};

/**
 * @description Send Validation Response
 * @param {Object} res
 * @param {errors} errors - Errors Object
 */

export const createValidationResponse = (res, errors) => {
    return createResponse(
        res,
        STATUS_CODES.UNPROCESSABLE_ENTITY,
        errors[Object.keys(errors)[0]], { error: errors[Object.keys(errors)[0]] }
    );
};