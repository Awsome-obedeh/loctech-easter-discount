import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, default: 'admin' }
});

export default mongoose.models.Admins || mongoose.model('Admin', AdminSchema);
