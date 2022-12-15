const express = require('express');
const router = express.Router();

const phanquyenController = require('../controllers/PhanQuyenController');

// Phân quyền
router.post('/Authorization', phanquyenController.Authorization);
router.post('/AddPosition', phanquyenController.AddPosition);
router.post('/EditPosition', phanquyenController.EditPosition);
router.post('/ThemChucVu', phanquyenController.ThemChucVu);
router.post('/SuaChucVu', phanquyenController.SuaChucVu);
router.post('/AddUser', phanquyenController.AddUser);
router.post('/EditUser', phanquyenController.EditUser);
router.post('/ThemUser', phanquyenController.ThemUser);
router.post('/SuaUser', phanquyenController.SuaUser);

module.exports = router;
