import React, {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useMovieContext} from "./MovieContext";
import {fetchMovie, searchMovies} from "./FetchMovie";
import PopupWindow from "./PopupWindow";
import Arrow from "./Assets/Arrow.svg";
import "./SearchList.css";
import "./App.css";

const SearchList = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const {addToWatchlist} = useMovieContext();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const firstResultRef = useRef(null);

  useEffect(() => {
    if (selectedMovie) {
      document.getElementById("popup-window")?.focus();
    } else {
      searchInputRef.current?.focus();
    }
  }, [selectedMovie]);

  const handleButtonClick = async () => {
    if (query.trim() === "") {
      setError("Please enter a search query");
      return;
    }
  
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
  
    try {
      const movieResults = await searchMovies(query);
      setResults(movieResults);
      setNotFound(movieResults.length === 0);
    } catch (error) {
      console.error("Search error:", error);
      setError(error.message.includes('No movies found') 
        ? "No movies found, try another search" 
        : "Search failed, please try again");
      setResults([]);
      setNotFound(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleButtonClick();
    }
  };

  const handleAddToWatchlist = (movie) => {
    addToWatchlist(movie);
    setSelectedMovie(null);
  };

  return (
    <div className="searchlist-container">
      <header>
        <div className="watchlist-text">
          <button
            className="header-watchlist-btn"
            onClick={() => navigate("/watchlist")}
            aria-label="View Watchlist"
          > 
            WATCHLIST
            <img src={Arrow} alt="Go to Watchlist" width="24" height="24" />
          </button>
        </div>
      </header>
      <div className="center-content">
        <h4>STREAM MOVIES NOW</h4>
        <h1>QUEUEFLIX</h1>
        <h2 className="title">FIND YOUR FLICK</h2>
        <div className="search-container">
          <div className="search-bar">
            <input
              id="movie-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Search for a movie or series"
              className="search-input"
              ref={searchInputRef}
              aria-describedby="search-error"
              aria-label="Search for a movie or series"
            />
            <button
              onClick={handleButtonClick}
              className="search-button"
              disabled={isLoading}
              aria-label="Search"
            >
              <img src={Arrow} alt="Search" width="24" height="24" />
            </button>
          </div>

          {error && (
            <p className="error-message" id="search-error" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          {isLoading && (
            <p className="loading-message" role="alert" aria-live="polite">
              Searching...
            </p>
          )}

          {hasSearched && (
            <div className="results-grid">
              {results.map((movie, index) => {
                const uniqueKey = movie._id || movie.imdbID || `movie-${index}`;
                return (
                  <div
                    key={uniqueKey}
                    className="result-card"
                    tabIndex="0"
                    role="button"
                    onClick={() => setSelectedMovie(movie)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSelectedMovie(movie);
                      }
                    }}
                    ref={index === 0 ? firstResultRef : null}
                    style={{cursor: "pointer"}}
                  >
                    <h3 className="movie-title">{movie.title || movie.name}</h3>
                    {movie.year && <p className="movie-year">{movie.year}</p>}
                  </div>
                );
              })}
              {notFound && <p className="not-found">No results found</p>}
            </div>
          )}
        </div>

        {selectedMovie && (
          <PopupWindow
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            onAddToWatchlist={handleAddToWatchlist}
          />
        )}
      </div>
    </div>
  );
};

export default SearchList;