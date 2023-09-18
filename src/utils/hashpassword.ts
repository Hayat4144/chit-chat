import bcrypt from 'bcrypt';

const hashpassword = async (value: string) => {
  return await bcrypt.hash(value, 10);
};

export default hashpassword;
