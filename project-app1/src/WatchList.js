import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMovieContext } from "./MovieContext";

function WatchList() {
  // Access watchlist state and functions from MovieContext
  const { watchlist, removeFromWatchlist, updateWatchlistItem } =
    useMovieContext();

  // State for managing movie editing
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Function to start editing a movie title
  const handleEdit = (movie) => {
    setEditingId(movie.id);
    setEditedTitle(movie.name);
  };

  // Function to save the edited movie title
  const handleSave = (movie) => {
    updateWatchlistItem(movie.id, { ...movie, name: editedTitle });
    setEditingId(null);
  };

  return (
    <div className="watchlist-container">
      <h2 id="watchlist-title">My Watchlist</h2>
      <button
        onClick={() => navigate("/")}
        className="back-button"
        aria-label="Back to Search"
      >
        Back to Search
      </button>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <ul aria-labelledby="watchlist-title">
          {watchlist.map((movie) => (
            <li key={movie.id} className="watchlist-item">
              {editingId === movie.id ? (
                <input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={() => handleSave(movie)}
                  onKeyPress={(e) => e.key === "Enter" && handleSave(movie)}
                  aria-label={`Edit title for ${movie.name}`}
                />
              ) : (
                <h3>{movie.name}</h3>
              )}
              <p>
                {movie.type} ({movie.year})
              </p>
              <button
                onClick={() => handleEdit(movie)}
                aria-label={`Edit ${movie.name}`}
              >
                Edit
              </button>
              <button
                onClick={() => removeFromWatchlist(movie.id)}
                className="remove-button"
                aria-label={`Remove ${movie.name} from watchlist`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WatchList;
