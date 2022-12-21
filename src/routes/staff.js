const express = require('express');
const router = express.Router();

const staffController = require('../controllers/StaffController');

// Chi tiết chuyến bay
router.post('/flightdetail/editdetail', staffController.editdetail);
router.post('/flightdetail', staffController.flightdetail);
router.post('/LoadHeader', staffController.LoadHeader);
// Tra cứu
router.post('/', staffController.index);

module.exports = router;
