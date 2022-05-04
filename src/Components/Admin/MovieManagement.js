import React from 'react';
import Searchbar from '../Searchbar/Searchbar';
const MovieManagement = () => {
  return (
    <div>
      <h1 className="text">Search for movies</h1>
      <Searchbar
        placeholder="Search for movies: ex Horror , ex Anaconda"
        searchFor="movies"
      ></Searchbar>
    </div>
  );
};

export default MovieManagement;
