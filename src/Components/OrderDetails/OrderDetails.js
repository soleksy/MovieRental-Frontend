import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import {
  getMovie,
  getCategory,
  getDirector,
  addRental,
  getRentals,
  addCopy,
  getCopy,
} from '../PathResolver';
import { useHistory } from 'react-router';

const OrderDetails = (props) => {
  const regex = /\/order-details\//;
  const movie_id = props.location.pathname.replace(regex, '');
  const history = useHistory();

  const [user, setUser] = useContext(UserContext);

  const [initalDates, setDates] = useState({
    dateFrom: '',
    dateTill: '',
  });
  const [movie, setMovie] = useState({
    poster: '',
    title: '',
    price: '',
    category: '',
    director: '',
    description: '',
  });

  const [formState, setForm] = useState({
    dateFrom: '',
    dateTill: '',
    totalPrice: '',
  });

  const [errorState, setError] = useState({
    dateStatus: '',
    existingStatus: '',
    globalStatus: '',
  });

  const isLogged = () => {
    return user.islogged;
  };

  const handleLogIn = () => {
    history.push('/login');
  };

  const handleRedirect = () => {
    history.push('/movie-details/' + movie_id);
  };

  const validateForm = (errors) => {
    if (errors.existingStatus != '') {
      return errors.existingStatus;
    } else if (errors.dateStatus != '') {
      return errors.dateStatus;
    } else {
      return '';
    }
  };
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  const setInitialDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    var today_year = today.getFullYear();
    var today_month = today.getMonth() + 1;
    var today_day = today.getDate();

    if (today_month.toString().length == 1) {
      today_month = '0' + today_month;
    }
    if (today_day.toString().length == 1) {
      today_day = '0' + today_day;
    }

    var tomorrow_year = tomorrow.getFullYear();
    var tomorrow_month = tomorrow.getMonth() + 1;
    var tomorrow_day = tomorrow.getDate();

    if (tomorrow_month.toString().length == 1) {
      tomorrow_month = '0' + tomorrow_month;
    }
    if (tomorrow_day.toString().length == 1) {
      tomorrow_day = '0' + tomorrow_day;
    }

    const Today = today_year + '-' + today_month + '-' + today_day;
    const Tomorrow = tomorrow_year + '-' + tomorrow_month + '-' + tomorrow_day;

    setForm({ dateFrom: Today, dateTill: Tomorrow, totalPrice: movie.price });
    setDates({ dateFrom: Today, dateTill: Tomorrow });
  };

  const handleDates = (name, value) => {
    if (name == 'dateFrom') {
      if (new Date(value) < new Date(initalDates.dateFrom)) {
        return 'Start date cannot be in the past.';
      } else if (formState.dateTill == value) {
        return 'Start date and End date cannot be the same.';
      } else if (new Date(value) > new Date(formState.dateTill)) {
        return 'Start date cannot be greater than the End date.';
      } else {
        const diffTime = new Date(value) - new Date(formState.dateFrom);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const TotalPrice = diffDays * movie.price;

        setForm((prevValue) => ({ ...prevValue, ['totalPrice']: TotalPrice }));
        return '';
      }
    } else {
      if (new Date(value) < new Date(initalDates.dateFrom)) {
        return 'End date cannot be in the past.';
      } else if (formState.dateFrom == value) {
        return 'Start date and End date cannot be the same.';
      } else if (new Date(value) < new Date(formState.dateFrom)) {
        return 'Start date cannot be greater than the End date.';
      } else {
        const diffTime = new Date(value) - new Date(formState.dateFrom);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const TotalPrice = diffDays * movie.price;

        setForm((prevValue) => ({ ...prevValue, ['totalPrice']: TotalPrice }));
        return '';
      }
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    switch (name) {
      case 'dateFrom':
        setError((prevValue) => ({
          ...prevValue,
          globalStatus: handleDates(name, value),
        }));
        break;
      case 'dateTill':
        setError((prevValue) => ({
          ...prevValue,
          globalStatus: handleDates(name, value),
        }));
        break;
      default:
        break;
    }

    setForm((prevValue) => ({ ...prevValue, [name]: value }));
  };

  const ExistingRental = async () => {
    const rentals = await getRentals()
      .then((res) => {
        return res.data.data;
      })
      .catch((err) => console.log(err));
    rentals.forEach(async (item) => {
      if (item.Klient_id == user.userID) {
        const copyID = await getCopy(item.Kopia_filmu_id).then((res) => {
          return res.data.data.Film_idFilm;
        });
        if (copyID == movie_id) {
          setError((prevValue) => ({
            ...prevValue,
            existingStatus:
              'You have already rented this movie, go to My movies tab to see your rentals',
          }));
        }
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm(errorState) == '') {
      if (errorState.existingStatus == '') {
        const copyID = await addCopy({
          Film_idFilm: movie_id,
        }).then((res) => {
          return res.data.id;
        });

        addRental({
          termin_od: formState.dateFrom,
          termin_do: formState.dateTill,
          Klient_id: user.userID,
          Kopia_filmu_id: copyID,
        })
          .then((res) => res.data.data)
          .catch((err) => {
            console.log(err);
          });
        sleep(1000);
        history.push('/my-movies');
      }
      setError((prevValue) => ({
        ...prevValue,
        existingStatus:
          'You have already rented this movie, go to My movies tab to see your rentals',
      }));
    } else {
      setError((prevValue) => ({
        ...prevValue,
        globalStatus: validateForm(errorState),
      }));
    }
  };

  useEffect(() => {
    const apiFetch = async () => {
      ExistingRental();
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
          return (
            response.data.data.imieRezyser +
            ' ' +
            response.data.data.nazwiskoRezyser
          );
        })
        .catch((error) => {
          console.log(error.response);
        });

      setMovie({
        poster: movieData.plakat,
        title: movieData.nazwa,
        price: movieData.cena,
        category: categoryTmp,
        director: directorTmp,
        description: movieData.opis,
      });
      setForm((prevValue) => ({
        ...prevValue,
        ['totalPrice']: movieData.cena,
      }));
    };

    apiFetch();
    setInitialDates();
  }, []);
  return (
    <div>
      {!isLogged() ? (
        <div className="container-row-100">
          <div className="wrapper">
            <div className="form-wrapper">
              <h2>{movie.title}</h2>
              <div>
                <div className="box-2-details">
                  <img src={movie.poster} alt="new" />
                </div>
                <h3>{movie.description}</h3>
                <br />

                <h3>Category: {movie.category}</h3>
                <h3>Director: {movie.director}</h3>
                <h3>Price per day: {movie.price} </h3>

                <button onClick={handleLogIn}>LOGIN AND ORDER</button>
                <button onClick={handleRedirect}>BACK TO MOVIE DETAILS</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="container-row-50">
            <div className="wrapper">
              <div className="form-wrapper">
                <h2>{movie.title} </h2>
                <div>
                  <div className="box-2-details">
                    <img src={movie.poster} alt="new" />
                  </div>
                  <h3>{movie.description}</h3>
                  <br />
                  <h3>Category: {movie.category}</h3>
                  <h3>Director: {movie.director}</h3>
                  <h3>Price per day: {movie.price} </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="container-row-50">
            <div className="wrapper">
              <div className="form-wrapper">
                <h2>Order Details</h2>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="dateFrom">
                    <label htmlFor="dateFrom">Start date</label>
                    <input
                      type="date"
                      name="dateFrom"
                      value={formState.dateFrom}
                      onChange={handleChange}
                      noValidate
                    />
                  </div>
                  <div className="dateTill">
                    <label htmlFor="dateTill">End date</label>
                    <input
                      type="date"
                      name="dateTill"
                      value={formState.dateTill}
                      onChange={handleChange}
                      noValidate
                      size={100}
                    />
                  </div>
                  <h2>Total price: {formState.totalPrice}</h2>
                  <div className="submit">
                    <button onClick={handleSubmit}>ORDER NOW!</button>
                    <h2 className="center-details"> OR </h2>
                    <button onClick={handleRedirect}>
                      BACK TO MOVIE DETAILS
                    </button>
                    <span className="status-error">
                      {errorState.globalStatus}
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
