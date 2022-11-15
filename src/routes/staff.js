const express = require('express');
const router = express.Router();

const staffController = require('../controllers/StaffController');

router.get('/flightdetail', staffController.flightdetail);
router.post('/', staffController.index);

module.exports = router;
