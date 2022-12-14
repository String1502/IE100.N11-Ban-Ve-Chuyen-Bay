const express = require('express');
const router = express.Router();

const nhanlichController = require('../controllers/NhanLichController');

// Nhận lịch chuyến bay
router.post('/addflight', nhanlichController.addflight);

module.exports = router;
