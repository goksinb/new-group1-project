import React, {useState} from "react";
import {fetchMovie} from "./FetchMovie";
import PopupWindow from "./PopupWindow";
import "./App.css";

const SearchList = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null); // State for selected movie

  // Function to handle search button click
  const handleButtonClick = async () => {
    if (query.trim() === "") {
      setResults([]);
      setNotFound(false);
      return;
    }

    try {
      const movieResults = await fetchMovie(query);
      console.log("Fetched Movies:", movieResults);
      setResults(movieResults);
      setNotFound(movieResults.length === 0);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setResults([]);
      setNotFound(true);
    }
  };

  return (
    <div className="searchlist-container">
      <header>
        <button>Watchlist</button>
      </header>
      <h4>Stream Movies Now</h4>
      <h1>QUEUEFLIX</h1>
      <h1 className="title">FIND YOUR FLICK</h1>
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie or series"
          className="search-input"
        />
      </div>
      <button onClick={handleButtonClick} className="search-button">
        Search
      </button>
      {notFound ? (
        <p className="not-found">No results found</p>
      ) : (
        <div className="results-grid">
          {results.map((movie) => (
            <div key={movie.id} className="result-card">
              {/* Movie title with onClick to open popup */}
              <h2
                className="movie-title"
                onClick={() => setSelectedMovie(movie)} // Open popup with selected movie
                style={{cursor: "pointer", textDecoration: "underline"}}
              >
                {movie.name} ({movie.year})
              </h2>
            </div>
          ))}
        </div>
      )}
      {/* Render PopupWindow if a movie is selected */}
      {selectedMovie && (
        <PopupWindow
          movie={selectedMovie} // Pass selected movie data
          onClose={() => setSelectedMovie(null)} // Close popup by resetting state
        />
      )}
    </div>
  );
};

export default SearchList;
