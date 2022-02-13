import axios from 'axios';

const baseUrl = 'http://localhost:3002/api/calendars';

let token = null;

export const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getCalendars = async () => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.get(baseUrl, config);
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getCalendars };
