const router = require('express').Router();
const { registerLeader, registerMember, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register/leader', registerLeader);
router.post('/register/member', registerMember);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
