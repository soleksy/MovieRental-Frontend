import React, { useContext, useState, useEffect } from 'react';
import { MovieSearchContext } from '../Context/MovieSearchContext';
import { UserContext } from '../Context/UserContext';
import './SearchResult.css';

import { Link } from 'react-router-dom';
const MovieSearchResult = () => {
  const [user, setUser] = useContext(UserContext);
  const [movies, setMovies] = useContext(MovieSearchContext);

  const [localMovies, setLocalMovies] = useState([]);
  var counter = 0;

  useEffect(() => {
    const data = localStorage.getItem('movie-results');
    if (data) {
      setLocalMovies(data);
    }
  }, [setLocalMovies]);

  useEffect(() => {
    setLocalMovies(movies.movies);

    localStorage.setItem('movie-results', JSON.stringify(localMovies));
  }, [localMovies]);

  const isAdmin = () => {
    return user.isAdmin == 1;
  };
  const localEmpty = () => {
    return localMovies.length > 0;
  };
  return (
    <div className="background-wrapper">
      {localEmpty() ? (
        localMovies.map((item) => {
          return (
            <div className="container-column-50">
              <div className="wrapper">
                <div className="form-wrapper-search">
                  <div className="box-1-search">
                    <h1>{item.title} </h1>
                  </div>
                  <div className="box-2-search">
                    <img src={item.poster} alt="new" className="posterResult" />
                  </div>
                  <div>
                    <div className="box-3-search">
                      <h3>{item.description}</h3>
                      <br />
                      <h3>Category: {item.category}</h3>
                      <h3>Director: {item.director}</h3>
                      <h3>Price per day: {item.price} </h3>
                    </div>
                    {!isAdmin() ? (
                      <div className="box-4-search">
                        <Link to={'/movie-details/' + item.id}>
                          <button>MORE DETAILS</button>
                        </Link>
                      </div>
                    ) : (
                      <div className="box-4-search">
                        <Link to={'/admin/movie-details/' + item.id}>
                          <button>MANAGE MOVIE</button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div>
          <h1 className="text">No movies found</h1>
        </div>
      )}
    </div>
  );
};

export default MovieSearchResult;
