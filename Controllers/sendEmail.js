// sendEmail.js
const nodemailer = require('nodemailer');

function sendEmail(email, verificationCode) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'futureinfinitygadgets@gmail.com',
      pass: 'ndhg vwvc aoor jbvi'
    }
  });

  const mailOptions = {
    from: 'futureinfinitygadgets@gmail.com',
    to: email,
    subject: 'Welcome to Parental Tracker',
    html: `
      <p>Hello,</p>
      <p>Thank you for choosing Parental Tracker. Your verification code for account security is: <strong>${verificationCode}</strong></p>
      <p style="color:black">We prioritize the safety and privacy of your family. Feel free to reach out if you have any questions or concerns.</p>
      <p style="color:black">Best Regards,<br/>Parental Tracker Team</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error:', error.message);
    }
    console.log('Email sent:', info.response);
  });
}

module.exports = sendEmail;
