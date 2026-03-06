import axios from "axios";

const API_URL = "http://localhost:5000/api/stock";

export const getStockMovements = async (productId) => {
  const response = await axios.get(`${API_URL}/${productId}`);
  return response.data;
};

export const createStockMovement = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};