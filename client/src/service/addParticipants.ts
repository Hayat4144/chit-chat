import { BASE_URL } from '@/lib/constant';

const addParticipants = async (
  token: string | undefined,
  members: string[],
  chatId: string,
) => {
  const url = `${BASE_URL}/api/v1/chat/add/memebers`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ chatId, members }),
  });
  const { error, data } = await res.json();
  if (res.status !== 200) {
    return { error };
  }
  return { data };
};

export default addParticipants;
