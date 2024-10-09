import api from '../utils/api';

export async function getCurrentUser(userId: { id: string | null }) {
  const response = await api.get(`/users/fetch/${userId}`);
  return response;
}
