const Team = require('../models/Team');

const generateTeamNumber = async () => {
  const count = await Team.countDocuments();
  return `T${String(count + 1).padStart(3, '0')}`;
};

module.exports = { generateTeamNumber };
