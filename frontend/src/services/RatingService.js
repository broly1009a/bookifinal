import axios from "axios";

const RATING_API_URL = "http://localhost:8081/api/v1/rating";

const getRatingByBookAndUser = (bookId, userId) => {
  return axios.get(`${RATING_API_URL}/by-book-user`, {
    params: {
      book: bookId,
      user: userId,
    },
  });
};

const addRating = (bookId, userId, value) => {
  return axios.post(RATING_API_URL, null, {
    params: {
      book: bookId,
      user: userId,
      value,
    },
  });
};

export { getRatingByBookAndUser, addRating };