const express = require('express');
const route = express.Router();
const panelController = require('../controllers/panelController');
const authMiddleware = require('../middlewares/auth');
const uploads = require('../middlewares/multer');
const passport = require('../middlewares/passportConfig');

// Home Page Render
route.get('/', authMiddleware.auth, panelController.home);

// Login Page Render
route.get('/login', panelController.login);

// SignUp Page Render
route.get('/signUp', panelController.signUp);

// Get Register User
route.post('/register', panelController.register);

// Login User
route.post('/userLogin', passport.authenticate('local', { failureRedirect : '/login'}), panelController.userLogin);

// SignOut User 
route.get('/logout', panelController.logout);

// Profile Page Render
route.get('/user/profile', authMiddleware.auth, panelController.myProfile);

// Avatar Adding
route.post('/user/profile/:id', uploads.single('avatar'), panelController.addAvatar);

// Update Account Details
route.post('/user/edit/:id', authMiddleware.auth, panelController.updateInfo);

// Delete User Account Permentaly
route.get('/user/delete/:id', panelController.deleteUser);

// Update Password
route.post('/updatePass/:id', panelController.updatePass);

// Forgot Pass
route.get('/forgotPass', panelController.forgotPass);

// Verify User
route.post('/verifyUser', panelController.verifyUser);

// Verify OTP
route.post('/verifyOTP', panelController.verifyOTP);

// Adding New Password
route.post('/addNewPass', panelController.addNewPass);

module.exports = route;