import { BASE_URL } from '@/lib/constant';

const fetchChats = async (token: string | undefined) => {
  const url = `${BASE_URL}/api/v1/chats`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const { error, data } = await res.json();
  if (res.status !== 200) {
    return { error };
  }
  return { data };
};

export default fetchChats;
