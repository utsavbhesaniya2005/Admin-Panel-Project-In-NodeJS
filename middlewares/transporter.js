const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
        user: "ukbhesaniya01@gmail.com",
        pass: "bjjaqzajzwmjzsbr",
    },
    tls: {
        rejectUnauthorized: false
    },      
});

module.exports = transporter;