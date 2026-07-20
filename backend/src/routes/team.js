const router = require('express').Router();
const { protect, leaderOnly } = require('../middleware/auth');
const {
  getTeam, inviteMember, acceptInvitation, declineInvitation, getInvitations, removeMember,
} = require('../controllers/teamController');

router.get('/', protect, getTeam);
router.post('/invite', protect, leaderOnly, inviteMember);
router.post('/accept', protect, acceptInvitation);
router.post('/decline', protect, declineInvitation);
router.get('/invitations', protect, getInvitations);
router.post('/remove', protect, leaderOnly, removeMember);

module.exports = router;
