const mongoose = require('mongoose');

const internetCredentialSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    internetId: { type: String, required: true },
    internetPassword: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InternetCredential', internetCredentialSchema);
