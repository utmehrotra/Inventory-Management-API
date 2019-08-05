import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    isAdmin: {type: Boolean },
    status: {type: Boolean, default: true }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

UserSchema.index({ email: 1 }, { unique: true });

export const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
