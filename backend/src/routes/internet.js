const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getInternetCredential, revealPassword } = require('../controllers/internetController');

router.get('/', protect, getInternetCredential);
router.post('/reveal', protect, revealPassword);

module.exports = router;
