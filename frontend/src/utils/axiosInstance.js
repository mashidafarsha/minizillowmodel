import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const axiosInstance = axios.create({ baseURL });


axiosInstance.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("adminAccessToken") ||
    localStorage.getItem("userAccessToken") ||
    localStorage.getItem("accessToken");

  console.log("🔐 Attaching token:", token);

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
      console.warn("🔄 401 detected — attempting token refresh...");

      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem("adminRefreshToken") ||
        localStorage.getItem("userRefreshToken") ||
        localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.warn("❌ No refresh token found.");
        redirectToLogin();
        return Promise.reject(err);
      }

      try {
        const isAdmin = !!localStorage.getItem("admin");
        const refreshEndpoint = isAdmin ? "/admin/refresh" : "/user/refresh";

        const res = await axios.post(`${baseURL}${refreshEndpoint}`, {
          token: refreshToken,
        });

        const accessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        if (accessToken) {
          if (isAdmin) {
            localStorage.setItem("adminAccessToken", accessToken);
            if (newRefreshToken)
              localStorage.setItem("adminRefreshToken", newRefreshToken);
          } else {
            localStorage.setItem("userAccessToken", accessToken);
            if (newRefreshToken)
              localStorage.setItem("userRefreshToken", newRefreshToken);
          }

          localStorage.setItem("accessToken", accessToken);
          if (newRefreshToken)
            localStorage.setItem("refreshToken", newRefreshToken);

          axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return axiosInstance(originalRequest);
        }
      } catch (refreshErr) {
        console.error("🚫 Token refresh failed:", refreshErr);
        clearAllAuthTokens();
        redirectToLogin();
      }
    }

    return Promise.reject(err);
  }
);

function clearAllAuthTokens() {
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminRefreshToken");
  localStorage.removeItem("userAccessToken");
  localStorage.removeItem("userRefreshToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("admin");
}

function redirectToLogin() {
  window.location.href = "/login";
}

export default axiosInstance;
