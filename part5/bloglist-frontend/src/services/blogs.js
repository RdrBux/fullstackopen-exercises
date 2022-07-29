import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;
const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (id, newBlog) => {
  const request = await axios.put(`${baseUrl}/${id}`, newBlog);
  return request.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = await axios.delete(`${baseUrl}/${id}`, config);
  return request.data;
};

const blogService = {};
blogService.getAll = getAll;
blogService.setToken = setToken;
blogService.create = create;
blogService.update = update;
blogService.remove = remove;

export default blogService;
