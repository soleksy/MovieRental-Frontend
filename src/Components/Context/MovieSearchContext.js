import React, { useState, createContext } from 'react';

const initialState = {
  movies: [],
};

export const MovieSearchContext = createContext();

const MovieProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  return (
    <MovieSearchContext.Provider value={[state, setState]}>
      {children}
    </MovieSearchContext.Provider>
  );
};

export default MovieProvider;
