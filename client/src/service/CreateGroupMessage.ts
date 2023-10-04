/* */

import { BASE_URL } from '@/lib/constant';

const CreateGroupMessage = async (
  token: string | undefined,
  chatId: string,
  content: string,
) => {
  const url = `${BASE_URL}/api/v1/chat/create/group/message`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatId,
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

export default CreateGroupMessage;
