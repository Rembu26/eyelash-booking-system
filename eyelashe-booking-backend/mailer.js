const e = require('cors');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:"smtp.sendgrid.net",
    port: 587,
    auth: {
        user: "apikey",// This is the username for SendGrid, which is always "apikey"
        pass: process.env.SENDGRID_API_KEY // Your SendGrid API key
    }
});

const sendEmail = async (to, customerName) => {
   try{
    const info = await transporter.sendMail({
      from:process.env.EMAIL_FROM, // Your verified sender email
        to: to,
        subject: "Welcome to Lash Bliss Booking System!", 
        text: `Welcome to Lash Bliss Booking System, ${customerName}! Click here to login: http://localhost:3000/login`,
 
        html: `<p>Hi ${customerName},</p>
        <p>Thank you for registering with Lash Bliss ✨. We're excited to have you on board!</p>
        <br/>
        <p>Best regards, </br>The Eyelash Booking Team</p>
        <a href="http://localhost:3000/login"
        style="display:inline-block;
        padding:12px 24px;
        background-color:#ff69b4;
        margin-top:16px;
        color:#fff;
        text-decoration:none;
        border-radius:5px;
        font-weight:bold;">
        Click here to login</a>
        `
   });
   console.log("Email sent: ", info);
    }
    catch(error){
        console.error("Error sending email: ", error);
       
    }
};

module.exports = { sendEmail };