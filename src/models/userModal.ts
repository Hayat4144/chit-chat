import hashpassword from '@utils/hashpassword';
import logger from '@utils/logger';
import mongoose, { Document, Schema, Model } from 'mongoose';

interface IUser extends Document {
  username?: string;
  email: string;
  password?: string;
  provider: string;
  providerId?: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  password: String,
  provider: {
    type: String,
    required: true,
    enum: ['credential', 'google', 'github'],
  },
  providerId: {
    type: String,
    unique: true,
    sparse: true, // Only required for social providers
  },
  firstName: String,
  lastName: String,
  profilePicture: String,
});

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await hashpassword(this.password);
  next();
});

userSchema.virtual('fullName').get(function (this: IUser) {
  return this.firstName + this.lastName;
});

const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default UserModel;
