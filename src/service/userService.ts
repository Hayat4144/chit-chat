import UserModel from '@models/userModal';

const IsUserExist = async (email: string) => {
  const user = await UserModel.findOne({ email });
  return user;
};

export { IsUserExist };
