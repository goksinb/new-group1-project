import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMovieContext } from "./MovieContext";
import "./WatchList.css";
import EditIcon from "./Assets/Edit.svg";
import CrossIcon from "./Assets/Cross.svg";
import ArrowIcon from "./Assets/Arrow.svg";

const API_KEY = "pdUII47F5C3IAAvK6tjYcg2EzkWTICjXO7Jtsxhq"; // API key for fetching streaming options

function WatchList() {
  const { watchlist, removeFromWatchlist, updateWatchlistItem } = useMovieContext();
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [streamingLinks, setStreamingLinks] = useState({});
  const navigate = useNavigate();

  // Function to truncate long movie titles to a specific length
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Function to format movie type (TV Series or Movie)
  const formatType = (type) => {
    const typeLower = type.toLowerCase(); // Normalize the type to lowercase
    return typeLower === "tv series" || typeLower === "tv_series" ? "TV Series" : "Movie";
  };

  const handleEdit = (movie) => {
    setEditingId(movie.id);
    setEditedTitle(movie.name);
  };

  const handleSave = (movie) => {
    updateWatchlistItem(movie.id, { ...movie, name: editedTitle });
    setEditingId(null);
  };

  const fetchStreamingOptions = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.watchmode.com/v1/title/${movieId}/sources/?apiKey=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.length > 0 ? [data[0]] : [];
    } catch (error) {
      console.error("Error fetching streaming options:", error);
      return [];
    }
  };

  useEffect(() => {
    watchlist.forEach(async (movie) => {
      if (!streamingLinks[movie.id]) {
        const sources = await fetchStreamingOptions(movie.id);
        setStreamingLinks((prev) => ({ ...prev, [movie.id]: sources }));
      }
    });
  }, [watchlist]);

  return (
    <div className="watchlist-container">
      <div className="queueflix-header">
        <div className="queueflix-banner">
          <h2>QUEUEFLIX</h2>
          <h4 className="stream-movies-now">STREAM MOVIES NOW</h4>
        </div>
        <button onClick={() => navigate("/")} className="back-button" aria-label="Back to Search">
          HOME <img src={ArrowIcon} alt="Stream" width={25} height={25} />
        </button>
      </div>

      <h2 id="watchlist-title" aria-live="polite">
        My Watchlist
      </h2>

      {watchlist.length === 0 ? (
        <p role="alert">Your watchlist is empty.</p>
      ) : (
        <ul aria-labelledby="watchlist-title">
          {watchlist.map((movie) => (
            <li key={movie.id} className="watchlist-item" tabIndex={0}>
              <div className="movie-info-section">
                <div className="title-section">
                  {editingId === movie.id ? (
                    <input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onBlur={() => handleSave(movie)}
                      onKeyDown={(e) => e.key === "Enter" && handleSave(movie)}
                      aria-label={`Edit title for ${movie.name}`}
                    />
                  ) : (
                    <h4 title={movie.name} tabIndex={0}>
                      {truncateText(movie.name, 20)}
                    </h4>
                  )}
                  <button
                    onClick={() => removeFromWatchlist(movie.id)}
                    className="remove-button"
                    aria-label={`Remove ${movie.name} from watchlist`}
                  >
                    <img src={CrossIcon} alt="Remove from watchlist" width={20} height={20} />
                  </button>
                </div>
                <div className="edit-section">
                  <p tabIndex={0}>{formatType(movie.type)}</p>
                  <button onClick={() => handleEdit(movie)} aria-label={`Edit ${movie.name}`}>
                    <img src={EditIcon} alt="Edit" width={20} height={20} />
                  </button>
                </div>
              </div>
              {streamingLinks[movie.id] && streamingLinks[movie.id].length > 0 && (
                <div className="streaming-section">
                  <p tabIndex={0}>Stream Now</p>
                  <button
                    onClick={() => window.open(streamingLinks[movie.id][0].web_url, "_blank")}
                    className="stream-button"
                    aria-label={`Watch ${movie.name} on streaming platform`}
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
