// authMiddleware.js
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
class AuthMiddleware {
    isAuthenticated(req, res, next) {
        // Your authentication logic with bcrypt
        console.log('req.session.authenticated::::::::::', req.session.authenticated);
        if (req.session.authenticated) {
            return next();
        }
        res.redirect('/login');
    }
}

module.exports = new AuthMiddleware();
