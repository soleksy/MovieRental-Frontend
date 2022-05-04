import React from 'react';
import Loader from 'react-loader-spinner';
import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './Context/UserContext';
import {
  getMovie,
  getCategory,
  getDirector,
  addRental,
  getRentals,
  addCopy,
  getCopy,
  getRental,
  updateRental,
  removeRental,
} from './PathResolver';
import { useHistory } from 'react-router';
import { Redirect } from 'react-router';

const ManageRental = (props) => {
  const regex = /\/rentals\//;
  const rentalID = props.location.pathname.replace(regex, '');
  const history = useHistory();

  const [user, setUser] = useContext(UserContext);
  const [isBusy, setBusy] = useState(true);
  const [initialStates, setDates] = useState({
    dateFrom: '',
    dateTill: '',
    totalPrice: '',
  });
  const [movie, setMovie] = useState({
    title: '',
    poster: '',
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

  const setInitialStates = async () => {
    const copyID = await getRental(rentalID).then((res) => {
      return res.data.data.Kopia_filmu_id;
    });

    const movieID = await getCopy(copyID).then((res) => {
      return res.data.data.Film_idFilm;
    });

    let movieData = await getMovie(movieID)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        console.log(error.response);
      });

    const rental = await getRental(rentalID).then((res) => {
      return res.data.data;
    });

    const Today = rental.termin_od;
    const Tomorrow = rental.termin_do;
    const diffTime = new Date(Tomorrow) - new Date(Today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const TotalPrice = diffDays * movieData.cena;

    setForm({ dateFrom: Today, dateTill: Tomorrow, totalPrice: TotalPrice });
    setDates({ dateFrom: Today, dateTill: Tomorrow, totalPrice: TotalPrice });
  };

  const handleDates = (value) => {
    if (new Date(value) < new Date(initialStates.dateFrom)) {
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
  };
  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    switch (name) {
      case 'dateTill':
        setError((prevValue) => ({
          ...prevValue,
          globalStatus: handleDates(value),
        }));
        break;
      default:
        break;
    }

    setForm((prevValue) => ({ ...prevValue, [name]: value }));
  };

  const handleRentalDelete = async () => {
    removeRental(rentalID)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRentalUpdate = async () => {
    if (validateForm(errorState) == '') {
      const copyID = await getRental(rentalID).then((res) => {
        return res.data.data.Kopia_filmu_id;
      });

      updateRental(rentalID, {
        termin_od: initialStates.dateFrom,
        termin_do: formState.dateTill,
        Klient_id: user.userID,
        Kopia_filmu_id: copyID,
      }).then((res) => {
        console.log(res);
      });
    }
  };

  useEffect(async () => {
    const apiFetch = async () => {
      const copyID = await getRental(rentalID).then((res) => {
        return res.data.data.Kopia_filmu_id;
      });

      const movieID = await getCopy(copyID).then((res) => {
        return res.data.data.Film_idFilm;
      });

      let movieData = await getMovie(movieID)
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
        title: movieData.nazwa,
        poster: movieData.plakat,
        price: movieData.cena,
        category: categoryTmp,
        director: directorTmp,
        description: movieData.opis,
      });
      await sleep(1000);
      setBusy(false);
    };

    apiFetch();
    setInitialStates();
  }, [setBusy]);

  return (
    <div>
      <div className="container-column-50">
        <div className="wrapper">
          <div className="form-wrapper">
            <h2>{movie.title} </h2>

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
      <div className="container-column-50">
        <div className="wrapper">
          <div className="form-wrapper">
            <h2>Rental Details</h2>
            <form noValidate>
              <div className="dateFrom">
                <label htmlFor="dateFrom">Start date</label>
                <input
                  type="date"
                  name="dateFrom"
                  value={formState.dateFrom}
                  onChange={handleChange}
                  noValidate
                  disabled
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
                />
              </div>
              <h1>Total Price: {formState.totalPrice}</h1>
              <div className="submit">
                <div>
                  <Link to={'/my-movies'}>
                    <button
                      className="neutralButton"
                      onClick={handleRentalUpdate}
                    >
                      UPDATE RENTAL
                    </button>
                  </Link>
                  <Link to={'/my-movies'}>
                    <button
                      className="dangerButton"
                      onClick={handleRentalDelete}
                    >
                      REMOVE RENTAL
                    </button>
                  </Link>
                  <Link to={'/my-movies'}>
                    <button>BACK TO RENTAL LIST</button>
                  </Link>
                </div>
              </div>
              <span className="status-error">{errorState.globalStatus}</span>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRental;
