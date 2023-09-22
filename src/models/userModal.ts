import hashpassword from '@utils/hashpassword';
import logger from '@utils/logger';
import mongoose, { Document, Schema, Model } from 'mongoose';

interface IUser extends Document {
  email: string;
  provider: string;
  firstName: string;
  lastName: string;
  providerId?: string;
  password?: string;
  profilePicture?: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  firstName: String,
  lastName: String,
  provider: {
    type: String,
    required: true,
    enum: ['credential', 'google', 'github'],
  },
  password: String,
  providerId: {
    type: String,
    unique: true,
    sparse: true, // Only required for social providers
  },
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
