const express = require('express');
const router = express.Router();

import ReportController from '../controllers/ReportController';

router.get('/', ReportController.index);

module.exports = router;
