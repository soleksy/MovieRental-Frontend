import React from 'react';
import Searchbar from '../Searchbar/Searchbar';
const UserManagement = () => {
  return (
    <div>
      <h1 className="text">Search for users</h1>
      <Searchbar
        placeholder="Search for users ex: user@gmail.com, ex: Marcin"
        searchFor="users"
      ></Searchbar>
    </div>
  );
};

export default UserManagement;
