const express = require('express');
const app = express();
const port = 3002;
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const routes = require('./routes/panelRoutes');
const productRoute = require('./routes/productRoute');
const db = require('./db/dbConfig'); 

// Set View Engine
app.set('view engine', 'ejs');

// Passport & Session Setup
var sessionOptions = {
    secret: 'Purple Admin Panel',
    resave: false,
    saveUninitialized: true,
} 

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Static Folder
app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/blogImg', express.static(path.join(__dirname, 'uploads/blogImg')));
app.use('/uploads/avatar', express.static(path.join(__dirname, 'uploads/avatar')));
app.use(cookieParser());

app.use('/', routes);
app.use('/products', productRoute);

app.listen(port, (err) => {
    
    if(!err){
        console.log(`Server Running In http://localhost:${port}`);
    }
});