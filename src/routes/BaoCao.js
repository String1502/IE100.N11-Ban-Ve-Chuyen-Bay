const express = require('express');
const router = express.Router();

const BaoCaoController = require('../controllers/BaoCaoController');

router.post('/get', BaoCaoController.DoanhThuNam);

module.exports = router;
