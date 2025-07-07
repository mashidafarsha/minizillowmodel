import axiosInstance from "../axiosInstance";

export const loginUserApi = async (data) => {
  const response = await axiosInstance.post("/user/login", data);
  return response.data;
};

export const signupUserApi = async (data) => {
  const response = await axiosInstance.post("/user/signup", data);
  return response.data;
};
