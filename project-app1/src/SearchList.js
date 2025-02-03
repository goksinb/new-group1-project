import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMovieContext } from "./MovieContext";
import { fetchMovie } from "./FetchMovie";
import PopupWindow from "./PopupWindow";
import Arrow from "./Assets/Arrow.svg";
import "./SearchList.css";
import "./App.css";

const SearchList = () => {
  // State variables for managing search functionality and results
  const [query, setQuery] = useState(""); // Stores the current search query
  const [results, setResults] = useState([]); // Stores the search results
  const [notFound, setNotFound] = useState(false); // Indicates if no results were found
  const [selectedMovie, setSelectedMovie] = useState(null); // Stores the currently selected movie for the popup
  const [isLoading, setIsLoading] = useState(false); // Indicates if a search is in progress
  const [error, setError] = useState(null); // Stores any error messages
  const [hasSearched, setHasSearched] = useState(false); // Indicates if a search has been performed

  // Access the addToWatchlist function from the MovieContext
  const { addToWatchlist } = useMovieContext();
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Function to handle the search button click
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
      console.log("Fetched Movies:", movieResults);
      setResults(movieResults);
      setNotFound(movieResults.length === 0);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setResults([]);
      setNotFound(false);
      setError("An error occurred while fetching movies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add a movie to the watchlist and close the popup
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
              placeholder="Search for a movie or series"
              className="search-input"
              aria-label="Search for a movie or series"
            />
            <button
              onClick={handleButtonClick}
              className="search-button"
              disabled={isLoading}
            >
              <img src={Arrow} alt="Arrow" width="24" height="24" />
            </button>
          </div>

          {/* Display error message */}
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          {/* Display loading message */}
          {isLoading && (
            <p className="loading-message" role="alert">
              Searching...
            </p>
          )}

          {/* Results and error message */}
          {hasSearched && (
            <div className="results-grid">
              {results.map((movie) => (
                <div key={movie.id} className="result-card">
                  <h3
                    className="movie-title"
                    onClick={() => setSelectedMovie(movie)}
                    style={{ cursor: "pointer" }}
                  >
                    {movie.name}
                  </h3>
                </div>
              ))}
              {notFound && <p className="not-found">No results found</p>}
            </div>
          )}
        </div>

        {/* PopUp for chosen movie */}
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
