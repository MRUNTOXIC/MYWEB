const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true, unique: true },
    github: { type: String, required: true },
    demo: { type: String, default: '' },
    presentation: { type: String, default: '' },
    description: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
