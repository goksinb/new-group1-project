import React, {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useMovieContext} from "./MovieContext";
import {fetchMovie} from "./FetchMovie";
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
      const movieResults = await fetchMovie(query);
      setResults(movieResults);
      setNotFound(movieResults.length === 0);

      if (movieResults.length > 0) {
        setTimeout(() => firstResultRef.current?.focus(), 100);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setResults([]);
      setNotFound(false);
      setError("An error occurred while fetching movies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press in the search input
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
          <h3>WATCHLIST</h3>
          <button
            className="header-watchlist-btn"
            onClick={() => navigate("/watchlist")}
            aria-label="View Watchlist"
          >
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
              onKeyDown={handleKeyPress} // Added Enter key function
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
            <p
              className="error-message"
              id="search-error"
              role="alert"
              aria-live="assertive"
            >
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
              {results.map((movie, index) => (
                <div
                  key={movie.id}
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
                  <h3 className="movie-title">{movie.name}</h3>
                </div>
              ))}
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
