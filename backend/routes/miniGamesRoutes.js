const express = require('express');
const { getProgress, saveProgress } = require('../controllers/miniGamesController');
const router = express.Router();

router.get('/progress', getProgress);
router.post('/progress', saveProgress);

module.exports = router;
