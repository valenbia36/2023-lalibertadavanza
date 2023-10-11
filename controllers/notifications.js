const { sendEmail } = require('../utils/handleEmail');
const { usersModel } = require("../models");
const { updateUser } = require('../controllers/auth');

const sendResetPasswordEmail = async (req, res) => {
    const email = req.body.email;
    const token = req.body.token;
    const userName = req.body.userName;
    const userId = req.body.userId;

    try {
        const reqUpdateUser = {
            params: {
                id: userId
            },
            body: {
                secretToken: token
            }
        };

        const resUpdateUser = {
            send: (data) => {
            },
            status: (statusCode) => {
                console.log(`Status Code: ${statusCode}`);
            }
        };

        const updateUserSecretToken = await updateUser(reqUpdateUser, resUpdateUser);

        if( updateUserSecretToken === 200 ){ 
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
        } else{
            res.status(500)
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const validateToken = async(req, res) =>{

    try{
        const data = await usersModel.findOne({'secretToken': req.params.token});
        console.log(JSON.stringify(data))
        res.send({data});    
    } catch(e){
        handleHttpError(res, 'ERROR_VALIDATE_TOKEN', 500);
    }

}

module.exports = { sendResetPasswordEmail, validateToken };