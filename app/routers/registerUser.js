const express = require('express');
const { route } = require('./loginRouter');
const router = express.Router();
const registrationController =  require('../controllers/registrationController')
router.get('/register-new-user', registrationController.registerNewUser);

module.exports = router;