import React, { useContext, useState } from 'react';
import './Form.css';
import { UserContext } from '../Context/UserContext';
import { getUserEmail } from '../PathResolver';
import { useHistory } from 'react-router';

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validateForm = (errors) => {
  let valid = true;
  if (errors.email == '' && errors.password == '') {
    return !valid;
  }
  return valid;
};

const LoginForm = () => {
  const history = useHistory();
  const [loginState, setLoginState] = useContext(UserContext);

  const [formState, setForm] = useState({
    email: '',
    password: '',
  });

  const [errorState, setError] = useState({
    email: '',
    password: '',
    status: '',
  });

  const handleValidation = async (event) => {
    await getUserEmail(formState.email).then((res) => {
      if (res.data.data != undefined) {
        if (res.data.data.haslo == formState.password) {
          setError((prevValue) => ({ ...prevValue, status: 'Validated' }));
          setLoginState((prevValue) => ({
            ...prevValue,
            islogged: true,
            userID: res.data.data.idKlient,
            firstName: res.data.data.imieKlient,
            lastName: res.data.data.nazwiskoKlient,
            email: formState.email,
            password: formState.password,
            isAdmin: res.data.data.isAdmin,
          }));

          history.push('/home');
        } else {
          setError((prevValue) => ({
            ...prevValue,
            status: 'Wrong email or password!',
          }));
        }
      } else {
        setError((prevValue) => ({
          ...prevValue,
          status: 'Wrong email or password!',
        }));
      }
    });
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    switch (name) {
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
    } else if (formState.password != '' && formState.email != '') {
      handleValidation();
    } else {
      setError((prevValue) => ({ ...prevValue, status: 'Invalid Form' }));
    }
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit} noValidate>
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
            <button>Log In</button>
            <span className="status-error">{errorState.status}</span>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginForm;
