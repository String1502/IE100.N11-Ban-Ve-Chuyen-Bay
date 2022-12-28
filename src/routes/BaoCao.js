const express = require('express');
const router = express.Router();

const BaoCaoController = require('../controllers/BaoCaoController');

router.post('/GetReports', BaoCaoController.DoanhThuNam);
router.post('/PrintReport', BaoCaoController.PrintReport);
router.post('/GetBills', BaoCaoController.HoaDonTheoChuyenBay);
router.get('/ReportTemplate', BaoCaoController.ReportTemplate);
router.post('/', BaoCaoController.index);

module.exports = router;
