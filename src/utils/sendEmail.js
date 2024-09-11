const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service:"gmail",
    host: "smtp.gmail.com",
    port: "587",
    secure: false,
    auth: {
      user: "rahatulwork@gmail.com",
      pass: "skvejhcbfqumfgxy"
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
