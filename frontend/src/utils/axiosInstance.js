import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.request.use((config) => {
  // Prioritize admin token first, fallback to user
  const token =
    localStorage.getItem("adminAccessToken") ||
    localStorage.getItem("userAccessToken") ||
    localStorage.getItem("accessToken"); // legacy fallback

    console.log("Attaching token:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {

      console.log("401 detected, trying token refresh...");
      originalRequest._retry = true;

      const refreshToken =
      localStorage.getItem("adminRefreshToken") ||
      localStorage.getItem("userRefreshToken") ||
      localStorage.getItem("refreshToken");
    

      if (!refreshToken) {
        // No refresh token, logout user or redirect
        return Promise.reject(err);
      }

      try {
        const isAdmin = !!localStorage.getItem("admin");
        const refreshEndpoint = isAdmin ? "/admin/refresh" : "/user/refresh";

        const res = await axios.post(`${baseURL}${refreshEndpoint}`, {
          token: refreshToken,
        });

        if (res.data.accessToken) {
          const accessToken = res.data.accessToken;

          if (res.data.accessToken) {
            const accessToken = res.data.accessToken;
            const refreshToken = res.data.refreshToken; // 👈 new
          
            // Store both tokens
            if (isAdmin) {
              localStorage.setItem("adminAccessToken", accessToken);
              if (refreshToken) localStorage.setItem("adminRefreshToken", refreshToken);
            } else {
              localStorage.setItem("accessToken", accessToken);
              if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
            }
          
            // Update axios headers
            axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
            return axiosInstance(originalRequest);
          }
          
          // Update tokens in axios instance and original request headers
          axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return axiosInstance(originalRequest);
        }
      } catch (refreshErr) {
        console.error("Token refresh failed", refreshErr);
        // Clear tokens and redirect to login here
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("adminRefreshToken");
        localStorage.removeItem("userAccessToken");
        localStorage.removeItem("userRefreshToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("admin");
        // Redirect user to login page or emit logout event
      }
    }

    return Promise.reject(err);
  }
);


export default axiosInstance;
