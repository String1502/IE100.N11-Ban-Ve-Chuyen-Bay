const express = require('express');
const router = express.Router();

import FlightController from '../controllers/FlightController';
const fileController = require('../controllers/fileController');

//multer save file
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, res) {
        res(null, './src/public/temp');
    },
    filename: function (req, file, res) {
        res(null, 'Demo.xlsx');
    },
});
const upload = multer({ storage: storage }).single('myfile');

router.post('/get-all-flights', FlightController.GetInfoAllFlights);
router.post('/fullsearch', FlightController.fullSearch);
router.post('/filter', FlightController.filterFlight);
router.post('/get-flight', FlightController.getFlight);
router.post('/update', FlightController.updateChuyenBay);
router.post('/cancel', FlightController.CancelChuyenBay);
router.post('/getdatafromExcel', upload, fileController.getfromExcel);
router.post('/addByExcel', fileController.addByExcel);
router.post('/addByTay', fileController.addByTay);

module.exports = router;
