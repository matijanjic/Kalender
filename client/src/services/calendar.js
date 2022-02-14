import axios from 'axios';

const baseUrl = 'http://localhost:3002/api/calendars';

let token = null;

export const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

export const getConfig = () => {
  return {
    headers: { Authorization: token },
  };
};

const getCalendars = async () => {
  const config = getConfig();
  const response = await axios.get(baseUrl, config);
  return response.data;
};

const addCalendar = async (name) => {
  const config = getConfig();
  const response = await axios.post(baseUrl, name, config);
  return response.data;
};

const getCalendar = async (id) => {
  const config = getConfig();
  const response = await axios.get(`${baseUrl}/${id}`, config);
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getCalendars, addCalendar, getCalendar };
