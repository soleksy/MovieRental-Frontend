import { BrowserRouter as Router, Route } from 'react-router-dom';

import '../Styles/App.css';
import Navbar from './Navbar/Navbar.js';
import Home from './Home';
import Login from './Login';
import Register from './Register';

import MovieSearchResult from './SearchResult/MovieSearchResult';

import UserContext from './Context/UserContext';
import MovieSearchContext from './Context/MovieSearchContext';
import UserSearchContext from './Context/UserSearchContext';
import Logout from './Logout';
import Searchbar from './Searchbar/Searchbar';
import OrderDetails from './OrderDetails/OrderDetails';
import MovieManagement from './Admin/MovieManagement';
import UserManagement from './Admin/UserManagement';
import UserSearchResult from './SearchResult/UserSearchResult';
import UserDetails from './Admin/UserDetails';
import MovieDetailsAdmin from './Admin/MovieDetailsAdmin';
import ManageRental from './ManageRental';
import MyMovies from './My-Movies/MyMovies';
import MovieDetails from './MovieDetails/MovieDetails';
import { Redirect } from 'react-router';
function App() {
  return (
    <Router>
      <UserContext>
        <Navbar />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />

        <MovieSearchContext>
          <UserSearchContext>
            <Route path="/home" component={Home} />
            <Route
              exact
              path="/"
              render={() => {
                return <Redirect to="/home" />;
              }}
            />
            <Route path="/logout" component={Logout} />
            <Route path="/results/movies" component={MovieSearchResult} />
            <Route path="/results/users" component={UserSearchResult} />

            <Route path="/my-movies" component={MyMovies} />

            <Route
              path="/movie-details/:id([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})?"
              component={MovieDetails}
            />
            <Route
              path="/order-details/:id([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})?"
              component={OrderDetails}
            />
            <Route
              path="/rentals/:id([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})?"
              component={ManageRental}
            />
            <Route
              path="/admin/movie-details:id([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})?"
              component={MovieDetailsAdmin}
            />
            <Route
              path="/user-details/:id([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})?"
              component={UserDetails}
            />
            <Route path="/manage-movies" component={MovieManagement} />
            <Route path="/manage-users" component={UserManagement} />
          </UserSearchContext>
        </MovieSearchContext>
      </UserContext>
    </Router>
  );
}

export default App;
