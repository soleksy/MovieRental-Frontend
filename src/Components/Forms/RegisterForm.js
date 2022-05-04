import React, { useState, useContext } from 'react';
import './Form.css';
import { UserContext } from '../Context/UserContext';
import { useHistory } from 'react-router';
import { addUser, getUserEmail } from '../PathResolver';
const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

var error_state = 0;

const validateForm = (errors) => {
  let valid = true;
  if (
    errors.email == '' ||
    errors.password == '' ||
    errors.firstName == '' ||
    errors.lastName == ''
  ) {
    return !valid;
  }
  return valid;
};

async function addClient(firstName, lastName, email, password) {
  const requestBody = {
    nazwiskoKlient: lastName,
    imieKlient: firstName,
    email: email,
    haslo: password,
  };

  var response = await addUser(requestBody).then((res) => {
    return res.data.id;
  });
  if (response.status == '500') {
    error_state = 1;
    console.log(error_state);
  } else {
    error_state = 0;
  }
  return response;
}

const RegisterForm = () => {
  const history = useHistory();
  const [loginState, setLoginState] = useContext(UserContext);

  const [formState, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [errorState, setError] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    status: '',
  });

  const handleExistingUser = async () => {
    getUserEmail(formState.email).then(async (res) => {
      if (res.data.data != undefined) {
        setError((prevValue) => ({
          ...prevValue,
          status: 'An account with this email address already exists!',
        }));
      } else {
        setError((prevValue) => ({ ...prevValue, status: '' }));
        const clientID = await addClient(
          formState.firstName,
          formState.lastName,
          formState.email,
          formState.password
        );
        setLoginState((prevValue) => ({
          ...prevValue,
          islogged: true,
          userID: clientID,
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          password: formState.password,
        }));
        history.push('/home');
      }
    });
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
          [name]: value.length < 8 ? 'Password must be 8 characters long!' : '',
        }));
        break;
      default:
        break;
    }

    setForm((prevValue) => ({ ...prevValue, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm(errorState)) {
      setError((prevValue) => ({ ...prevValue, status: 'Invalid Form' }));
    } else if (
      formState.password != '' &&
      formState.email != '' &&
      formState.firstName != '' &&
      formState.lastName != ''
    ) {
      handleExistingUser();
    } else {
      setError((prevValue) => ({ ...prevValue, status: 'Invalid Form' }));
    }
  };
  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="firstName">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              name="firstName"
              onChange={handleChange}
              noValidate
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
            />
            {errorState.lastName.length > 0 && (
              <span className="error">{errorState.lastName}</span>
            )}
          </div>
          <div className="email">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              noValidate
            />
            {errorState.email.length > 0 && (
              <span className="error">{errorState.email}</span>
            )}
          </div>
          <div className="password">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              noValidate
            />
            {errorState.password.length > 0 && (
              <span className="error">{errorState.password}</span>
            )}
          </div>
          <div className="submit">
            <button>Create account!</button>
            <span className="status-error">{errorState.status}</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
