import api from './axiosInstance.js';

export const register = async (data) => {
  return await api.post("/register", data);
}

export const authenticateWithGoogle = async (response) => {
  return await api.post("/auth/google", 
    {
      credential: response.credential,
    });
}

export const requestOtp = async (email, purpose) => {
  return await api.post("/otp/request", null, {params: {email, purpose}});
}

export const resetPassword = async (email, password) => {
  return await api.put("/password/reset", null, {params: {email, password}});
}

export const verifyOtp = async (email, otp) => {
  return await api.post("/otp/verify", null, {params: {email, otp}});
}

export const login = async (data) => {
  return await api.post("/login", data);
}