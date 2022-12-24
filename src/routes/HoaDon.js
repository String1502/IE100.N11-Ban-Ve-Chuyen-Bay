const express = require('express');
const router = express.Router();

import HoaDonController from '../controllers/HoaDonController';

router.post('/thanhtoan', HoaDonController.ThanhToan);
router.post('/create', HoaDonController.Create);
router.post('/update', HoaDonController.updateHoaDon);

module.exports = router;
