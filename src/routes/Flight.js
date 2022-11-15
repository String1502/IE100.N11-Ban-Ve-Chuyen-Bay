const express = require('express');
const router = express.Router();

import FlightController from '../controllers/FlightController';

router.get('/get-flight', FlightController.GetInfoAllFlights);
router.post('/fullsearch', FlightController.fullSearch);
router.post('/filter', FlightController.filterFlight);

module.exports = router;
