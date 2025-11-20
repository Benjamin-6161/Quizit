import api from './axiosInstance.js';

export const getAllQuestions = async () => {
  return await api.get("/questions");
}

export const getUserQuestions = async (userId) => {
  return await api.get(`/questions/user/${userId}`);
}

export const createAQuestion = async (data) => {
  return await api.post("/createQuestion", data);
}

export const getAQuestion = async (id) => {
  return await api.get(`/questions/${id}`);
}

export const editAQuestion = async (data, questionId) => {
  return await api.put(`/editQuestion/${questionId}`, data)
}

export const deleteAQuestion = async (questionId) => {
  return await api.delete(`/deleteQuestion/${questionId}`)
}

export const favoriteAQuestion = async (questionId, userId) => {
  return await api.put(`/question/${questionId}/${userId}/favorite`)
}

export const removeAFavoriteQuestion = async (questionId, userId) => {
  return await api.put(`/question/${questionId}/${userId}/favorite/remove`)
}