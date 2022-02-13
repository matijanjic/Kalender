import axios from 'axios';
const baseUrl = 'http://localhost:3002/api/users';

const createUser = async (user) => {
  const response = await axios.post(baseUrl, user);
  console.log(response);
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { createUser };
