import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMovieContext } from "./MovieContext";
import { fetchMovie } from "./FetchMovie";
import PopupWindow from "./PopupWindow";
import "./App.css";

const SearchList = () => {
  // State variables for managing search functionality and results
  const [query, setQuery] = useState(""); // Stores the current search query
  const [results, setResults] = useState([]); // Stores the search results
  const [notFound, setNotFound] = useState(false); // Indicates if no results were found
  const [selectedMovie, setSelectedMovie] = useState(null); // Stores the currently selected movie for the popup
  const [isLoading, setIsLoading] = useState(false); // Indicates if a search is in progress
  const [error, setError] = useState(null); // Stores any error messages

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
        <button
          className="header-watchlist-btn"
          onClick={() => navigate("/watchlist")}
          aria-label="View Watchlist"
        >
          Watchlist
        </button>
      </header>
      <h4>Stream Movies Now</h4>
      <h1>QUEUEFLIX</h1>
      <h2 className="title">FIND YOUR FLICK</h2>
      <div className="search-container">
        <input
          id="movie-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie or series"
          className="search-input"
          aria-label="Search for a movie or series"
        />
      </div>
      <button
        onClick={handleButtonClick}
        className="search-button"
        disabled={isLoading}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      {notFound ? (
        <p className="not-found">No results found</p>
      ) : (
        <div className="results-grid">
          {results.map((movie) => (
            <div key={movie.id} className="result-card">
              <h3
                className="movie-title"
                onClick={() => setSelectedMovie(movie)}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {movie.name} ({movie.year})
              </h3>
            </div>
          ))}
        </div>
      )}
      {selectedMovie && (
        <PopupWindow
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onAddToWatchlist={handleAddToWatchlist}
        />
      )}
    </div>
  );
};

export default SearchList;
