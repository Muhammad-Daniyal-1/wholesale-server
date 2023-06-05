const express = require('express');
const router = express.Router();

const { createTier, updateTier, deleteTier, getTiers } = require('../controllers/tierController');

router.route('/').get(getTiers).post(createTier);
router.route('/:id').put(updateTier).delete(deleteTier);

module.exports = router;