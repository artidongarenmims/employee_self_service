const { render } = require("ejs");
const sessions = require('express-session');
const { login } = require("./loginController");

module.exports = {

    registerNewUser : function(req, res){
        console.log(('Inside registerNewUser:::::::::::'));
        res.render("addNewUser");

    }   
}