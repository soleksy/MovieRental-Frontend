import React, { useContext, useState, useEffect } from 'react';
import './SearchResult.css';
import { Link } from 'react-router-dom';
import { UserSearchContext } from '../Context/UserSearchContext';

const UserSearchResult = () => {
  const [localUsers, setLocalUsers] = useState([]);
  const [users, setUsers] = useContext(UserSearchContext);

  useEffect(() => {
    const data = localStorage.getItem('user-results');

    if (data) {
      setLocalUsers(users.users);
    }
  }, [users]);

  useEffect(() => {
    localStorage.setItem('user-results', JSON.stringify(users.users));
  });

  return (
    <div>
      {localUsers.length > 0 ? (
        localUsers.map((item) => {
          return (
            <div className="container-row-50">
              <div className="wrapper-search">
                <div className="form-wrapper-search-user">
                  <div>
                    <h3>Firstname: {item.firstname} </h3>
                    <h3>Lastname: {item.lastname} </h3>
                    <h3>Email: {item.email} </h3>
                    <h3>Pasword: {item.password}</h3>
                    <h3>isAdmin: {item.isAdmin}</h3>
                    <Link to={'/user-details/' + item.id}>
                      <button>MORE DETAILS</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div>
          <h1 className="text">No users found</h1>
          <Link to="/manage-users">
            <button className="searchbar-button ">GO BACK</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserSearchResult;
