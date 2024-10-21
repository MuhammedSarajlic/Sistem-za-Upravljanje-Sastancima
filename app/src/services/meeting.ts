import { TNewEvent } from '../types/types';
import api from '../utils/api';

export async function getCurrentUserMeetingsByDate(
  userId: { id: string | null },
  startDate: string,
  endDate: string
) {
  const response = await api.get(`/meetings/fetch/user/${userId}/date`, {
    params: {
      startDate,
      endDate,
    },
  });
  return response;
}

export async function addNewEvent(event: TNewEvent) {
  const response = await api.post(`/meetings/create`, event);
  return response;
}
