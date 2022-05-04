import React from 'react';
import Searchbar from './Searchbar/Searchbar';

const Logout = () => {
  return (
    <div>
      <h1 className="text">Successfully logged out!</h1>
      <Searchbar
        placeholder="Search for movies: ex Horror , ex Anaconda"
        searchFor="movies"
      ></Searchbar>
    </div>
  );
};

export default Logout;
