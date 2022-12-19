const express = require('express');
const router = express.Router();

const BaoCaoController = require('../controllers/BaoCaoController');

router.post('/', BaoCaoController.index);

module.exports = router;
