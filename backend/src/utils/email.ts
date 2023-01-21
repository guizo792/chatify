const nodemailer = require('nodemailer');

const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
}) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Abdellah Guizo <hello@abdellah.io>', // sender address
    to: options.email, // list of receivers
    subject: options.subject + 'Testing nodemailer with GMAIL 📧', // Subject line
    html: options.message + '<p>Your html here</p>', // plain text body
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions, function (err: Error, info: string) {
    if (err) console.log(err);
    else console.log('SENT SUCCESSFULY');
  });
};

module.exports = sendEmail;
