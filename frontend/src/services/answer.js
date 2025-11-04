import api from './axiosInstance.js';

export const addAnswer = async (questionId, data) => {
  return await api.post(`/questions/${questionId}/answer`, data);
}

export const editAnswer = async (questionId, answerId, data) => {
  return await api.put(`questions/${questionId}/answers/${answerId}/edit`, data);
}

export const deleteAnswer = async (questionId, answerId) => {
  return await api.delete(`questions/${questionId}/answers/${answerId}/delete`);
}