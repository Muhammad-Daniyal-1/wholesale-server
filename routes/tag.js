const express = require('express');
const router = express.Router();

const { createTag, updateTag, deleteTag, getTag } = require('../controllers/tagController');

router.route('/').get(getTag).post(createTag);
router.route('/:id').put(updateTag).delete(deleteTag);

module.exports = router;