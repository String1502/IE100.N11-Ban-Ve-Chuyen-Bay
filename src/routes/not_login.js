const express = require('express');
const router = express.Router();

const notLoginController = require('../controllers/NotLoginController');

router.get('/', notLoginController.index);

module.exports = router;
