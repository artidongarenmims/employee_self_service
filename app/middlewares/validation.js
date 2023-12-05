const { body, validationResult } = require('express-validator');



const loginValidationRules = () => {
    console.log('inside loginValidationRules::::::::');
    return [
        // Validate username
        body('username')
            .notEmpty().withMessage('Username cannot be empty')
            .isAlphanumeric().withMessage('Username must be alphanumeric'),

        // Validate password
        body('password')
            .notEmpty().withMessage('Password cannot be empty')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ];
};

const validate = (req, res, next) => {
    console.log('inside validate::::::::');
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    // If there are validation errors, respond with them
    const extractedErrors = errors.array().map(err => ({ [err.param]: err.msg }));
    return res.status(422).json({ errors: extractedErrors });
};

module.exports = {
    loginValidationRules,
    validate
};