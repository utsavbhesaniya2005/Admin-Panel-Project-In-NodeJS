const userModel = require("../models/userModel");
const Product = require('../models/productModel');
const Activity = require('../models/activityModel');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const fs = require('fs');
const otpGenerate = require('otp-generator');
const transporter = require('../middlewares/transporter');

var user;

const home = async (req, res) => {

    user = req.user;

    let products = await Product.find({});

    let activities = await Activity.find({}).populate('productId', 'productImage');

    let msg = req.flash('success');

    res.render('index', { user, msg, products, activities });
}

const login = (req, res) => {

    res.render('login');
}

const signUp = (req, res) => {

    res.render('signUp');
}

const register = async (req, res) => {

    try {

        let { username, email, password, avatar, dob, pno, role, country, city, zipcode } = req.body;

        bcrypt.hash(password, 12, async (err, hashPass) => {

            if (!err) {

                let user = await new userModel({
                    username,
                    email,
                    password: hashPass,
                    avatar,
                    dob,
                    pno,
                    role,
                    country,
                    city,
                    zipcode
                });
                await user.save();
            }
        });

        console.log('User Registerd');        

        const mailOptions = {
            from: "ukbhesaniya01@gmail.com",
            to: email,
            subject: "Welcome New User",
            text: `Dear ${username},
    
                        Congratulations for Successful login into Our Panel.
    
                        If this was you, no further action is required. However, if you did not authorize this login, please reset your password immediately and contact our support team at ukbhesaniya01@gmail.com.
    
                        For security reasons, always ensure your account credentials remain confidential.
    
                        Thank you for choosing Product Panel!
    
                        Best regards,
                        Product Panel`,
        }

        await transporter.sendMail(mailOptions);

        res.redirect('login');

    } catch (err) {

        console.log("Register User Error >>:- ", err);
    }
}

const userLogin = async (req, res) => {

    req.flash('success', `Welcome, ${req.user.username}`);
    res.redirect('/');
}

const myProfile = async (req, res) => {

    let product = await Product.find({ authorId: user.id });

    res.render('profile', { user, product });
}

const addAvatar = async (req, res) => {

    try {

        let prevAvatar = await userModel.findById(req.params.id);

        if (prevAvatar.avatar) {

            fs.unlink(prevAvatar.avatar, (err) => {

                console.log('Profile Image Replaced.');
            });
        } else {

            console.log('Profile Photo Added First Time.');
        }

        let { path } = req.file;

        await userModel.findByIdAndUpdate(req.params.id, {
            avatar: path
        });

        console.log('Profile Image Added.');

        res.redirect('/user/profile');

    } catch (err) {

        console.log('Error Updating Profile.');
    }
}

const updateInfo = async (req, res) => {

    try {

        const { username, email, oldPass, newPass, pno } = req.body;

        bcrypt.compare(oldPass, req.user.password, async (err, pass) => {

            if (!err && pass) {

                bcrypt.hash(newPass, 12, async (err, hashPass) => {

                    if (!err && hashPass) {

                        await userModel.findByIdAndUpdate(req.params.id, { username, email, password: hashPass, pno }, req.body);

                        console.log('Account Setting Updated.');

                        res.redirect('/user/profile');
                    } else {

                        console.log('New Password Adding Error.');
                    }

                });
            } else {

                console.log('Old & New Password Does Not Match.');
            }

        });


    } catch (err) {

        console.log('User Account Update Error');
    }

}

const deleteUser = async (req, res) => {

    await userModel.findByIdAndDelete(req.params.id);

    console.log('User Account Removed.');

    res.redirect('/login');
}

const updatePass = async (req, res) => {

    const { oldPass, newPass } = req.body;

    bcrypt.compare(oldPass, req.user.password, async (err, pass) => {

        if (!err && pass) {

            bcrypt.hash(newPass, 12, async (err, hashPass) => {

                if (!err && hashPass) {

                    await userModel.findByIdAndUpdate(req.params.id, { password: hashPass }, req.body);
                    res.redirect('/profile');
                } else {

                    console.log('Hashing Password Error.');
                }
            })
        } else {

            console.log('Password Does Not Match.');
        }
    })
}

const logout = (req, res) => {

    req.logOut((err) => {

        if (!err) {
            res.redirect('/login');
        }
    });
}

const forgotPass = (req, res) => {

    res.render('forgotPass');
}

const verifyUser = async (req, res) => {

    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (user) {

        let otp = otpGenerate.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

        await userModel.findByIdAndUpdate(user._id, { otp: otp });

        const mainOptions = {
            from: "ukbhesaniya01@gmail.com",
            to: user.email,
            subject: "Reset Your Password",
            text: `Dear ${user.username},

                        You recently requested to reset your password. Use the One-Time Password (OTP) below to proceed:

                        OTP: [${otp}]

                        This OTP is valid for the next [X] minutes. If you did not request this, please ignore this email.

                        For security reasons, do not share this OTP with anyone.

                        Best regards,
                        Purple Admin Support Team`,
            // html: "<p>HTML version of the message</p>",
        }

        await transporter.sendMail(mainOptions);

        req.flash('sentOTP', 'OTP Send Successfully To Your Gmail Account.');
        let otpSend = req.flash('sentOTP');
        res.render('verifyOTP', { user, otpSend });
    } else {

        req.flash('error', 'Please Enter Valid Email.');
        res.redirect('/login');
    }
}

const verifyOTP = async (req, res) => {

    const { id, otp } = req.body;

    let otpString = otp.join('');

    const user = await userModel.findOne({ _id: id, otp: otpString });

    if (user) {

        res.render('newPass', { user });
    } else {

        req.flash('otpErr', 'OTP Not Match Try Again Later.');
        res.redirect('/verifyOTP');
    }

}

const addNewPass = async (req, res) => {

    const { id, newPass } = req.body;

    const user = await userModel.findOne({ _id: id });

    bcrypt.hash(newPass, 12, async (err, hashPass) => {

        if (!err && hashPass) {

            await userModel.findByIdAndUpdate(user._id, { password: hashPass, otp: null });
            res.redirect('/login');
        } else {

            req.flash('addNewPassErr', 'New Password Not Added.');
            res.redirect('/addNewPass');
        }
    })
}

module.exports = {
    home,
    login,
    signUp,
    register,
    userLogin,
    myProfile,
    addAvatar,
    updateInfo,
    deleteUser,
    updatePass,
    logout,
    forgotPass,
    verifyUser,
    verifyOTP,
    addNewPass,
}