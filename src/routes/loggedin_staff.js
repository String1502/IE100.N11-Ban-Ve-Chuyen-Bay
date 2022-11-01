const express = require('express');
const router = express.Router();

const loggedinStaffController = require('../controllers/LoggedinStaffController');

router.get('/', loggedinStaffController.index);

module.exports = router;
