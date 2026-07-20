const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getDashboard, getProfile, updateProfile } = require('../controllers/dashboardController');

router.get('/', protect, getDashboard);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
