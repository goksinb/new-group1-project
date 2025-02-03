import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMovieContext } from "./MovieContext";
import "./WatchList.css";
import EditIcon from "./Assets/Edit.svg";
import CrossIcon from "./Assets/Cross.svg";
import ArrowIcon from "./Assets/Arrow.svg";

const API_KEY = "mPujWiU3zCgWk5S7Gt0nzpmYPbJaMEIRyFdMdB1n";

function WatchList() {
  const { watchlist, removeFromWatchlist, updateWatchlistItem } = useMovieContext();
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [streamingLinks, setStreamingLinks] = useState({});

  const navigate = useNavigate();

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const formatType = (type) => {
    return type === "TV Series" ? "TV Series" : "Movie";
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
      {/* NEW: Added a wrapper div above My Watchlist */}
      <div className="queueflix-header">
        <h2>QUEUEFLIX</h2>
        <button onClick={() => navigate("/")} className="back-button" aria-label="Back to Search">
          HOME
        </button>
      </div>

      {/* NEW: Added "STREAM MOVIES NOW" heading */}
      <h4 className="stream-movies-now">STREAM MOVIES NOW</h4>

      <h2 id="watchlist-title">My Watchlist</h2>

      {watchlist.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <ul aria-labelledby="watchlist-title">
          {watchlist.map((movie) => (
            <li key={movie.id} className="watchlist-item">
              <div className="movie-info-section">
                <div className="title-section">
                  {editingId === movie.id ? (
                    <input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onBlur={() => handleSave(movie)}
                      onKeyPress={(e) => e.key === "Enter" && handleSave(movie)}
                      aria-label={`Edit title for ${movie.name}`}
                    />
                  ) : (
                    <h4 title={movie.name}>{truncateText(movie.name, 20)}</h4>
                  )}
                  <button onClick={() => removeFromWatchlist(movie.id)} className="remove-button" aria-label={`Remove ${movie.name} from watchlist`}>
                    <img src={CrossIcon} alt="Cross" width={20} height={20} />
                  </button>
                </div>
                <div className="edit-section">
                  <p>{formatType(movie.type)}</p>
                  <button onClick={() => handleEdit(movie)} aria-label={`Edit ${movie.name}`}>
                    <img src={EditIcon} alt="Edit" width={20} height={20} />
                  </button>
                </div>
              </div>
              {streamingLinks[movie.id] && streamingLinks[movie.id].length > 0 && (
                <div className="streaming-section">
                  <p>Stream Now</p>
                  <button onClick={() => window.open(streamingLinks[movie.id][0].web_url, '_blank')} className="stream-button">
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
