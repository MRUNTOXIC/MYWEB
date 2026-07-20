const Team = require('../models/Team');
const User = require('../models/User');
const Invitation = require('../models/Invitation');

const getTeam = async (req, res) => {
  const team = await Team.findById(req.user.teamId)
    .populate('leaderId', 'name email registrationNumber')
    .populate('members', 'name email registrationNumber department');
  if (!team) return res.status(404).json({ message: 'Team not found' });
  res.json(team);
};

const inviteMember = async (req, res) => {
  const { email } = req.body;
  const team = await Team.findById(req.user.teamId);
  if (!team || team.leaderId.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Only team leader can invite' });

  const receiver = await User.findOne({ email });
  if (!receiver) return res.status(404).json({ message: 'User not found' });
  if (receiver.teamId) return res.status(400).json({ message: 'User already in a team' });

  const existing = await Invitation.findOne({ teamId: team._id, receiver: receiver._id, status: 'pending' });
  if (existing) return res.status(400).json({ message: 'Invitation already sent' });

  const invitation = await Invitation.create({ teamId: team._id, sender: req.user._id, receiver: receiver._id });
  res.status(201).json(invitation);
};

const acceptInvitation = async (req, res) => {
  const { invitationId } = req.body;
  const invitation = await Invitation.findById(invitationId);
  if (!invitation || invitation.receiver.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });
  if (invitation.status !== 'pending') return res.status(400).json({ message: 'Invitation already handled' });

  invitation.status = 'accepted';
  await invitation.save();

  await Team.findByIdAndUpdate(invitation.teamId, { $addToSet: { members: req.user._id } });
  await User.findByIdAndUpdate(req.user._id, { teamId: invitation.teamId, role: 'member' });

  res.json({ message: 'Invitation accepted' });
};

const declineInvitation = async (req, res) => {
  const { invitationId } = req.body;
  const invitation = await Invitation.findById(invitationId);
  if (!invitation || invitation.receiver.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });

  invitation.status = 'declined';
  await invitation.save();
  res.json({ message: 'Invitation declined' });
};

const getInvitations = async (req, res) => {
  const invitations = await Invitation.find({ receiver: req.user._id, status: 'pending' })
    .populate('teamId', 'teamName teamNumber projectTrack')
    .populate('sender', 'name email');
  res.json(invitations);
};

const removeMember = async (req, res) => {
  const { memberId } = req.body;
  const team = await Team.findById(req.user.teamId);
  if (!team || team.leaderId.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Only leader can remove members' });

  await Team.findByIdAndUpdate(team._id, { $pull: { members: memberId } });
  await User.findByIdAndUpdate(memberId, { teamId: null, role: 'member' });
  res.json({ message: 'Member removed' });
};

module.exports = { getTeam, inviteMember, acceptInvitation, declineInvitation, getInvitations, removeMember };
