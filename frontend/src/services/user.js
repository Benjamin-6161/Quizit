import api from './axiosInstance.js';

export const getUserDetails = async (userId) => {
  return await api.get(`/user/${userId}`);
}

export const editUserDetails = async (userId, username) => {
  return await api.put(`edit/user/${userId}`, null, {
    params: {username}
  });
}

export const deleteUserAccount = async (userId) => {
  return await api.delete(`/${userId}/delete`);
}