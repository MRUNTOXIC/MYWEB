const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getAnnouncements } = require('../controllers/announcementController');

router.get('/', protect, getAnnouncements);

module.exports = router;
