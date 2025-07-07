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
