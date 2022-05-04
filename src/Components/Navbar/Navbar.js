import React, { useContext } from 'react';
import { LoggedOutItems, LoggedInItems, AdminItems } from './MenuItems';
import './Navbar.css';
import { Link } from 'react-router-dom';

import { UserContext } from '../Context/UserContext';

const Navbar = () => {
  const localState = { clicked: false };

  const [userState, setLoginState] = useContext(UserContext);

  const handleChange = () => {
    if (userState.islogged === false) {
      return LoggedOutItems;
    } else if (userState.isAdmin == 1) {
      return AdminItems;
    } else {
      return LoggedInItems;
    }
  };

  const handleLogout = () => {
    setLoginState((prevValue) => ({
      ...prevValue,

      islogged: false,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      isAdmin: '',
    }));
  };

  return (
    <nav className="NavbarItems">
      <h1 className="navbar-title">
        <Link to="/home" className="navbar-title">
          Moviex
        </Link>
      </h1>
      <h1 className="navbar-logo">
        {' '}
        <Link to="/home">
          <i className="fas fa-film"></i>{' '}
        </Link>
      </h1>
      <ul className={localState.clicked ? 'nav-menu active' : 'nav-menu'}>
        {handleChange().map((item, index) => {
          return (
            <li key={index}>
              {' '}
              {item.title == 'Logout' ? (
                <Link
                  className={item.cName}
                  to={item.url}
                  onClick={handleLogout}
                >
                  {item.title}
                </Link>
              ) : (
                <Link className={item.cName} to={item.url}>
                  {item.title}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
