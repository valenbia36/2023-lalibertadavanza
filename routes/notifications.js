const express = require('express');
const router = express.Router();
const {sendResetPasswordEmail, validateToken} = require('../controllers/notifications')
const {validatorSendEmail} = require('../validators/notifications')

router.post("/sendEmail", validatorSendEmail, sendResetPasswordEmail);
router.get('/validateToken/:token', validateToken);

module.exports = router;