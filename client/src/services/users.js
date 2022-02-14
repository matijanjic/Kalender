import axios from 'axios';
const baseUrl = '/api/users';

const createUser = async (user) => {
  const response = await axios.post(baseUrl, user);
  console.log(response);
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { createUser };
