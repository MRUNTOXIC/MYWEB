const router = require('express').Router();
const { protect, leaderOnly } = require('../middleware/auth');
const { submitProject, getSubmission } = require('../controllers/submissionController');

router.get('/', protect, getSubmission);
router.post('/', protect, leaderOnly, submitProject);

module.exports = router;
