import { BASE_URL } from '@/lib/constant';

const sendMessage = async (
  token: string | undefined,
  receiverId: string,
  content: string,
) => {
  const url = `${BASE_URL}/api/v1/chat/create/message`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      receiverId,
      payload: {
        type: 'text',
        content,
      },
    }),
  });
  const { error, data } = await res.json();
  if (res.status !== 200) {
    return { error };
  }
  return { data };
};

export default sendMessage;
