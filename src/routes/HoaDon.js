const express = require('express');
const router = express.Router();

import HoaDonController from '../controllers/HoaDonController';
// /hoadon
router.post('/thanhtoan', HoaDonController.ThanhToan);
router.post('/createhoadon', HoaDonController.CreateHoaDon);
router.post('/XoaCookieMaHangVe', HoaDonController.XoaCookieMaHangVe);
router.post('/TraCuuHoaDon', HoaDonController.TraCuuHoaDon);
router.post('/create', HoaDonController.Create);
router.post('/update', HoaDonController.updateHoaDon);

module.exports = router;
