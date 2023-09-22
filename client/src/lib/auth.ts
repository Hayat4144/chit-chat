import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { BASE_URL } from './constant';
import UserExist from '@/service/UserExist';
import SignupUser from '@/service/signup';
import verifySocialtoken from '@/service/verifrySocailtoken';
import { decodeToken } from './jwt';

const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    authorization: {
      params: {
        prompt: 'consent',
        access_type: 'offline',
        response_type: 'code',
      },
    },
  }),
  CredentialsProvider({
    name: 'Credentials',
    credentials: {},
    async authorize(credentials: any) {
      const result = await fetch(`${BASE_URL}/api/v1/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials?.email,
          password: credentials?.password,
        }),
      });
      const response = await result.json();
      if (result.status !== 200) {
        return Promise.reject(new Error(response.error));
      }
      return response;
    },
  }),
];

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers,
  callbacks: {
    signIn: async ({ account, user }) => {
      if (account.provider === 'google' || account.provider === 'github') {
        const isUser = await UserExist(user.email);
        if (isUser.error) {
          const [firstName, lastName] = user.name.split(' ');
          const createUser = {
            email: user.email,
            provider: account.provider,
            providerId: account.providerAccountId,
            profilePicture: user.image,
            firstName,
            lastName,
          };
          const signup = await SignupUser(createUser);
          if (signup.error) {
            return Promise.reject(new Error(signup.error));
          }
          return true;
        } else {
          true;
        }
      }
      return true;
    },
    jwt: async ({ token, user, account }) => {
      if (user) {
        if (account.provider === 'google' || account.provider === 'github') {
          const verifyToken = await verifySocialtoken(account.id_token);
          if (verifyToken.error) {
            return Promise.reject(new Error(verifyToken.error));
          }
          token.access_token = verifyToken.data;
        } else {
          token.access_token = user.token;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        const accessToken = await decodeToken(token.access_token);
        session.user.token = token.access_token;
        session.user.id = accessToken.id;
        session.user.email = accessToken.email;
        session.user.name = accessToken.name;
      }
      return session;
    },
  },
  pages: {
    signOut: '/signin',
  },
};
