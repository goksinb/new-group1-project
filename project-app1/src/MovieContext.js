import React, { createContext, useState, useContext, useEffect } from "react";

// Create a context for movie-related state and functions
const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  // Initialize watchlist state from localStorage or empty array
  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem("watchlist");
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Add a movie to the watchlist if it's not already present
  const addToWatchlist = (movie) => {
    setWatchlist((prevWatchlist) => {
      if (!prevWatchlist.some((item) => item.id === movie.id)) {
        return [...prevWatchlist, movie];
      }
      return prevWatchlist;
    });
  };

  // Remove a movie from the watchlist by its ID
  const removeFromWatchlist = (movieId) => {
    setWatchlist((prevWatchlist) =>
      prevWatchlist.filter((movie) => movie.id !== movieId)
    );
  };

  // Update a movie in the watchlist
  const updateWatchlistItem = (movieId, updatedMovie) => {
    setWatchlist((prevWatchlist) =>
      prevWatchlist.map((movie) =>
        movie.id === movieId ? { ...movie, ...updatedMovie } : movie
      )
    );
  };

  // Provide the watchlist state and functions to children components
  return (
    <MovieContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        updateWatchlistItem,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

// Custom hook to use the MovieContext
export const useMovieContext = () => useContext(MovieContext);
