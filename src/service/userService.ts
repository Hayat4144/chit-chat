import UserModel from '@models/userModal';
import { Types } from 'mongoose';

const IsUserExist = async (email?: string, password = true) => {
  if (password) {
    const user = await UserModel.findOne({ email });
    return user;
  }
  const user = await UserModel.findOne({ email }).select('-password');
  return user;
};

class UserService {
  async findUserById(id: string) {
    const isUser = await UserModel.findById(id).select('-password');
    return isUser;
  }

  async searchUser(searchQuery: string, userId: Types.ObjectId) {
    const users = UserModel.aggregate([
      {
        $search: {
          index: 'default',
          text: {
            query: searchQuery,
            path: ['firstName', 'lastName'],
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      },
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $unset: ['password', 'provider', 'providerId'] },
      { $sort: { firstName: -1 } },
    ]);
    return users;
  }
}

export { IsUserExist, UserService };
