const express = require('express');
const router = express.Router();

const loginController = require('../controllers/LoginController');

router.get('/', loginController.login);
router.get('/register', loginController.register);
router.post('/check', loginController.check);
router.get('/forgotpassword', loginController.forgotpassword);
router.post('/validateCode', loginController.validateCode);

module.exports = router;
