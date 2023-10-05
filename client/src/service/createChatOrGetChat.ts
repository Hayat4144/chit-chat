import { BASE_URL } from '@/lib/constant';

const createChatOrGetChat = async (
  token: string | undefined,
  receiverId: string,
) => {
  const url = `${BASE_URL}/api/v1/createorget/chat/${receiverId}`;
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

export default createChatOrGetChat;
