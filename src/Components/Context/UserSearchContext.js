import React, { useState, createContext } from 'react';

const initialState = {
  users: [],
};

export const UserSearchContext = createContext();

const UserSearchProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  return (
    <UserSearchContext.Provider value={[state, setState]}>
      {children}
    </UserSearchContext.Provider>
  );
};

export default UserSearchProvider;
