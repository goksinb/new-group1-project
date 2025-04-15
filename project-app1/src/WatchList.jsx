import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WatchList.css";
import EditIcon from "./Assets/Edit.svg";
import CrossIcon from "./Assets/Cross.svg";
import ArrowIcon from "./Assets/Arrow.svg";

function WatchList() {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const navigate = useNavigate();

  // Fetch watchlist
  const fetchWatchlist = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/watchlist");
      const data = await response.json();
      console.log("Fetched watchlist items:", data); // ✅ DEBUG: Watchlist items
      setWatchlist(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a movie from watchlist
  const removeFromWatchlist = async (watchlistItemId) => {
    try {
      console.log("Attempting to delete ID:", watchlistItemId); // ✅ DEBUG: Deleting ID
      const response = await fetch(
        `http://localhost:3000/watchlist/${watchlistItemId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove");
      }

      // Refresh watchlist
      fetchWatchlist();
    } catch (err) {
      console.error("Error removing from watchlist:", err);
      alert(err.message || "Failed to remove from watchlist");
      fetchWatchlist(); // Fallback refresh
    }
  };

  // Update movie in watchlist
  const updateWatchlistItem = async (id, updatedData) => {
    try {
      await fetch(`http://localhost:3000/watchlist/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      fetchWatchlist();
    } catch (error) {
      console.error("Error updating watchlist item:", error);
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
  };

  const formatType = (type) => {
    if (!type) return "Movie";
    const typeLower = type.toLowerCase();
    return typeLower === "tv series" || typeLower === "tv_series"
      ? "TV Series"
      : "Movie";
  };

  const handleEdit = (movie) => {
    setEditingId(movie._id);
    setEditedTitle(movie.title);
  };

  const handleSave = (movie) => {
    updateWatchlistItem(movie._id, { ...movie, title: editedTitle });
    setEditingId(null);
  };

  const getImdbUrl = (imdbID) =>
    `https://www.imdb.com/title/${imdbID}/`;

  useEffect(() => {
    fetchWatchlist();
  }, []);


  //Cookie Tracker
function trackAction(actionName) {
  if (localStorage.getItem('gaConsent') === 'true' && window.gtag) {
    window.gtag('event', actionName);
  }
}

const addToWatchlist = (movie) => {
  trackAction('added_to_watchlist'); 
};


  return (
    <div className="watchlist-container">
      <div className="queueflix-header">
        <div className="queueflix-banner">
          <h2>QUEUEFLIX</h2>
          <h4 className="stream-movies-now">STREAM MOVIES NOW</h4>
        </div>
        <button
          onClick={() => navigate("/")}
          className="back-button"
          aria-label="Back to Search"
        >
          HOME <img src={ArrowIcon} alt="" width={25} height={25} />
        </button>
      </div>

      <h2 id="watchlist-title" aria-live="polite">
        My Watchlist
      </h2>

      {isLoading ? (
        <p>Loading your watchlist...</p>
      ) : watchlist.length === 0 ? (
        <p role="alert">Your watchlist is empty. Search movies to add some!</p>
      ) : (
        <ul aria-labelledby="watchlist-title">
          {watchlist.map((item) => (
            <li key={item._id} className="watchlist-item" tabIndex={0}>
              <div className="movie-info-section">
                <div className="title-section">
                  {editingId === item._id ? (
                    <input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onBlur={() => handleSave(item)}
                      onKeyDown={(e) => e.key === "Enter" && handleSave(item)}
                      aria-label={`Edit title for ${item.title}`}
                      autoFocus
                    />
                  ) : (
                    <h4 title={item.title} tabIndex={0}>
                      {truncateText(item.title, 20)}
                    </h4>
                  )}
                  <button
                    onClick={() => removeFromWatchlist(item._id)}
                    className="remove-button"
                    aria-label={`Remove ${item.title} from watchlist`}
                  >
                    <img src={CrossIcon} alt="" width={20} height={20} />
                  </button>
                </div>
                <div className="edit-section">
                  {item.year && <p tabIndex={0}>{item.year}</p>}
                  <p tabIndex={0}>{formatType(item.type)}</p>
                  <button
                    onClick={() => handleEdit(item)}
                    aria-label={`Edit ${item.title}`}
                  >
                    <img src={EditIcon} alt="" width={20} height={20} />
                  </button>
                </div>
              </div>
              <div className="imdb-section">
                <p tabIndex={0}>View on IMDb</p>
                <a
                  href={getImdbUrl(item.imdbID)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="imdb-link"
                  aria-label={`View ${item.title} on IMDb`}
                >
                  <img src={ArrowIcon} alt="" width={20} height={20} />
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WatchList;
