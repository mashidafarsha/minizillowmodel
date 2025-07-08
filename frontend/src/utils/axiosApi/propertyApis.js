import axiosInstance from "../axiosInstance";

// Add new property (for admin)
export const addPropertyApi = async (formData) => {
  const response = await axiosInstance.post("/admin/add-property", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // for image upload
    },
  });
  return response.data;
};


// Get property by ID (for admin view/edit)
export const getPropertyByIdApi = async (propertyId) => {

  console.log(propertyId,"kkkkbbbb");
  
  const response = await axiosInstance.get(`/admin/property/${propertyId}`);
  return response.data;
};


// PATCH or PUT based on your backend
export const updatePropertyByIdApi = async (propertyId, updateData) => {
  const response = await axiosInstance.put(`/admin/property/${propertyId}`, updateData);
  return response.data;
};



// Get all properties (for admin)
export const getAllPropertiesApi = async () => {
  const response = await axiosInstance.get("/admin/properties");
  return response.data;
};


export const deletePropertyByIdApi = async (propertyId) => {
  const response = await axiosInstance.delete(`/admin/property/${propertyId}`);
  return response.data;
};


// utils/axiosApi/propertyApis.js
export const toggleBookmarkApi = async (propertyId) => {
  console.log(propertyId,"propertyId");
  
  const res = await axiosInstance.post(`/user/toggle-bookmark/${propertyId}`);
  return res.data;
};

export const getCurrentUserApi = async () => {
  const res = await axiosInstance.get("/user/me");
  return res.data;
};