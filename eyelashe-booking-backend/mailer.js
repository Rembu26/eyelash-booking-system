const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, username) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: 'Welcome to Eyelash Booking!',
        text: `Hi ${username},\n\nThank you for registering with Eyelash Booking! We're excited to have you on board.\n\nBest regards,\nThe Eyelash Booking Team`
    });
};

module.exports = { sendEmail };