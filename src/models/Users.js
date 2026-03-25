import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'First name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  course: {
    type: String,
    required: [true, 'Course name is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },

  modeOfLearning: {
    type: String, 
    required:[true, 'please enter mode of learning']
  },

  discountPrice: {
    type: String, 
    default: "30",
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});


export default mongoose.models.User || mongoose.model('User', UserSchema);