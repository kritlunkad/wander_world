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

// Create new package (Admin)
export const createPackage = async (packageData) => {
  const response = await api.post('/packages', packageData);
  return response.data;
};

// Update package (Admin)
export const updatePackage = async (id, packageData) => {
  const response = await api.put(`/packages/${id}`, packageData);
  return response.data;
};

// Delete package (Admin)
export const deletePackage = async (id) => {
  const response = await api.delete(`/packages/${id}`);
  return response.data;
};

