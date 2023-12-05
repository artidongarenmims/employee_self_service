const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
app.set('view engine', 'ejs');
app.set('views','./app/views');
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.use(cookieParser());
const loginRouter = require('./app/routers/loginRouter');
require("dotenv").config();
const PORT = process.env.SERVER_PORT; 
app.use("/", loginRouter);





app.listen(PORT, ()=>{
    console.log(`Application is running on port: ${PORT}`);
})