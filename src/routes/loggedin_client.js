const express = require('express');
const router = express.Router();

const loggedinClientController = require('../controllers/LoggedinClientController');

router.get('/', loggedinClientController.index);

module.exports = router;
