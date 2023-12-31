import jwt, { SignOptions } from 'jsonwebtoken';
import { payload } from '../types/index';
import { CustomError } from '@utils/CustomError';

const options: SignOptions = {
  algorithm: 'HS256',
  expiresIn: '30d',
};

// const getPrivateKeySecret = (): Buffer => {
//   const filePath = join(process.cwd(), 'private.ec.key');
//   const secretKey = readFileSync(filePath);
//   return secretKey;
// };

// const getPublicKeySecret = (): Buffer => {
//   const filePath = join(process.cwd(), 'public.pem');
//   const secretKey = readFileSync(filePath);
//   return secretKey;
// };
const getPrivateKeySecret = (): string => {
  return process.env.JWT_SECRET as string;
};

const getPublicKeySecret = (): string => {
  return process.env.JWT_SECRET as string;
};

const getAccessToken = async (payload: any): Promise<string> => {
  const secret = getPrivateKeySecret();
  const token = await jwt.sign(payload, secret, options);
  return token;
};

const getRefreshToken = async (paylod: payload): Promise<string> => {
  const secret = getPrivateKeySecret();
  const token = await jwt.sign(paylod, secret, {
    ...options,
    expiresIn: '30d',
  });
  return token;
};

const verifyToken = async (
  token: string,
  expiryDate: number,
): Promise<payload> => {
  const secret = getPublicKeySecret();
  const decodedToken = (await jwt.verify(token, secret, options)) as payload;

  const { exp } = decodedToken;

  if (!exp || typeof exp !== 'number') {
    throw new CustomError('Invalid token expiration', 400);
  }

  const expirationTime = exp * 1000; // Convert exp (seconds) to milliseconds
  const expirationIn30Days = Date.now() + expiryDate * 24 * 60 * 60 * 1000; //  days in milliseconds

  if (expirationTime >= expirationIn30Days) {
    throw new CustomError('Token has expired', 400);
  }

  return decodedToken;
};

export {
  getAccessToken,
  verifyToken,
  getRefreshToken,
  getPublicKeySecret,
  getPrivateKeySecret,
};
