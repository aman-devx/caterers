const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'caterer'], required: true },
    name: { type: String, trim: true },
    catererId: { type: String, default: null },
  },
  { versionKey: false, timestamps: true }
);

userSchema.methods.toSafeJSON = function () {
  return {
    id: this._id.toString(),
    email: this.email,
    role: this.role,
    name: this.name,
    catererId: this.catererId,
  };
};

module.exports = mongoose.model('User', userSchema);
