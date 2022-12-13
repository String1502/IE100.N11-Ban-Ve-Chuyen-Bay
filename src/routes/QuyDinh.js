const express = require('express');
const router = express.Router();

const quydinhController = require('../controllers/QuyDinhController');

// Qui định
router.post('/Regulations', quydinhController.Regulations);
router.post('/UpdateThamSo', quydinhController.UpdateThamSo);
router.post('/UpdateSanBay', quydinhController.UpdateSanBay);
router.post('/UpdateHangGhe', quydinhController.UpdateHangGhe);
router.post('/UpdateLoaiKhachHang', quydinhController.UpdateLoaiKhachHang);
router.post('/UpdateMocHanhLy', quydinhController.UpdateMocHanhLy);
router.post('/LoadRegulation', quydinhController.LoadRegulation);

module.exports = router;
