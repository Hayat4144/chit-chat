import UserModel from '@models/userModal';

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
}

export { IsUserExist, UserService };
