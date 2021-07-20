import React, { useState, useEffect } from 'react';


import Select from "react-dropdown-select";

import Movie from './components/Movie';
import Nav from './components/Nav';
import Footer from './components/Footer'

import { options } from "./options";


const popularAPI = 'https://api.themoviedb.org/3/discover/movie?api_key=5be75f9f183da240b34367329058206a&sort_by=popularity.desc&include_video=false&vote_count.gte=500'
const topRatedAPI = 'https://api.themoviedb.org/3/discover/movie?api_key=5be75f9f183da240b34367329058206a&sort_by=vote_average.desc&include_video=false&vote_count.gte=6000'
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
    sessionStorage.setItem('button', 'popularAPI')
  }

  
  useEffect(() => {

    sessionStorage.setItem('page', page)
    sessionStorage.setItem('count', count)
    getMovies(sessionStorage.getItem('api'))
    pageCheck();
      if (sessionStorage.getItem('genre')){
        removePreviousGenre()
      }
      if (sessionStorage.getItem('button')){
        document.getElementById(sessionStorage.getItem('button')).className = 'sort-button active'
      }
      if (sessionStorage.getItem('search')){  
        setSearchWord(sessionStorage.getItem('search'))
      }

  }, [count])

  var moviesList = []

  
  async function getMovies(API){
    await fetch(API+'&page='+count)
      .then(res => res.json())
      .then(
        data => {
          if(data.total_pages){
            var maxPage = data.total_pages
            setMaxPage(maxPage)
            sessionStorage.setItem('maxPage', maxPage)
          }
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
    document.querySelector('.react-dropdown-select-content').children[0].innerText = 'Genre'
    clearButtons()
    setCount(1)
    setPage(1)
    sessionStorage.removeItem('genre')
    sessionStorage.removeItem('button')
    sessionStorage.setItem('api', searchAPI + searchWord)
    sessionStorage.setItem('search', searchWord)
    if (page == 1){
      getMovies(searchAPI + searchWord)
    }
  };

  const handleOnChange = (e) => {
    setSearchWord(e.target.value);
  };

  const chooseGenre = (e) => {
    let genreBox = document.querySelector('.react-dropdown-select-content')

    setSearchWord('');
    clearButtons()
    setCount(1)
    setPage(1)
    sessionStorage.setItem('api', genreAPI + e[0].id)
    sessionStorage.setItem('genre', e[0].id)
    sessionStorage.removeItem('button')
    sessionStorage.removeItem('search')
    if(genreBox.children.length > 2){
      genreBox.removeChild(genreBox.children[0])
    }
    if (page == 1){
      getMovies(genreAPI + e[0].id)
    }
  };

   function chooseSorting(e) {
    clearButtons()
    setSearchWord('');
    setCount(1)
    setPage(1)
    sessionStorage.removeItem('genre')
    sessionStorage.removeItem('search')
    document.querySelector('.react-dropdown-select-content').children[0].innerText = 'Genre'
    switch (e.target.id){
      case 'popularAPI':
        sessionStorage.setItem('api', popularAPI)
        if (page == 1){
          getMovies(popularAPI);
        }
        e.target.className = 'sort-button active'
        sessionStorage.setItem('button', 'popularAPI')
        break;
      case 'topRatedAPI':
        sessionStorage.setItem('api', topRatedAPI)
        if (page == 1){
          getMovies(topRatedAPI);
        }
        e.target.className = 'sort-button active'
        sessionStorage.setItem('button', 'topRatedAPI')
        break;
      case 'newAPI':
        sessionStorage.setItem('api', newAPI)
        if (page == 1){
          getMovies(newAPI);
        }
        e.target.className = 'sort-button active'
        sessionStorage.setItem('button', 'newAPI')
        break;
      case 'oldAPI':
        sessionStorage.setItem('api', oldAPI)
        if (page == 1){
          getMovies(oldAPI);
        }
        e.target.className = 'sort-button active'
        sessionStorage.setItem('button', 'oldAPI')
        break;
    }
  }

  function clearButtons() {
    const clickedButton = document.querySelector('.active');
    if (clickedButton !== null){
      document.querySelector('.active').className = 'sort-button'
    }
  }
  
  function removePreviousGenre() {
    if (document.querySelector('.react-dropdown-select-content').children.length == 1){
      options.forEach(elem => {
        if (elem.id == parseInt(sessionStorage.getItem('genre'))){
          let genreText = document.createElement("span")
          genreText.innerHTML = elem.name
          let genreBox = document.querySelector('.react-dropdown-select-content')
          genreBox.prepend(genreText)
          genreBox.children[1].placeholder = ''
          genreBox.children[1].removeAttribute('size')
          genreBox.children[1].className = 'hide-input'
        }
      });
    }
  }
  const changePage = (e) => {
    if (e.target.className.split(' ')[1] == 'next-page'){
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
      document.querySelectorAll('.previous-page').forEach(arrow => {
        arrow.classList.add('inactive')
      });
      document.querySelectorAll('.next-page').forEach(arrow => {
        arrow.classList.remove('inactive')
      });
    } else{
      document.querySelectorAll('.previous-page').forEach(arrow => {
        arrow.classList.remove('inactive')
      });
      document.querySelectorAll('.next-page').forEach(arrow => {
        arrow.classList.remove('inactive')
      });
    }
    if(count >= maxPage-3) {
      document.querySelectorAll('.previous-page').forEach(arrow => {
        arrow.classList.remove('inactive')
      });
      document.querySelectorAll('.next-page').forEach(arrow => {
        arrow.classList.add('inactive')
      });
    }
  }


  if (error || sessionStorage.length == 4 || isLoaded == false) {
    return (
      <div className='page-wrap'>
        <Nav/>
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
        <div className="page-changer">
            <a className="page-arrow previous-page" onClick={changePage}>{'<'}</a>
            <a className="current-page">{page}</a>
            <a className="page-arrow next-page" onClick={changePage}>{'>'}</a>
        </div>
        <div className="error-body">
            <h1 className="error-message">If you can't see any movies, please enable the VPN and try again.</h1>
        </div>
        <div className="page-changer">
            <a className="page-arrow previous-page" onClick={changePage}>{'<'}</a>
            <a className="current-page">{page}</a>
            <a className="page-arrow next-page" onClick={changePage}>{'>'}</a>
        </div>
        <Footer/>
      </div>
    )
  } 

  else if ((sessionStorage.getItem('About') == 'active')) {
    return (
      <div className='page-wrap'>
        <Nav/>
        <div className="about-body">
            <h1 className="about-message">KinoGO is a simple movie library built with React and The Movie Database API. This was my first relatively big React application and I learned a lot of things while making it. If you want to see more of my projects, you can visit my <a className="about-message" href="https://egorkabantsov.netlify.app/">portfolio!</a></h1>
        </div>
        <Footer/>
    </div>
    );
  } 
  
  else {
    return (
      <div className='page-wrap'>
        <Nav/>
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
        <div className="page-changer">
            <a className="page-arrow previous-page" onClick={changePage}>{'<'}</a>
            <a className="current-page">{page}</a>
            <a className="page-arrow next-page" onClick={changePage}>{'>'}</a>
        </div>
        <div className="movies">
          {movies.length > 0 && movies.map((movie)=>
            <Movie key={movie.id} {...movie}/>
          )}
        </div>
        <div className="page-changer">
          <a className="page-arrow previous-page" onClick={changePage}>{'<'}</a>
          <a className="current-page">{page}</a>
          <a className="page-arrow next-page" onClick={changePage}>{'>'}</a>
        </div>
        <Footer/>
    </div>
    );
  }
}

export default App;
