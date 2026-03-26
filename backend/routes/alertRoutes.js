const express = require('express');
const { getAlerts } = require('../controllers/alertController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getAlerts);

module.exports = router;
