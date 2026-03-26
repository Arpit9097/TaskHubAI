const express = require('express');
const { analyzeTranscript } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, analyzeTranscript);

module.exports = router;
