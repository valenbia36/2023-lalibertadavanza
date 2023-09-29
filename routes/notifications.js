const express = require('express');
const router = express.Router();
const {sendResetPasswordEmail} = require('../controllers/notifications')
const {validatorSendEmail} = require('../validators/notifications')

router.post("/sendEmail", validatorSendEmail, sendResetPasswordEmail);

module.exports = router;