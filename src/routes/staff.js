const express = require('express');
const router = express.Router();

const staffController = require('../controllers/StaffController');

router.post('/flightdetail/editdetail', staffController.editdetail);
router.post('/flightdetail', staffController.flightdetail);
router.get('/Regulations', staffController.Regulations);
router.post('/UpdateThamSo', staffController.UpdateThamSo);
router.post('/UpdateSanBay', staffController.UpdateSanBay);
router.post('/UpdateHangGhe', staffController.UpdateHangGhe);
router.post('/UpdateLoaiKhachHang', staffController.UpdateLoaiKhachHang);
router.post('/UpdateMocHanhLy', staffController.UpdateMocHanhLy);
router.post('/LoadRegulation', staffController.LoadRegulation);
router.post('/', staffController.index);

module.exports = router;
