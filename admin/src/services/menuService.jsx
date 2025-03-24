import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/menu";

const getMenuItems = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createMenuItem = async (menuItem) => {
  const response = await axios.post(API_URL, menuItem);
  return response.data;
};

const updateMenuItem = async (id, menuItem) => {
  const response = await axios.put(`${API_URL}/${id}`, menuItem);
  return response.data;
};

const deleteMenuItem = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export default {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
