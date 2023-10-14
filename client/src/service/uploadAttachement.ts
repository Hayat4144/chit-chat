import { BASE_URL } from '@/lib/constant';

const uploadAttachment = async (
  token: string | undefined,
  formData: FormData,
) => {
  const url = `${BASE_URL}/api/upload`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const { error, data } = await res.json();
  if (res.status !== 200) {
    return { error };
  }
  return { data };
};

export default uploadAttachment;
