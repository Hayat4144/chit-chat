import { BASE_URL } from '@/lib/constant';

const createGroup = async (token: string | undefined, groupData: any) => {
  const url = `${BASE_URL}/api/v1/create/group/chat`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...groupData }),
  });
  const { error, data } = await res.json();
  if (res.status !== 200) {
    return { error };
  }
  return { data };
};

export default createGroup;
