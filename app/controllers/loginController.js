const { render } = require("ejs");
const sessions = require('express-session');
const users = require('../models/Users');
const { use } = require("../routers/loginRouter");
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
module.exports = {

    login: function(req, res){
        console.log('Inside login::::::::::');
        res.render('login.ejs');
    },

    authenticateUser: async function (req, res) {
        console.log('Inside authenticate users::::::::');
    
        try {
            const errors = validationResult(req);
            console.log('errors::::::', errors);
    
            if (!errors.isEmpty()) {
                console.log('here::::::::');
                return res.status(422).json({ errors: errors.array() });
            }
    
            let { username, password } = {
                ...req.body,
                ...req.params,
                ...req.query
            };
    
            console.log('username::::::::', username);
            console.log('password::::::::', password);
    
            try {
                const result = await users.findByUsername(username);
    
                if (result.rowCount > 0) {
                    // Check if the password property exists before accessing it
                    if (result.rows[0].password) {
                        let storedPassword = result.rows[0].password;
    
                        bcrypt.compare(password, storedPassword, async (err, data) => {
                            let sessions = req.session;
                            sessions.userId = req.body.username;
                            sessions.password = req.body.password;
                            sessions.email = result.rows[0].official_email;
                            sessions.firstName = result.rows[0].first_name;
                            sessions.lastName = result.rows[0].last_name;
                            sessions.mobile = result.rows[0].mobile;
                            sessions.joiningDate = result.rows[0].date_of_joining;
                            sessions.roleId = result.rows[0].role_id;
                            sessions.applicationId = result.rows[0].application_id;
                            sessions.lastDayOfWorking = result.rows[0].last_working_day;
    
                            let user = sessions;
                            let role;
    
                            if (data) {
                                const result1 = await users.findByRoleId(sessions.roleId);
                                role = result1.rows[0].role_name;
                                user.roleName = role;
    
                                req.session.authenticated = true;
                                res.status(200).json({ "message": "Authentication Success!", status: 200 });
                            } else {
                                res.status(500).json({ "message": "Authentication Failed!", status: 500 });
                            }
                        });
                    } else {
                       
                        res.status(500).json({ "message": "Authentication Failed!", status: 500 });
                    }
                } else {
                    res.status(500).json({ "message": "Authentication Failed!", status: 500 });
                }
            } catch (error) {
                console.error('Error during database query:', error);
                res.status(500).json({ "message": "Internal Server Error", status: 500 });
            }
        } catch (error) {
            console.error('Error during validation:', error);
            res.status(500).json({ "message": "Internal Server Error", status: 500 });
        }
    },
    

    dashboard: function(req, res){
        console.log('Inside dashboard::::::::::');
        if (req.session.userId) {
            const userId = req.session.userId;
            const roleName = req.session.roleName;
            if(roleName == 'HR'){
                res.render('hrDashboard.ejs');
            }else{
                res.render('employeeDashboard.ejs');
            }
        }else{
            console.log('--Invalid Session--');
            res.redirect('/login');
        }
     },

     logout: function(req, res){
        console.log('Inside logout::::');
        req.session.destroy(err =>{
            if(err){
                console.error('Error destroying session:', err);
                res.status(500).send('Internal Server Error');
            }else{
                res.redirect("/login");
            }
        })
     },


    
}