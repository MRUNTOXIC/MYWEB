const InternetCredential = require('../models/InternetCredential');

const getInternetCredential = async (req, res) => {
  const cred = await InternetCredential.findOne({ userId: req.user._id });
  if (!cred) return res.status(404).json({ message: 'No credentials found' });
  res.json({ internetId: cred.internetId });
};

const revealPassword = async (req, res) => {
  const { password } = req.body;
  const user = await require('../models/User').findById(req.user._id);
  const valid = await user.comparePassword(password);
  if (!valid) return res.status(401).json({ message: 'Incorrect password' });

  const cred = await InternetCredential.findOne({ userId: req.user._id });
  res.json({ internetPassword: cred.internetPassword });
};

module.exports = { getInternetCredential, revealPassword };
