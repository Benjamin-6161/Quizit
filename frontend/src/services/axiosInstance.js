import axios from "axios";

const api = axios.create({
  baseURL: "https://quizit-backend-x84v.onrender.com/api/v1”,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns 401 (Unauthorized) or 403 (Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Remove invalid token
      localStorage.removeItem("token");

      // Redirect to login page
      window.location.href = "/login";
    }

    // Reject the error so calling code can handle it too
    return Promise.reject(error);
  }
);

export default api;