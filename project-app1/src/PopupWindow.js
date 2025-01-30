import React from "react";
import "./PopupWindow.css";
import Cross from "./Assets/Cross.svg";
import Arrow from "./Assets/Arrow.svg";
import HeartHollow from "./Assets/HeartHollow.svg";

function PopupWindow({ movie, onClose, onAddToWatchlist }) {
  if (!movie) return null;

  const type =
    movie.type === "tv_series"
      ? "TV Series"
      : movie.type.charAt(0).toUpperCase() + movie.type.slice(1);

  const handleAddToWatchlist = () => {
    onAddToWatchlist(movie);
    onClose(); // Close the popup after adding to watchlist
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="up-popup">
          <div className="up-popup-row">
            <div className="popup-title">
              <h2>{movie.name}</h2>
            </div>
            <div className="close-btn-container">
              <button className="close-btn" onClick={onClose}>
                <img src={Cross} alt="Close" width="24" height="24" />
              </button>
            </div>
          </div>
          <div className="up-popup-row">
            <div className="movie-type">
              <p>{type}</p>
            </div>
            <div className="arrow">
              <a
                href={`https://www.netflix.com`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={Arrow} alt="Go to Netflix" width="24" height="24" />
              </a>
            </div>
          </div>
        </div>

        <div className="down-popup">
          <div className="left-side">
            <p>Hi</p>
          </div>
          <div className="right-side">
            <img
              src={HeartHollow}
              alt="Favorite"
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
