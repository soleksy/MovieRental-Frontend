import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import {
  getMovie,
  getCategory,
  getDirector,
  updateMovie,
  removeMovie,
  getDirectors,
  addDirector,
  getCategories,
  addCategory,
} from '../PathResolver';
import Loader from 'react-loader-spinner';
const MovieDetailsAdmin = (props) => {
  const history = useHistory();

  const regex = '/admin/movie-details';

  const movie_id = props.location.pathname.replace(regex, '');

  const [initialState, setInitialState] = useState(null);

  const [formState, setForm] = useState({
    title: '',
    price: '',
    category: '',
    directorFirstName: '',
    directorLastName: '',
    poster: '',
    description: '',
  });

  const [errorState, setError] = useState({
    title: '',
    description: '',
    directorFirstName: '',
    directorLastName: '',
    category: '',
    poster: '',
    price: '',
    status: '',
  });
  const validateForm = (errors) => {
    let valid = true;
    if (errors.title == '' && errors.description == '') {
      return !valid;
    }
    return valid;
  };
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const formNotEmpty = () => {
    return (
      formState.title != '' &&
      formState.description != '' &&
      formState.directorFirstName != '' &&
      formState.directorLastName != '' &&
      formState.category != '' &&
      formState.poster != '' &&
      formState.price != ''
    );
  };

  const handleMovieRemove = async (event) => {
    event.preventDefault();
    if (validateForm(errorState)) {
      setError((prevValue) => ({ ...prevValue, status: 'Invalid Form' }));
    } else if (formNotEmpty()) {
      removeMovie(movie_id).catch((error) => {
        console.log(error.response);
      });
      history.push('/results/movies');
    } else {
      setError((prevValue) => ({ ...prevValue, status: 'Invalid Form' }));
    }
  };

  const handleMovieUpdate = async (event) => {
    event.preventDefault();
    if (validateForm(errorState)) {
      setError((prevValue) => ({ ...prevValue, status: 'Invalid Form' }));
    } else if (formNotEmpty()) {
      let directorID = 0;
      let directorExists = 0;

      let categoryID = 0;
      let categoryExists = 0;

      const directors = await getDirectors()
        .then((res) => res.data.data)
        .catch((error) => {
          console.log(error.response);
        });
      const categories = await getCategories()
        .then((res) => res.data.data)
        .catch((error) => {
          console.log(error.response);
        });

      directors.forEach(function (item) {
        if (item.imieRezyser == formState.directorFirstName) {
          if (item.nazwiskoRezyser == formState.directorLastName) {
            directorID = item.idRezyser;
            directorExists = 1;
          }
        }
      });

      if (directorExists != 1) {
        directorID = await addDirector({
          imieRezyser: formState.directorFirstName,
          nazwiskoRezyser: formState.directorLastName,
        })
          .then((res) => res.data.id)
          .catch((error) => {
            console.log(error.response);
          });
      }

      categories.forEach(function (item) {
        if (item.nazwa == formState.category) {
          categoryID = item.idRodzaj;
          categoryExists = 1;
        }
      });
      if (categoryExists != 1) {
        categoryID = await addCategory({
          nazwa: formState.category,
        })
          .then((res) => res.data.id)
          .catch((error) => {
            console.log(error.response);
          });
      }

      const response = updateMovie(movie_id, {
        Rodzaj_id: categoryID,
        Rezyser_id: directorID,
        nazwa: formState.title,
        opis: formState.description,
        cena: formState.price,
        plakat: formState.poster,
      })
        .then((res) => res)
        .catch((error) => {
          console.log(error.response);
        });
    } else {
      setError((prevValue) => ({ ...prevValue, status: 'Invalid Form' }));
    }
    history.push('/results/movies');
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    switch (name) {
      case 'title':
        setError((prevValue) => ({
          ...prevValue,
          [name]: value.length == 0 ? 'Title cannot be empty!' : '',
        }));
        break;
      case 'description':
        setError((prevValue) => ({
          ...prevValue,
          [name]: value.length == 0 ? 'Description cannot be empty!' : '',
        }));
        break;
      case 'directorFirstName':
        setError((prevValue) => ({
          ...prevValue,
          [name]:
            value.length == 0 ? 'Director First Name cannot be empty!' : '',
        }));
        break;
      case 'directorLastName':
        setError((prevValue) => ({
          ...prevValue,
          [name]:
            value.length == 0 ? 'Director Last Name cannot be empty!' : '',
        }));
        break;
      case 'category':
        setError((prevValue) => ({
          ...prevValue,
          [name]: value.length == 0 ? 'Category cannot be empty!' : '',
        }));
        break;
      case 'poster':
        setError((prevValue) => ({
          ...prevValue,
          [name]: value.length == 0 ? 'Poster cannot be empty!' : '',
        }));
        break;

      case 'price':
        setError((prevValue) => ({
          ...prevValue,
          [name]: value.length == 0 ? 'Price cannot be empty!' : '',
        }));
        break;

      default:
        break;
    }

    setForm((prevValue) => ({ ...prevValue, [name]: value }));
  };

  useEffect(() => {
    const apiFetch = async () => {
      let movieData = await getMovie(movie_id)
        .then((response) => {
          return response.data.data;
        })
        .catch((error) => {
          console.log(error.response);
        });

      let categoryTmp = await getCategory(movieData.Rodzaj_id)
        .then((response) => {
          return response.data.data.nazwa;
        })
        .catch((error) => {
          console.log(error.response);
        });

      let directorTmp = await getDirector(movieData.Rezyser_id)
        .then((response) => {
          return response.data.data;
        })
        .catch((error) => {
          console.log(error.response);
        });

      const directorFirstName = directorTmp.imieRezyser;
      const directorLastName = directorTmp.nazwiskoRezyser;

      setForm({
        title: movieData.nazwa,
        price: movieData.cena,
        category: categoryTmp,
        directorFirstName: directorFirstName,
        directorLastName: directorLastName,
        poster: movieData.plakat,
        description: movieData.opis,
      });

      setInitialState({
        title: movieData.nazwa,
        price: movieData.cena,
        category: categoryTmp,
        directorFirstName: directorFirstName,
        directorLastName: directorLastName,
        poster: movieData.plakat,
        description: movieData.opis,
      });
    };
    apiFetch();
  }, []);

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <form>
          <div className="title">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              noValidate
              value={formState.title}
            />
            {errorState.title.length > 0 && (
              <span className="error">{errorState.title}</span>
            )}
          </div>

          <div className="directorFirstName">
            <label htmlFor="directorFirstName">Director First Name</label>
            <input
              type="text"
              name="directorFirstName"
              onChange={handleChange}
              noValidate
              value={formState.directorFirstName}
            />
            {errorState.directorFirstName.length > 0 && (
              <span className="error">{errorState.directorFirstName}</span>
            )}
          </div>

          <div className="directorLastName">
            <label htmlFor="directorLastName">Director Last Name</label>
            <input
              type="text"
              name="directorLastName"
              onChange={handleChange}
              noValidate
              value={formState.directorLastName}
            />
            {errorState.directorLastName.length > 0 && (
              <span className="error">{errorState.directorLastName}</span>
            )}
          </div>

          <div className="category">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              UserSearchContext
              name="category"
              onChange={handleChange}
              noValidate
              value={formState.category}
            />
            {errorState.category.length > 0 && (
              <span className="error">{errorState.category}</span>
            )}
          </div>

          <div className="description">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              name="description"
              onChange={handleChange}
              noValidate
              value={formState.description}
            />
            {errorState.description.length > 0 && (
              <span className="error">{errorState.description}</span>
            )}
          </div>
          <div className="poster">
            <label htmlFor="poster">Poster</label>
            <input
              type="text"
              name="poster"
              onChange={handleChange}
              noValidate
              value={formState.poster}
            />
            {errorState.poster.length > 0 && (
              <span className="error">{errorState.poster}</span>
            )}
          </div>

          <div className="price">
            <label htmlFor="price">Price</label>
            <input
              type="text"
              name="price"
              onChange={handleChange}
              noValidate
              value={formState.price}
            />
            {errorState.price.length > 0 && (
              <span className="error">{errorState.price}</span>
            )}
          </div>

          <button className="neutralButton" onClick={handleMovieUpdate}>
            UPDATE MOVIE
          </button>
          <button className="dangerButton" onClick={handleMovieRemove}>
            REMOVE MOVIE
          </button>

          <span className="status-error">{errorState.status}</span>
        </form>
        <Link to={'/results/movies'}>
          <button>BACK TO SEARCH RESULTS</button>
        </Link>
      </div>
    </div>
  );
};

export default MovieDetailsAdmin;
