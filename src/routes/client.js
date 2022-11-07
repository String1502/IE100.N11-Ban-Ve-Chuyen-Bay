const express = require('express');
const router = express.Router();

const clientController = require('../controllers/ClientController');

router.post('/choose_flight', clientController.choose_flight);
router.get('/', clientController.index);

module.exports = router;
