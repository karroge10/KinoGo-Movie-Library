import React, { useState, useEffect } from 'react';

import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'

import Select from "react-dropdown-select";

import Movie from './components/Movie'

import { options } from "./options";


const popularAPI = 'https://api.themoviedb.org/3/discover/movie?api_key=5be75f9f183da240b34367329058206a&sort_by=popularity.desc&include_video=false&vote_count.gte=500'
const topRatedAPI = 'https://api.themoviedb.org/3/discover/movie?api_key=5be75f9f183da240b34367329058206a&sort_by=vote_average.desc&include_video=false&vote_count.gte=5000'
const oldAPI = 'https://api.themoviedb.org/3/discover/movie?api_key=5be75f9f183da240b34367329058206a&sort_by=primary_release_date.asc&include_video=false&vote_count.gte=100'
const newAPI = 'https://api.themoviedb.org/3/discover/movie?api_key=5be75f9f183da240b34367329058206a&sort_by=primary_release_date.desc&include_video=false&vote_count.gte=50'

const searchAPI = 'https://api.themoviedb.org/3/search/movie?api_key=5be75f9f183da240b34367329058206a&language=English&include_adult=false&query='
const genreAPI = 'https://api.themoviedb.org/3/discover/movie?api_key=5be75f9f183da240b34367329058206a&language=en-US&sort_by=vote_count.desc&include_adult=false&include_video=false1&with_genres='


function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [movies, setMovies] = useState([]);

  const [searchWord, setSearchWord] = useState('');

  const [page, setPage] = useState(parseInt(sessionStorage.getItem('page')));
  const [count, setCount] = useState(parseInt(sessionStorage.getItem('count')))
  const [maxPage, setMaxPage] = useState(parseInt(sessionStorage.getItem('maxPage')))


  if (sessionStorage.api == null){
    sessionStorage.setItem('api', popularAPI)
    // document.getElementById('popularAPI').classList.add('active') ПОЧЕМУ ТО НЕ РАБОТАЕТ. Сделать такое для остальных через session storage чтобы при обновлении страницы не менялся цвет кнопки
  }
  
  useEffect(() => {
    pageCheck();
    sessionStorage.setItem('page', page)
    sessionStorage.setItem('count', count)
    console.log(sessionStorage)
    getMovies(sessionStorage.getItem('api'))
  }, [count])

  var moviesList = []

  
  async function getMovies(API){
    await fetch(API+'&page='+count)
      .then(res => res.json())
      .then(
        data => {
          var maxPage = data.total_pages
          setMaxPage(maxPage)
          sessionStorage.setItem('maxPage', maxPage)

          console.log(API+'&page='+count)
          if (data.results !== undefined){
              moviesList = data.results
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
    await fetch(API+'&page='+(count+1))
      .then(res => res.json())
      .then(
        data => {
          console.log(API+'&page='+(count+1))
          if (data.results !== undefined){
            moviesList.push(...data.results)
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
    await fetch(API+'&page='+(count+2))
      .then(res => res.json())
      .then(
        data => {
          console.log(API+'&page='+(count+2))
          if (data.results !== undefined){
            moviesList.push(...data.results)
            setMovies(moviesList);
            setIsLoaded(true);
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
   
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    document.querySelector('.react-dropdown-select-content').children[0].innerText = 'Genre'    // ПОМЕНЯТЬ GENRE НА ТЕКСТ КОТОРЫЙ ХРАНИМ В СЕШН СТОРАДЖ ПРИ ОБНОВЛЕНИИ СТРАНИЦЫ
    clearButtons()
    setCount(1)
    setPage(1)
    sessionStorage.setItem('api', searchAPI + searchWord)
    if (page == 1){
      getMovies(searchAPI + searchWord)
    }
  };

  const handleOnChange = (e) => {
    setSearchWord(e.target.value);
  };

  const chooseGenre = (e) => {
    setSearchWord('');
    clearButtons()
    setCount(1)
    setPage(1)
    sessionStorage.setItem('api', genreAPI + e[0].id)
    if (page == 1){
      getMovies(genreAPI + e[0].id)
    }
  };

   function chooseSorting(e) {
    clearButtons()
    setSearchWord('');
    setCount(1)
    setPage(1)

    document.querySelector('.react-dropdown-select-content').children[0].innerText = 'Genre'
    switch (e.target.id){
      case 'popularAPI':
        sessionStorage.setItem('api', popularAPI)
        if (page == 1){
          getMovies(popularAPI);
        }
        e.target.className = 'sort-button active'
        break;
      case 'topRatedAPI':
        sessionStorage.setItem('api', topRatedAPI)
        if (page == 1){
          getMovies(topRatedAPI);
        }
        e.target.className = 'sort-button active'
        break;
      case 'newAPI':
        sessionStorage.setItem('api', newAPI)
        if (page == 1){
          getMovies(newAPI);
        }
        e.target.className = 'sort-button active'
        break;
      case 'oldAPI':
        sessionStorage.setItem('api', oldAPI)
        if (page == 1){
          getMovies(oldAPI);
        }
        e.target.className = 'sort-button active'
        break;
    }
  }

  function clearButtons() {
    const clickedButton = document.querySelector('.active');
    if (clickedButton !== null){
      document.querySelector('.active').className = 'sort-button'
    }
  }
  
  const changePage = (e) => {
    if (e.target.id == 'next-page'){
      console.log(page, count, maxPage)
      if (count < maxPage-2){
        setPage(page+1)
        setCount(count+3)
      } else{
        setPage(page)
        setCount(count)
      }
    } else{
      if (page > 1){
        setPage(page-1)
        setCount(count-3)
      } else{
        setPage(page)
        setCount(count)
      }
    }
  }

  function pageCheck(){
    if (page == null || isNaN(page)){
      setPage(1)
      setCount(1)
    } else if (page == 1){
      setCount(1)
      document.getElementById('previous-page').classList.add('inactive')
      document.getElementById('next-page').classList.remove('inactive')
    } else{
      document.getElementById('previous-page').classList.remove('inactive')
      document.getElementById('next-page').classList.remove('inactive')
    }
    if(count >= maxPage-3) {
      document.getElementById('next-page').classList.add('inactive')
      document.getElementById('previous-page').classList.remove('inactive')
    }
  }



  if (error) {
    console.log(error.message)
  } else {
    return (
      <div className='page-wrap'>
        <div className="search-container">
          <div className="sorting-container">
            <a className="sort-button" id="popularAPI" onClick={chooseSorting}>Popular</a>
            <a className="sort-button" id="topRatedAPI" onClick={chooseSorting}>Top Rated</a>
            <a className="sort-button" id="newAPI" onClick={chooseSorting}>New</a>
            <a className="sort-button" id="oldAPI" onClick={chooseSorting}>Old</a>
          </div>
          <div className="search-and-genre">
            <form className="form-container" onSubmit={handleOnSubmit}>
              <input className="input-search" placeholder="Search..." type="search" value={searchWord} onChange={handleOnChange} required></input>
            </form>
            <div className="genre-changer">
              <Select 
                className="genre" 
                labelField={'name'} 
                searchable={false} 
                options={options} 
                onChange={chooseGenre} 
                name="genres" 
                placeholder="Genre" 
                dropdownHeight="500px"  
                clearOnBlur="true"/>
            </div>
          </div>
        </div>
        <div className="movies">
          {movies.length > 0 && movies.map((movie)=>
            <Movie key={movie.id} {...movie}/>
          )}
        </div>
        <div className="page-changer">
          <a className="page-arrow" id="previous-page" onClick={changePage}>{'<'}</a>
          <a className="current-page">{page}</a>
          <a className="page-arrow" id="next-page" onClick={changePage}>{'>'}</a>
        </div>

    </div>
    );
  }
}

export default App;
