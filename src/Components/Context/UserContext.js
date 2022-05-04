import React, { useState, createContext } from 'react';

const initialState = {
  islogged: false,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  isAdmin: '',
};

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  return (
    <UserContext.Provider value={[state, setState]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
