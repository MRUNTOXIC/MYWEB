const User = require('../models/User');
const Team = require('../models/Team');
const InternetCredential = require('../models/InternetCredential');
const { generateToken, setTokenCookie } = require('../utils/token');
const { generateTeamNumber } = require('../utils/teamNumber');

const registerLeader = async (req, res) => {
  try {
    const { name, email, password, registrationNumber, phone, teamName, projectTrack, department } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { registrationNumber }] });
    if (existing) {
      res.status(400).json({ message: 'Email or registration number already exists' });
      return;
    }

    const teamNumber = await generateTeamNumber();

    const user = await User.create({
      name, email, password, registrationNumber, phone, department, role: 'leader',
    });

    const team = await Team.create({
      teamNumber, teamName, leaderId: user._id, members: [user._id], projectTrack, department,
    });

    user.teamId = team._id;

    const cred = await InternetCredential.create({
      userId: user._id,
      internetId: `HK_${registrationNumber}`,
      internetPassword: `Pass@${Math.random().toString(36).slice(2, 10)}`,
    });

    user.internetCredentialId = cred._id;
    await user.save();

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('registerLeader error:', err);
    res.status(500).json({ message: err.message });
  }
};

const registerMember = async (req, res) => {
  try {
    const { name, email, password, registrationNumber, phone } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { registrationNumber }] });
    if (existing) {
      res.status(400).json({ message: 'Email or registration number already exists' });
      return;
    }

    const user = await User.create({ name, email, password, registrationNumber, phone, role: 'member' });

    const cred = await InternetCredential.create({
      userId: user._id,
      internetId: `HK_${registrationNumber}`,
      internetPassword: `Pass@${Math.random().toString(36).slice(2, 10)}`,
    });

    user.internetCredentialId = cred._id;
    await user.save();

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('registerMember error:', err);
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

const getMe = (req, res) => {
  res.json(req.user);
};

module.exports = { registerLeader, registerMember, login, logout, getMe };
