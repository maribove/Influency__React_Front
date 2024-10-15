const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS,   
    },
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'influency.reset@gmail.com',
        to: to,
        subject: subject,
        text: text,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail; // Exporta a função
