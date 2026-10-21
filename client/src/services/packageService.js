import api from './api';

// Fetch all packages with optional query params (destination, maxPrice)
export const getPackages = async (params = {}) => {
  const response = await api.get('/packages', { params });
  return response.data;
};

// Fetch single package by ID
export const getPackageById = async (id) => {
  const response = await api.get(`/packages/${id}`);
  return response.data;
};
