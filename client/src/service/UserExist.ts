import { BASE_URL } from '@/lib/constant';

const UserExist = async (email: string) => {
  const result = await fetch(`${BASE_URL}/api/v1/isUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
  });
  const response = await result.json();
  if (result.status !== 200) {
    return { error: response.error };
  }
  return { user: response.user };
};

export default UserExist;
