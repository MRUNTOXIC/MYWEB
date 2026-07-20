const User = require('../models/User');
const Team = require('../models/Team');

const getDashboard = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  let team = null;
  if (user.teamId) {
    team = await Team.findById(user.teamId)
      .populate('leaderId', 'name email')
      .populate('members', 'name email registrationNumber department');
  }
  res.json({ user, team });
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

const updateProfile = async (req, res) => {
  const { name, phone, department, year } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, department, year },
    { new: true }
  ).select('-password');
  res.json(user);
};

module.exports = { getDashboard, getProfile, updateProfile };
