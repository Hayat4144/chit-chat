import { BASE_URL } from '@/lib/constant';

const SignupUser = async (data: any) => {
  const result = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
    }),
  });
  const response = await result.json();
  if (result.status !== 200) {
    return { error: response.error };
  }
  return { data: response.data };
};

export default SignupUser;
