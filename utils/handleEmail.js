const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: "587",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const options = {
      from: sent_from,
      to: send_to,
      replyTo: reply_to,
      subject: subject,
      html: message,
    };

    // Send Email
    const info = await transporter.sendMail(options);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error in sendEmail:", error);
    throw error; // rethrow the error to be handled by the caller
  }
};

module.exports = { sendEmail };
