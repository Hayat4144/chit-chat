import { BASE_URL } from '@/lib/constant';

const updateGroupName = async (
  token: string | undefined,
  name: string,
  chatId: string,
) => {
  const url = `${BASE_URL}/api/v1/chat/update/name`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ chatId, name }),
  });
  const { error, data } = await res.json();
  if (res.status !== 200) {
    return { error };
  }
  return { data };
};

export default updateGroupName;
