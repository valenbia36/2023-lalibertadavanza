const { sendEmail } = require('../utils/handleEmail');

const sendResetPasswordEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const send_to = email;
        const sent_from = process.env.EMAIL_USER;
        const reply_to = email;
        const subject = "HeliApp - Reset Password";
        const message = `
            <p>Link: localhost:3000/resetPassword</p>
        `;

        await sendEmail(subject, message, send_to, sent_from, reply_to);

        res.status(200).json({ success: true, message: "Email Sent" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { sendResetPasswordEmail };