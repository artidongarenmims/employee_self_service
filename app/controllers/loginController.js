const { render } = require("ejs");
const sessions = require('express-session');
const users = require('../models/Users');
const { use } = require("../routers/loginRouter");
const bcrypt = require('bcrypt');
module.exports = {

    login: function(req, res){
        console.log('Inside login::::::::::');
        res.render('login.ejs');
    },

    authenticateUser: function(req, res){
        console.log('Inside authenticate users::::::::');
        let { username, password } = { 
            ...req.body, 
            ...req.params, 
            ...req.query };
        console.log('username::::::::', username);
        console.log('password::::::::', password);
        users.findByUsername(username).then(result => {
            let storedPassword = result.rows[0].password;
         if (result.rowCount > 0) {
               bcrypt.compare(password, storedPassword, async (err, data) => {

                let sessions=req.session;
                sessions.userId = req.body.username;
                sessions.password=req.body.password;
                sessions.email = result.rows[0].official_email;
                sessions.firstName = result.rows[0].first_name;
                sessions.lastName = result.rows[0].last_name;
                sessions.mobile = result.rows[0].mobile;
                sessions.joiningDate = result.rows[0].date_of_joining;
                sessions.roleId = result.rows[0].role_id;
                sessions.applicationId =  result.rows[0].application_id;
                sessions.lastDayOfWorking = result.rows[0].last_working_day;
                let user = sessions;
                let role ;
                    if (data) {
                        users.findByRoleId(sessions.roleId).then(result1 =>{
                            role = result1.rows[0].role_name;
                            user.roleName = role;
                            res.status(200).json({ "message": "Authentication Sucess!", status: 200 });
                     })
                     
                    } else {
                        res.status(500).json({ "message": "Authentication Failed!", status: 500 });
                    }
                });
            } else {
               res.status(500).json({ "message": "Authentication Failed!", status: 500 });
            }
        });
      
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
        }

       
    },
    
}