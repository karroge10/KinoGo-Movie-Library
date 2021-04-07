import React from 'react';

const posterAPI = 'https://image.tmdb.org/t/p/w200/'

const Movie = ({ title, poster_path, overview, vote_average, release_date }) => (
    
    <div className="movie">
            <img className="movie-poster" src={posterAPI + poster_path} alt={title} />
        <div className="movie-info">
            <h1 className="movie-title">{title}</h1>
            <div className="date-and-rating">
                <p className="movie-date">{release_date == undefined ? 'Unknown' : release_date.slice(0,4)}</p>
                <div className="rating-container">
                    <p className="movie-rating">{vote_average}</p>
                </div>
            </div>
        </div>

    </div>
);

export default Movie;