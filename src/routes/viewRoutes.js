const express = require('express');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', viewsController.getOverview);
router.get('/login', viewsController.getLoginForm);

router.get('/hotel/:slug', viewsController.getHotel);

module.exports = router;
