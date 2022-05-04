import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import { useHistory } from 'react-router';
import Loader from 'react-loader-spinner';
import {
  getMovie,
  getCategory,
  getDirector,
  getReviews,
  getReview,
  getUser,
  getMark,
  addRental,
  addMark,
  addReview,
  getMarks,
} from '../PathResolver';
import { Link } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import './MovieDetails.css';
const MovieDetails = (props) => {
  const history = useHistory();
  const refreshPage = () => {
    window.location.reload();
  };

  const regex = /\/movie-details\//;
  const movieID = props.location.pathname.replace(regex, '');
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useContext(UserContext);
  const [totalScore, setTotalScore] = useState(0);
  const [hover, setHover] = React.useState(-1);
  const [review, setReview] = useState({
    reviewText: '',
    reviewRating: '',
  });
  const [error, setError] = useState({
    reviewText: '',
    reviewExists: '',
    globalStatus: '',
  });
  const [movie, setMovie] = useState({
    poster: '',
    title: '',
    price: '',
    category: '',
    director: '',
    description: '',
  });
  const [isBusy, setBusy] = useState(true);

  const isLogged = () => {
    return user.islogged;
  };
  const handleAddReview = async () => {
    if (error.globalStatus == '') {
      if (review.reviewText == '') {
        setError((prevValue) => ({
          ...prevValue,
          globalStatus: 'Review cannot be  empty!',
        }));
      } else if (review.reviewRating == '') {
        setError((prevValue) => ({
          ...prevValue,
          globalStatus: 'Please select a rating before submiting!',
        }));
      } else if (error.reviewExists == 1) {
        setError((prevValue) => ({
          ...prevValue,
          globalStatus: 'You have already submited review for this movie',
        }));
      } else {
        setBusy(true);

        const mark = await addMark({
          scenariusz: review.reviewRating,
          rezyseria: review.reviewRating,
          dzwiek: review.reviewRating,
          montaz: review.reviewRating,
          Film_id: movieID,
          Klient_idKlient: user.userID,
        })
          .then((res) => {
            console.log(res);
            return res.data.id;
          })
          .catch((error) => {
            console.log(error);
          });

        const revres = await addReview({
          Klient_idKlient: user.userID,
          Film_idFilm: movieID,
          trescRecenzja: review.reviewText,
          Ocena_id: mark,
        })
          .then((res) => {
            return res.data.data;
          })
          .catch((error) => {
            console.log(error);
          });

        setError((prevValue) => ({
          ...prevValue,
          reviewExists: 1,
        }));

        setBusy(false);
      }
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    switch (name) {
      case 'reviewText':
        setError((prevValue) => ({
          ...prevValue,
          globalStatus: value == '' ? 'Review cannot be empty!' : '',
        }));
      case 'reviewRating':
        setError((prevValue) => ({
          ...prevValue,
          globalStatus:
            value == '' ? 'Please select a rating before submiting!' : '',
        }));
        break;
      default:
        break;
    }
    setReview((prevValue) => ({ ...prevValue, [name]: value }));
  };

  const handleLogIn = () => {
    history.push('/login');
  };

  const handleRedirect = () => {
    history.push('/results/movies');
  };
  useEffect(() => {
    const apiFetch = async () => {
      const reviewList = [];
      let totalScore = 0;
      let numOfScores = 0;
      let marksData = await getMarks().then((res) => {
        return res.data.data;
      });

      marksData.forEach((item) => {
        if (item.Film_id == movieID) {
          numOfScores += 1;
          totalScore += item.dzwiek;
        }
      });
      if (totalScore == 0) {
        setTotalScore('Not rated');
      } else {
        setTotalScore(Math.round((totalScore / numOfScores).toFixed(2)));
      }

      let movieData = await getMovie(movieID)
        .then((response) => {
          return response.data.data;
        })
        .catch((error) => {
          console.log(error.response);
        });

      let categoryTmp = await getCategory(movieData.Rodzaj_id)
        .then((response) => {
          return response.data.data.nazwa;
        })
        .catch((error) => {
          console.log(error.response);
        });

      let directorTmp = await getDirector(movieData.Rezyser_id)
        .then((response) => {
          return (
            response.data.data.imieRezyser +
            ' ' +
            response.data.data.nazwiskoRezyser
          );
        })
        .catch((error) => {
          console.log(error.response);
        });

      let reviews = await getReviews().then((res) => {
        return res.data.data;
      });
      if (reviews.length == 0) {
        setBusy(false);
      }

      reviews.forEach(async (item, index) => {
        if (item.Film_idFilm == movieID) {
          const author = await getUser(item.Klient_idKlient).then((res) => {
            return res.data.data;
          });

          const rating = await getMark(item.Ocena_id).then((res) => {
            return res.data.data;
          });

          reviewList.push({
            idAuthor: author.idKlient,
            author: author.imieKlient + ' ' + author.nazwiskoKlient,
            rating: rating.dzwiek,
            text: item.trescRecenzja,
          });
          if (item.Klient_idKlient == user.userID) {
            setError((prevValue) => ({
              ...prevValue,
              reviewExists: 1,
            }));
          }
        }
      });

      setReviews(reviewList);

      setMovie({
        poster: movieData.plakat,
        title: movieData.nazwa,
        price: movieData.cena,
        category: categoryTmp,
        director: directorTmp,
        description: movieData.opis,
      });

      setBusy(false);
    };
    apiFetch();
  }, [isBusy]);

  return (
    <div>
      <div className="container-column-50-details">
        <div className="wrapper-details">
          <div className="form-wrapper-details">
            <h1>{movie.title} </h1>
            <div className="box-2-details">
              <img src={movie.poster} alt="new" />
            </div>
            <h3>{movie.description}</h3>
            <br />
            <h3>Category: {movie.category}</h3>
            <h3>Director: {movie.director}</h3>
            <h3>Price per day: {movie.price} </h3>

            <Link to={'/order-details/' + movieID}>
              <button>ORDER NOW!</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container-column-50-details ">
        <div className="wrapper-details">
          <div className="form-wrapper-details">
            <h1 className="font-details"> Audience Score: {totalScore} </h1>
            <h1 className="font-details">REVIEWS:</h1>
            {reviews.length == 0 ? (
              <h2> Be the first to add a review for this movie!</h2>
            ) : (
              <div className="scrollable" id="style-7">
                {reviews.map((item) => {
                  return (
                    <div className="box-review-details">
                      <h3>Author: {item.author}</h3>
                      <p>{item.text}</p>
                      <h3>Overall score: {item.rating}</h3>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="wrapper">
              <div className="box-4-details">
                <textarea
                  id="reviewText"
                  cols="60"
                  rows="6"
                  name="reviewText"
                  onChange={handleChange}
                  className="text-area-details"
                  id="style-7"
                  placeholder="Write your review here"
                ></textarea>
                <br />
                <Rating
                  max={10}
                  name="reviewRating"
                  size="large"
                  value={review.reviewRating}
                  precision={0.5}
                  onChange={handleChange}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                />
              </div>
            </div>
            <div className="box-1-details">
              {isLogged() ? (
                <button onClick={handleAddReview}>Add Review</button>
              ) : (
                <button onClick={handleLogIn}>Log in to add review</button>
              )}
              <div>
                <h2 className="center-details "> OR </h2>
              </div>
              <button onClick={handleRedirect}>
                Go back to search results
              </button>
            </div>
            {error.globalStatus.length > 0 && (
              <span className="error-details">{error.globalStatus}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MovieDetails;
