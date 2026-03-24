import axios from "axios";

const API_URL = "http://localhost:8081/api/v1/author";

// 👉 Lấy token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getAllAuthors = () => {
  return axios.get(API_URL, getAuthHeader());
};

const deleteAuthor = (authorId) => {
  return axios.delete(`${API_URL}/${authorId}`, getAuthHeader());
};

const updateAuthor = (data) => {
  return axios.put(API_URL, data, getAuthHeader());
};

const getAuthorById = (authorId) => {
  return axios.get(`${API_URL}/${authorId}`, getAuthHeader());
};

const addAuthor = (data) => {
  return axios.post(API_URL, data, getAuthHeader());
};

export { getAllAuthors, deleteAuthor, updateAuthor, getAuthorById, addAuthor };
