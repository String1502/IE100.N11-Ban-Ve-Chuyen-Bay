const express = require('express');
const router = express.Router();

const htttController = require('../controllers/HinhThucThanhToanController');

// http://localhost:8080/thanhtoan

router.get('/VNPAY_LayKetQuaThanhToan', htttController.VNPAY_LayKetQuaThanhToan);
router.post('/VNPAY_ChuyenHuongThanhToan', htttController.VNPAY_ChuyenHuongThanhToan);

module.exports = router;
