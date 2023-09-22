import { BASE_URL } from '@/lib/constant';

const verifySocialtoken = async (token: any) => {
  const result = await fetch(`${BASE_URL}/api/v1/auth/verify/social/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken: token,
    }),
  });
  const response = await result.json();
  if (result.status !== 200) {
    return { error: response.error };
  }
  return { data: response.access_token };
};

export default verifySocialtoken;
