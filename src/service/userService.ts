import { statusModel } from '@models/statusModal';
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

  async createOrupdateUserStatus(userId: Types.ObjectId,online:boolean) {
    const lastSeenExist = await statusModel.findOne({ user: userId });
    if (!lastSeenExist) {
      const lastSeen = new statusModel({
        user: userId,
      });
      const saveLastSeen = await lastSeen.save();
      const updatelastseen = this.updatelastseen(saveLastSeen.id,online);
      return updatelastseen;
    }
    const updatelastseen = this.updatelastseen(lastSeenExist.id,online);
    return updatelastseen;
  }

  async updatelastseen(id: Types.ObjectId,status:boolean) {
    const updateStatus = await statusModel.findByIdAndUpdate(
      id,
      { lastSeen: Date.now() ,online:status},
      { new: true },
    );
    return updateStatus;
  }

  async getUserstatus(userId:Types.ObjectId){
    const status = await statusModel.findOne({user:userId})
    return status;
  }
}

export { IsUserExist, UserService };
