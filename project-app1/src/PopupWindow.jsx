import React from "react";
import "./PopupWindow.css";
import Cross from "./Assets/Cross.svg";
import Arrow from "./Assets/Arrow.svg";
import HeartHollow from "./Assets/HeartHollow.svg";

function PopupWindow({ movie, onClose }) {
  if (!movie) return null;

  // Safely handle type formatting
  const type = movie.type 
    ? movie.type === "tv_series" 
      ? "TV Series" 
      : movie.type.charAt(0).toUpperCase() + movie.type.slice(1)
    : "Movie";

  // Updated truncateText with null checks
  const truncateText = (text, maxLength) => {
    if (!text || typeof text !== 'string') return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const handleAddToWatchlist = async () => {
    try {
      console.log("Adding movie with ID:", movie.id || movie.imdbID);
      
      const response = await fetch('http://localhost:3000/watchlist', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          imdbID: movie.id || movie.imdbID // Only send the identifier
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error.includes('duplicate')) {
          throw new Error("This movie is already in your watchlist!");
        }
        throw new Error(errorData.error || "Failed to add to watchlist");
      }

      onClose();
      alert("Added to watchlist successfully!");
      
    } catch (error) {
      console.error("Add to watchlist error:", error);
      alert(error.message || "Failed to add to watchlist");
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="up-popup">
          <div className="up-popup-row">
            <div className="popup-title">
              <h2 className="popup-name" title={movie.name || movie.title || ""}>
                {truncateText(movie.name || movie.title || "", 20)}
              </h2>
              <p className="popup-type">{type}</p>
            </div>
            <div className="close-btn-container">
              <button className="close-btn" onClick={onClose}>
                <img src={Cross} alt="Close" width="20" height="20" />
              </button>
            </div>
          </div>
          <div className="up-popup-row">
            <div className="stream">
              <p>View on IMDb</p>
            </div>
            <div className="arrow">
              <a
                href={`https://www.imdb.com/title/${movie.id || movie.imdbID}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={Arrow} alt="Go to IMDb" width="24" height="24" />
              </a>
            </div>
          </div>
        </div>

        <div className="down-popup">
          <div className="watchlist">
            <p className="Watchlist-text">Add to watchlist</p>
          </div>
          <div className="watchlist-heart">
            <img
              src={HeartHollow}
              alt="Add to watchlist"
              width="24"
              height="24"
              style={{ cursor: "pointer" }}
              onClick={handleAddToWatchlist}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopupWindow;