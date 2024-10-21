import api from '../utils/api';

export async function getCurrentUser(userId: { id: string | null }) {
  const response = await api.get(`/users/fetch/${userId}`);
  return response;
}

export async function findUserByEmail(email: string) {
  const response = await api.get(`/users/find/${email}`);
  return response;
}
