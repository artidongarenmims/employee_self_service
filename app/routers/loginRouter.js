const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController')
router.get('/login', loginController.login);
router.post('/authenticate-user', loginController.authenticateUser);
router.get('/get-dashboard', loginController.dashboard);
module.exports = router;