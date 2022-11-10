const express = require('express');
const router = express.Router();

import FlightController from '../controllers/FlightController';

router.post('/fullsearch', FlightController.fullSearch);

module.exports = router;
