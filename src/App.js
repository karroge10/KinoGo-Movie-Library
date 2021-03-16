import React, { useState, useEffect } from 'react';

import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'

import Select from "react-dropdown-select";

import Movie from './components/Movie'

import { options } from "./options";


const popularAPI = 'https://api.themoviedb.org/3/discover/movie?api_key=5be75f9f183da240b34367329058206a&sort_by=popularity.desc&include_video=false&page=1&vote_count.gte=500'
const topRatedAPI = 'https://api.themoviedb.org/3/discover/movie?api_key=5be75f9f183da240b34367329058206a&sort_by=vote_average.desc&include_video=false&page=1&vote_count.gte=3000'
const oldAPI = 'https://api.themoviedb.org/3/discover/movie?api_key=5be75f9f183da240b34367329058206a&sort_by=primary_release_date.asc&include_video=false&page=1&vote_count.gte=100'
const newAPI = 'https://api.themoviedb.org/3/discover/movie?api_key=5be75f9f183da240b34367329058206a&sort_by=primary_release_date.desc&include_video=false&page=1&vote_count.gte=50'

const searchAPI = 'https://api.themoviedb.org/3/search/movie?api_key=5be75f9f183da240b34367329058206a&language=English&page=1&include_adult=false&query='
const genreAPI = 'https://api.themoviedb.org/3/discover/movie?api_key=5be75f9f183da240b34367329058206a&language=en-US&sort_by=vote_count.desc&include_adult=false&include_video=false&page=1&with_genres='


function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [movies, setMovies] = useState([]);

  const [searchWord, setSearchWord] = useState('');

  useEffect(() => {
    getMovies(popularAPI)
  }, [])

  const getMovies = (API) => {
    fetch(API)
      .then(res => res.json())
      .then(
        data => {
          console.log(data.results)
          setMovies(data.results);
          setIsLoaded(true);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    getMovies(searchAPI + searchWord)
  };

  const handleOnChange = (e) => {
    setSearchWord(e.target.value);
  };

  const chooseGenre = (e) => {
    getMovies(genreAPI + e[0].id)
  };


  if (error) {
    console.log(error.message)
  } else {
    return (
      <div className='page-wrap'>
        <div className="search-container">
          <form className="form-container" onSubmit={handleOnSubmit}>
            <input className="input-search" placeholder="Search..." type="search" value={searchWord} onChange={handleOnChange}></input>
          </form>
          <div className="genre-changer">
            <Select className="genre" labelField={'name'} searchable={false} options={options} onChange={chooseGenre} placeholder="Genre" dropdownHeight="500px" />
          </div>
        </div>
        <div div className="movies-container">
          <div className="movies">
            {movies.length > 0 && movies.map((movie)=>
              <Movie key={movie.id} {...movie}/>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
