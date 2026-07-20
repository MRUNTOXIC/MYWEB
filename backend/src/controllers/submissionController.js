const Submission = require('../models/Submission');

const submitProject = async (req, res) => {
  const { github, demo, presentation, description } = req.body;
  if (!req.user.teamId) return res.status(400).json({ message: 'You are not in a team' });

  const existing = await Submission.findOne({ teamId: req.user.teamId });
  if (existing) {
    existing.github = github;
    existing.demo = demo;
    existing.presentation = presentation;
    existing.description = description;
    existing.submittedAt = new Date();
    await existing.save();
    return res.json(existing);
  }

  const submission = await Submission.create({ teamId: req.user.teamId, github, demo, presentation, description });
  res.status(201).json(submission);
};

const getSubmission = async (req, res) => {
  if (!req.user.teamId) return res.status(400).json({ message: 'Not in a team' });
  const submission = await Submission.findOne({ teamId: req.user.teamId });
  res.json(submission || null);
};

module.exports = { submitProject, getSubmission };
