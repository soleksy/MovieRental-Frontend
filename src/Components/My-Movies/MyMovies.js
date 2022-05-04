import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { getRentals, getMovie, getCopy } from '../PathResolver';
import { UserContext } from '../Context/UserContext';
import { Link } from 'react-router-dom';
import './MyMovies.css';
const MyMovies = () => {
  const [rentals, setRentals] = useState([]);
  const [user, setUser] = useContext(UserContext);

  const [isBusy, setBusy] = useState(true);

  useEffect(() => {
    var singleRecord = {
      title: '',
      dateFrom: '',
      dateTill: '',
    };
    const userRentals = [];

    const apiFetch = async () => {
      const rentals = await getRentals().then((res) => {
        return res.data.data;
      });

      rentals.forEach(async (item, index) => {
        if (item.Klient_id == user.userID) {
          const copy = await getCopy(item.Kopia_filmu_id).then((res) => {
            return res.data.data;
          });
          const movie = await getMovie(copy.Film_idFilm).then((res) => {
            return res.data.data;
          });

          singleRecord = {
            id: item.idWypozyczenie,
            poster: movie.plakat,
            title: movie.nazwa,
            dateFrom: item.termin_od,
            dateTill: item.termin_do,
          };

          userRentals.push(singleRecord);
        }
        if (index == rentals.length - 1) {
          setBusy(false);
        }
      });

      setRentals(userRentals);
    };
    apiFetch();
  }, [setBusy]);

  return (
    <div>
      {rentals.map((item) => {
        return (
          <div className="container-row-50">
            <div className="wrapper">
              <div className="form-wrapper-mymovies">
                <h2>{item.title}</h2>
                <div className="box-2">
                  <img src={item.poster} alt="new" className="posterFull" />
                </div>
                <h1>Movie available between:</h1>
                <h1>{item.dateFrom}</h1>
                <h1>{item.dateTill}</h1>
                <Link to={'/rentals/' + item.id}>
                  <button>Manage this rental</button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyMovies;
