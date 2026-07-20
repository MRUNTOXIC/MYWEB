const Announcement = require('../models/Announcement');

const getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(20);
  res.json(announcements);
};

module.exports = { getAnnouncements };
