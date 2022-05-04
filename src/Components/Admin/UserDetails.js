import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import '../Forms/Form.css';
import {
  getUser,
  updateUser,
  removeUser,
  getUserEmail,
  getReviews,
  getRentals,
  getMarks,
  removeReview,
  removeMark,
  removeRental,
} from '../PathResolver';
import { UserSearchContext } from '../Context/UserSearchContext';
const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const MovieDetails = (props) => {
  const history = useHistory();
  const regex = /\/user-details\//;
  const user_id = props.location.pathname.replace(regex, '');
  const [initialState, setInitialState] = useState(null);

  const [users, setUsers] = useContext(UserSearchContext);

  const [formState, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    isAdmin: '',
  });

  const [errorState, setError] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    isAdmin: '',
    status: '',
  });

  const validAdminStatus = (status) => {
    return (status == 1 || status == 0) && status != '';
  };
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const formNotEmpty = () => {
    return (
      formState.firstName != '' &&
      formState.lastName != '' &&
      formState.email != '' &&
      formState.password != '' &&
      formState.isAdmin != ''
    );
  };

  const validateForm = (errors) => {
    let valid = true;
    if (errors.email == '' && errors.password == '') {
      return !valid;
    }
    return valid;
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    switch (name) {
      case 'firstName':
        setError((prevValue) => ({
          ...prevValue,
          [name]: value.length == 0 ? 'First Name cannot be empty!' : '',
        }));
        break;
      case 'lastName':
        setError((prevValue) => ({
          ...prevValue,
          [name]: value.length == 0 ? 'Last Name cannot be empty!' : '',
        }));
        break;
      case 'email':
        setError((prevValue) => ({
          ...prevValue,
          [name]: !validEmailRegex.test(value) ? 'Email is not valid' : '',
        }));
        break;
      case 'password':
        setError((prevValue) => ({
          ...prevValue,
          [name]:
            value.length < 8
              ? 'Password  needs to be 8 or more characters'
              : '',
        }));
        break;

      case 'isAdmin':
        setError((prevValue) => ({
          ...prevValue,
          [name]: !validAdminStatus(value) ? 'Set admin status to 0 or 1' : '',
        }));
        break;

      default:
        break;
    }

    setForm((prevValue) => ({ ...prevValue, [name]: value }));
  };

  useEffect(() => {
    const apiFetch = async () => {
      let userData = await getUser(user_id)
        .then((response) => {
          setForm({
            firstName: response.data.data.imieKlient,
            lastName: response.data.data.nazwiskoKlient,
            email: response.data.data.email,
            password: response.data.data.haslo,
            isAdmin: response.data.data.isAdmin,
          });

          setInitialState({
            firstName: response.data.data.imieKlient,
            lastName: response.data.data.nazwiskoKlient,
            email: response.data.data.email,
            password: response.data.data.haslo,
            isAdmin: response.data.data.isAdmin,
          });

          return response.data.data;
        })
        .catch((error) => {
          console.log(error.response);
        });
    };
    apiFetch();
  }, []);

  const handleUserRemove = async (event) => {
    event.preventDefault();
    if (validateForm(errorState)) {
      setError((prevValue) => ({ ...prevValue, status: 'Invalid Form' }));
    } else if (formNotEmpty()) {
      const reviews = await getReviews()
        .then((res) => {
          return res.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
      const rentals = await getRentals()
        .then((res) => {
          return res.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
      const marks = await getMarks()
        .then((res) => {
          return res.data.data;
        })
        .catch((error) => {
          console.log(error);
        });

      await reviews.forEach((item) => {
        if (item.Klient_idKlient == user_id) {
          removeReview(item.idRecenzja)
            .then((res) => {
              return res;
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });

      await marks.forEach((item) => {
        if (item.Klient_idKlient == user_id) {
          removeMark(item.idOcena)
            .then((res) => {
              return res;
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });

      await rentals.forEach((item) => {
        if (item.Klient_id == user_id) {
          removeRental(item.idWypozyczenie)
            .then((res) => {
              return res;
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });

      removeUser(user_id).catch((error) => {
        console.log(error.response);
      });
      history.push('/results/users');
    } else {
      setError((prevValue) => ({ ...prevValue, status: 'Invalid Form' }));
    }
  };

  const handleUserUpdate = async (event) => {
    event.preventDefault();
    if (validateForm(errorState)) {
      setError((prevValue) => ({ ...prevValue, status: 'Invalid Form' }));
    } else if (formNotEmpty()) {
      const getUser = await getUserEmail(formState.email)
        .then((res) => {
          return res.data.data;
        })
        .catch((error) => {
          console.log(error.response);
        });

      if (getUser != undefined && initialState.email != formState.email) {
        setError((prevValue) => ({
          ...prevValue,
          status: 'An account with this email address already exists!',
        }));
      } else {
        setError((prevValue) => ({ ...prevValue, status: '' }));

        const putUser = await updateUser(user_id, {
          nazwiskoKlient: formState.lastName,
          imieKlient: formState.firstName,
          email: formState.email,
          haslo: formState.password,
          isAdmin: formState.isAdmin,
        })
          .then((res) => {
            return res;
          })
          .catch((error) => {
            console.log(error);
          });

        users.users.forEach((item) => {
          if (item.id == initialState.id) {
            item.firstName = formState.firstName;
            item.lastname = formState.lastName;
            item.password = formState.password;
            item.email = formState.email;
            item.isAdmin = formState.isAdmin;
          }
          setUsers(users);
        });
        history.push('/results/users');
      }
    } else {
      setError((prevValue) => ({ ...prevValue, status: 'Invalid Form' }));
    }
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <form>
          <div className="firstName">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              name="firstName"
              onChange={handleChange}
              noValidate
              value={formState.firstName}
            />
            {errorState.firstName.length > 0 && (
              <span className="error">{errorState.firstName}</span>
            )}
          </div>

          <div className="lastName">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              name="lastName"
              onChange={handleChange}
              noValidate
              value={formState.lastName}
            />
            {errorState.lastName.length > 0 && (
              <span className="error">{errorState.lastName}</span>
            )}
          </div>

          <div className="email">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              UserSearchContext
              name="email"
              onChange={handleChange}
              noValidate
              value={formState.email}
            />
            {errorState.email.length > 0 && (
              <span className="error">{errorState.email}</span>
            )}
          </div>

          <div className="password">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              name="password"
              onChange={handleChange}
              noValidate
              value={formState.password}
            />
            {errorState.password.length > 0 && (
              <span className="error">{errorState.password}</span>
            )}
          </div>

          <div className="isAdmin">
            <label htmlFor="isAdmin">Admin Status</label>
            <input
              type="text"
              name="isAdmin"
              onChange={handleChange}
              noValidate
              value={formState.isAdmin}
            />
            {errorState.isAdmin.length > 0 && (
              <span className="error">{errorState.isAdmin}</span>
            )}
          </div>
        </form>
        <button className="neutralButton" onClick={handleUserUpdate}>
          UPDATE USER
        </button>
        <button className="dangerButton" onClick={handleUserRemove}>
          REMOVE USER
        </button>
        <Link to={'/results/users'}>
          <button>BACK TO SEARCH RESULTS</button>
        </Link>
        <span className="status-error">{errorState.status}</span>
      </div>
    </div>
  );
};

export default MovieDetails;
