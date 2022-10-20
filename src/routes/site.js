const express = require('express');
const router = express.Router();

const siteController = require('../controllers/SiteController');

router.get('/delete', siteController.deleteHanhKhach);
router.get('/edit', siteController.editHanhKhach);
router.get('/create', siteController.createHanhKhach);
router.get('/', siteController.index);

module.exports = router;
