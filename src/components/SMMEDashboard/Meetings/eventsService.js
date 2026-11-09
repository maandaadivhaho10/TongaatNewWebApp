
import api from "../../../API/axiosInstance";

const EVENTS_ENDPOINT = "/esd-activities";

export const getEvents = async (token, signal) => {
  const response = await api.get(EVENTS_ENDPOINT, {
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = response.data;

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  if (Array.isArray(result?.activities)) {
    return result.activities;
  }

  return Array.isArray(result) ? result : [];
};
