import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMovieContext } from "./MovieContext";
import "./WatchList.css";
import EditIcon from "./Assets/Edit.svg";
import CrossIcon from "./Assets/Cross.svg";
import ArrowIcon from "./Assets/Arrow.svg";

const API_KEY = "pdUII47F5C3IAAvK6tjYcg2EzkWTICjXO7Jtsxhq"; // API key for fetching streaming options

function WatchList() {
  // Importing watchlist-related functions from MovieContext
  const { watchlist, removeFromWatchlist, updateWatchlistItem } = useMovieContext();

  // State to track editing mode for movie titles
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  // State to store streaming service links for movies
  const [streamingLinks, setStreamingLinks] = useState({});

  // Hook for navigation between pages
  const navigate = useNavigate();

  // Function to truncate long movie titles to a specific length
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "..."; // Appends "..." if text exceeds maxLength
  };

  // Function to format movie type (TV Series or Movie)
  const formatType = (type) => {
    return type === "TV Series" ? "TV Series" : "Movie";
  };

  // Function to enable editing mode for a movie title
  const handleEdit = (movie) => {
    setEditingId(movie.id);
    setEditedTitle(movie.name);
  };

  // Function to save the edited title and update the watchlist
  const handleSave = (movie) => {
    updateWatchlistItem(movie.id, { ...movie, name: editedTitle });
    setEditingId(null); // Exit editing mode
  };

  // Function to fetch streaming options for a movie from an external API
  const fetchStreamingOptions = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.watchmode.com/v1/title/${movieId}/sources/?apiKey=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.length > 0 ? [data[0]] : []; // Return the first available streaming source
    } catch (error) {
      console.error("Error fetching streaming options:", error);
      return [];
    }
  };

  // useEffect hook to fetch streaming links when the watchlist updates
  useEffect(() => {
    watchlist.forEach(async (movie) => {
      if (!streamingLinks[movie.id]) {
        const sources = await fetchStreamingOptions(movie.id);
        setStreamingLinks((prev) => ({ ...prev, [movie.id]: sources }));
      }
    });
  }, [watchlist]); // Runs whenever the watchlist changes

  return (
    <div className="watchlist-container">
      {/* Header section with title and navigation button */}
      <div className="queueflix-header">
        <div className="queueflix-banner">
        <h2>QUEUEFLIX</h2>
           {/* Section title for streaming movies */}
      <h4 className="stream-movies-now">STREAM MOVIES NOW</h4>
      </div>
        <button onClick={() => navigate("/")} className="back-button" aria-label="Back to Search">
          HOME <img src={ArrowIcon} alt="Stream" width={25} height={25} />
        </button>
      </div>


      {/* Watchlist title */}
      <h2 id="watchlist-title">My Watchlist</h2>

      {/* Check if watchlist is empty */}
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <ul aria-labelledby="watchlist-title">
          {watchlist.map((movie) => (
            <li key={movie.id} className="watchlist-item">
              {/* Movie info section */}
              <div className="movie-info-section">
                {/* Movie title section */}
                <div className="title-section">
                  {editingId === movie.id ? (
                    // Editable input field for title
                    <input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onBlur={() => handleSave(movie)}
                      onKeyPress={(e) => e.key === "Enter" && handleSave(movie)}
                      aria-label={`Edit title for ${movie.name}`}
                    />
                  ) : (
                    // Display movie title with truncation
                    <h4 title={movie.name}>{truncateText(movie.name, 20)}</h4>
                  )}
                  {/* Remove button to delete movie from watchlist */}
                  <button
                    onClick={() => removeFromWatchlist(movie.id)}
                    className="remove-button"
                    aria-label={`Remove ${movie.name} from watchlist`}
                  >
                    <img src={CrossIcon} alt="Cross" width={20} height={20} />
                  </button>
                </div>

                {/* Section to display movie type and edit button */}
                <div className="edit-section">
                  <p>{formatType(movie.type)}</p>
                  <button onClick={() => handleEdit(movie)} aria-label={`Edit ${movie.name}`}>
                    <img src={EditIcon} alt="Edit" width={20} height={20} />
                  </button>
                </div>
              </div>

              {/* Display streaming options if available */}
              {streamingLinks[movie.id] && streamingLinks[movie.id].length > 0 && (
                <div className="streaming-section">
                  <p>Stream Now</p>
                  <button
                    onClick={() => window.open(streamingLinks[movie.id][0].web_url, "_blank")}
                    className="stream-button"
                  >
                    <img src={ArrowIcon} alt="Stream" width={20} height={20} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WatchList;
