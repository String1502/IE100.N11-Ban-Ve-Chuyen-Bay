const express = require('express');
const router = express.Router();

import FlightController from '../controllers/FlightController';

router.get('/get-flight', FlightController.GetInfoAllFlights);
router.post('/fullsearch', FlightController.fullSearch);

module.exports = router;
