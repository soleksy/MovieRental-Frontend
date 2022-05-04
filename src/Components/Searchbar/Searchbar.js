import React from 'react';
import { useState } from 'react';
import './Searchbar.css';
import { useContext } from 'react';
import { MovieSearchContext } from '../Context/MovieSearchContext';
import { UserSearchContext } from '../Context/UserSearchContext';
import { useHistory } from 'react-router-dom';
import { getUsers, getDirector, getCategory, getMovies } from '../PathResolver';

function Searchbar({ placeholder, searchFor }) {
  const history = useHistory();

  const [searchText, setSearchText] = useState('');

  const handleInput = (e) => {
    const text = e.target.value;
    setSearchText(text);
  };

  const handleEnterKeyPressed = (e) => {
    if (e.key === 'Enter') {
      searchFor === 'movies'
        ? onMovieSearch(searchText)
        : onUserSearch(searchText);
    }
  };

  const [movies, setMovies] = useContext(MovieSearchContext);
  const [users, setUsers] = useContext(UserSearchContext);

  const onMovieSearch = async () => {
    const movieList = [];

    const results = await getMovies()
      .then((res) => res.data.data)
      .catch((error) => {
        console.log(error.response);
      });

    for (const movie of results) {
      var directorTemp = '';
      var categoryTemp = '';

      await getCategory(movie.Rodzaj_id)
        .then(function (item) {
          categoryTemp = item.data.data.nazwa;
        })
        .catch((error) => {
          console.log(error.response);
        });

      await getDirector(movie.Rezyser_id)
        .then(function (item) {
          directorTemp =
            item.data.data.imieRezyser + ' ' + item.data.data.nazwiskoRezyser;
        })
        .catch((error) => {
          console.log(error.response);
        });
      if (searchText === movie.nazwa || searchText === categoryTemp) {
        movieList.push({
          id: movie.idFilm,
          poster: movie.plakat,
          title: movie.nazwa,
          price: movie.cena,
          category: categoryTemp,
          director: directorTemp,
          description: movie.opis,
        });
      }
    }

    setMovies((prevState) => {
      return { ...prevState, movies: movieList };
    });

    history.push('/results/movies');
  };

  const onUserSearch = async (text) => {
    const userList = [];

    const results = await getUsers()
      .then((res) => res.data.data)
      .catch((error) => {
        console.log(error.response);
      });

    for (const user of results) {
      if (
        searchText === user.imieKlient ||
        searchText === user.nazwiskoKlient ||
        searchText === user.email
      ) {
        userList.push({
          id: user.idKlient,
          firstname: user.imieKlient,
          lastname: user.nazwiskoKlient,
          email: user.email,
          password: user.haslo,
          isAdmin: user.isAdmin,
        });
      }
    }

    setUsers((prevState) => {
      return { ...prevState, users: userList };
    });

    history.push('/results/users');
  };

  return (
    <div className="center">
      <input
        className="input"
        onChange={handleInput}
        onKeyPress={handleEnterKeyPressed}
        type="text"
        value={searchText}
        placeholder={placeholder}
      />
      {searchFor == 'movies' ? (
        <button className="searchbar-button" onClick={onMovieSearch}>
          Search!
        </button>
      ) : (
        <button className="searchbar-button" onClick={onUserSearch}>
          Search!
        </button>
      )}
    </div>
  );
}

export default Searchbar;
