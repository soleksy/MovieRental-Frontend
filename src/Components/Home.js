import Searchbar from './Searchbar/Searchbar';

const Home = () => {
  return (
    <div>
      <h1 className="text"> Search for movies ! </h1>
      <Searchbar
        placeholder="Search for movies: ex 'The Shawshank Redemption' or 'Drama'"
        searchFor="movies"
      ></Searchbar>
    </div>
  );
};

export default Home;
