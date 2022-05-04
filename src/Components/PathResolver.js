import axios from 'axios';

const serverPath = 'https://moviex-back.herokuapp.com/api';
const usersPath = serverPath + '/users';
const moviesPath = serverPath + '/films';
const directorsPath = serverPath + '/directors';
const rentalsPath = serverPath + '/rentals';
const copiesPath = serverPath + '/copies';
const reviewsPath = serverPath + '/reviews';
const marksPath = serverPath + '/marks';
const categoriesPath = serverPath + '/categories';
const actorsPath = serverPath + '/actors';

//users

const getUsers = async () => {
  return axios.get(usersPath);
};

const addUser = async (requestBody) => {
  return axios.post(usersPath + '/new', requestBody);
};

const updateUser = async (id, requestBody) => {
  return axios.put(usersPath + '/' + id, requestBody);
};

const removeUser = async (id) => {
  return axios.delete(usersPath + '/' + id);
};

const getUser = async (id) => {
  return axios.get(usersPath + '/' + id);
};

const getUserEmail = async (email) => {
  return axios.get(usersPath + '/email/' + email);
};

// movies

const getMovies = async () => {
  return axios.get(moviesPath);
};

const addMovie = async (requestBody) => {
  return axios.post(moviesPath + '/new', requestBody);
};

const updateMovie = async (id, requestBody) => {
  return axios.put(moviesPath + '/' + id, requestBody);
};

const removeMovie = async (id) => {
  return axios.delete(moviesPath + '/' + id);
};

const getMovie = async (id) => {
  return axios.get(moviesPath + '/' + id);
};

//directors

const getDirectors = async () => {
  return axios.get(directorsPath);
};

const addDirector = async (requestBody) => {
  return axios.post(directorsPath + '/new', requestBody);
};

const updateDirector = async (id, requestBody) => {
  return axios.put(directorsPath + '/' + id, requestBody);
};

const removeDirector = async (id) => {
  return axios.delete(directorsPath + '/' + id);
};

const getDirector = async (id) => {
  return axios.get(directorsPath + '/' + id);
};

//categories

const getCategories = async () => {
  return axios.get(categoriesPath);
};

const addCategory = async (requestBody) => {
  return axios.post(categoriesPath + '/new', requestBody);
};

const updateCategory = async (id, requestBody) => {
  return axios.put(categoriesPath + '/' + id, requestBody);
};

const removeCategory = async (id) => {
  return axios.delete(categoriesPath + '/' + id);
};

const getCategory = async (id) => {
  return axios.get(categoriesPath + '/' + id);
};

//rentals
const getRentals = async () => {
  return axios.get(rentalsPath);
};

const addRental = async (requestBody) => {
  return axios.post(rentalsPath + '/new', requestBody);
};

const updateRental = async (id, requestBody) => {
  return axios.put(rentalsPath + '/' + id, requestBody);
};

const removeRental = async (id) => {
  return axios.delete(rentalsPath + '/' + id);
};

const getRental = async (id) => {
  return axios.get(rentalsPath + '/' + id);
};

//reviews
const getReviews = async () => {
  return axios.get(reviewsPath);
};

const addReview = async (requestBody) => {
  return axios.post(reviewsPath + '/new', requestBody);
};

const updateReview = async (id, requestBody) => {
  return axios.put(reviewsPath + '/' + id, requestBody);
};

const removeReview = async (id) => {
  return axios.delete(reviewsPath + '/' + id);
};

const getReview = async (id) => {
  return axios.get(reviewsPath + '/' + id);
};

//marks
const getMarks = async () => {
  return axios.get(marksPath);
};

const addMark = async (requestBody) => {
  return axios.post(marksPath + '/new', requestBody);
};

const updateMark = async (id, requestBody) => {
  return axios.put(marksPath + '/' + id, requestBody);
};

const removeMark = async (id) => {
  return axios.delete(marksPath + '/' + id);
};

const getMark = async (id) => {
  return axios.get(marksPath + '/' + id);
};

//copies
const getCopies = async () => {
  return axios.get(copiesPath);
};

const addCopy = async (requestBody) => {
  return axios.post(copiesPath + '/new', requestBody);
};

const updateCopy = async (id, requestBody) => {
  return axios.put(copiesPath + '/' + id, requestBody);
};

const removeCopy = async (id) => {
  return axios.delete(copiesPath + '/' + id);
};

const getCopy = async (id) => {
  return axios.get(copiesPath + '/' + id);
};

//actors
const getActors = async () => {
  return axios.get(actorsPath);
};

const addActor = async (requestBody) => {
  return axios.post(actorsPath + '/new', requestBody);
};

const updateActor = async (id, requestBody) => {
  return axios.put(actorsPath + '/' + id, requestBody);
};

const removeActor = async (id) => {
  return axios.delete(actorsPath + '/' + id);
};

const getActor = async (id) => {
  return axios.get(actorsPath + '/' + id);
};

export {
  getUsers,
  getUser,
  addUser,
  updateUser,
  removeUser,
  getUserEmail,
  getMovies,
  getMovie,
  addMovie,
  updateMovie,
  removeMovie,
  getActors,
  getActor,
  addActor,
  updateActor,
  removeActor,
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  removeCategory,
  getDirectors,
  getDirector,
  addDirector,
  updateDirector,
  removeDirector,
  getReviews,
  getReview,
  addReview,
  updateReview,
  removeReview,
  getMarks,
  getMark,
  addMark,
  updateMark,
  removeMark,
  getRentals,
  getRental,
  addRental,
  updateRental,
  removeRental,
  getCopies,
  getCopy,
  addCopy,
  updateCopy,
  removeCopy,
};
