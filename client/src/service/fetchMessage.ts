// /api/v1/chat/read/messages/:ChatId
import { BASE_URL } from '@/lib/constant';

const fetchMesages = async (token: string | undefined, chatId: any) => {
  const url = `${BASE_URL}/api/v1/chat/read/messages/${chatId}`;
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

export default fetchMesages;
