const { sendEmail } = require('../utils/handleEmail');

const sendResetPasswordEmail = async (req, res) => {
    const email = req.body.email;
    const token = req.body.token;
    const userName = req.body.userName;

    try {
        const send_to = email;
        const sent_from = process.env.EMAIL_USER;
        const reply_to = email;
        const subject = "HeliApp - Reset Password";

        const message = `
        <p>¡Hola ${userName}!</p>
        <p>Recibes este correo porque has solicitado restablecer tu contraseña en HeliApp.</p>
        <p>Para completar este proceso, sigue los siguientes pasos:</p>
        <ol>
            <li>Haz clic en el siguiente enlace:</li>
            <a href="www.localhost:3000/resetPassword">www.localhost:3000/resetPassword</a>
            <li>Ingresa el siguiente token cuando se te solicite: <strong>${token}</strong></li>
        </ol>
        <p>Si no has solicitado restablecer tu contraseña, puedes ignorar este correo.</p>
        `;

        await sendEmail(subject, message, send_to, sent_from, reply_to);

        res.status(200).json({ success: true, message: "Email Sent" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { sendResetPasswordEmail };