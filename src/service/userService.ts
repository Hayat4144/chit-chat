import UserModel from '@models/userModal';

const IsUserExist = async (email?: string, password = true) => {
  if (password) {
    const user = await UserModel.findOne({ email });
    return user;
  }
  const user = await UserModel.findOne({ email }).select('-password');
  return user;
};

export { IsUserExist };
