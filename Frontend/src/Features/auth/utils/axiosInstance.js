import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const isRefreshCall = originalRequest?.url?.includes(
      "/api/auth/refresh-token",
    );

    if (status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;
      try {
        await axios.post(
          "http://localhost:8080/api/auth/refresh-token",
          {},
          { withCredentials: true },
        );
        console.log("Token Refreshed SuccessFully");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);


export default axiosInstance;