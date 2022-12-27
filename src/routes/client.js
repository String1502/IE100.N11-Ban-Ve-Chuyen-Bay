const express = require('express');
const router = express.Router();

const clientController = require('../controllers/ClientController');

router.post('/validatecode', clientController.validateCode);
router.post('/payment', clientController.payment);
router.post('/booking', clientController.booking);
router.post('/pre-booking', clientController.prebooking);
router.post('/choose_flight', clientController.choose_flight);
router.post('/ChooseHeader', clientController.ChooseHeader);
router.post('/logout', clientController.logout);
router.post('/vecuatoi', clientController.VeCuaToi);
router.post('/chitietchuyenbay', clientController.ChiTietChuyenBay);
router.get('/', clientController.index);

module.exports = router;
