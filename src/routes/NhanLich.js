const express = require('express');
const router = express.Router();

const nhanlichController = require('../controllers/NhanLichController');

// Nhận lịch chuyến bay
router.get('/downExcelTemplate', nhanlichController.downExcelTemplate);
router.post('/FlightAmount', nhanlichController.FlightAmount);
router.post('/fromexcel', nhanlichController.addbyExcel);
router.post('/thucong', nhanlichController.addbyType);
router.post('/', nhanlichController.chooseAdd);

module.exports = router;
