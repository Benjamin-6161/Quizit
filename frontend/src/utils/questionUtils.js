import { favoriteAQuestion, removeAFavoriteQuestion } from '../services/question.js';
import { getUserDetails } from '../services/user.js';

export const handleFavoriteQuestion = async (questionId, userId) => {
  try {
    await favoriteAQuestion(questionId, userId);
    const user = await getUserDetails(userId);
    localStorage.setItem("favoriteQuestions", JSON.stringify(user.data.details.favoriteQuestions));
    const storedFave = JSON.parse(localStorage.getItem("favoriteQuestions")) || [];
    localStorage.setItem("favoriteQuestionIds", JSON.stringify(storedFave.map(q => q.id)));
    return true;
  } catch (err) {
    if (err.response) {
      console.error(err.response.data.message);
    } else {
      console.error("Network error");
    }
    return false;
  }
};

export const handleRemoveQuestionFromFavorites = async (questionId, userId) => {
  try {
    await removeAFavoriteQuestion(questionId, userId);
    const user = await getUserDetails(userId);
    localStorage.setItem("favoriteQuestions", JSON.stringify(user.data.details.favoriteQuestions));
    const storedFave = JSON.parse(localStorage.getItem("favoriteQuestions")) || [];
    localStorage.setItem("favoriteQuestionIds", JSON.stringify(storedFave.map(q => q.id)));
  } catch (err) {
    if (err.response) {
      console.error(err.response.data.message || "Failed to remove from favorites");
    } else {
      console.error("Network error");
    }
  }
};