const express = require('express');
const router = express.Router();

import ReportController from '../controllers/ReportController';

router.post('/', ReportController.index);

module.exports = router;
