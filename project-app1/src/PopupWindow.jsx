import React from "react";
import "./PopupWindow.css";
import Cross from "./Assets/Cross.svg";
import Arrow from "./Assets/Arrow.svg";
import HeartHollow from "./Assets/HeartHollow.svg";

//This function shows the popupwindows component for displaying the movie details.
function PopupWindow({ movie, onClose, onAddToWatchlist }) {
  if (!movie) return null;

  //In here I determine the type of content (TV Series or Capitalize first letter of the type data.)
  const type =
    movie.type === "tv_series"
      ? "TV Series"
      : movie.type.charAt(0).toUpperCase() + movie.type.slice(1);

  //This handler is for adding the movie to the watchlist and also it closes the popup after adding to watchlist, the popup gives you the opportunity to add more.
  const handleAddToWatchlist = () => {
    onAddToWatchlist(movie);
    onClose();
  };

  //This function is for taking care of the title of the movie in the popupwindow that it should not exceeds a certain length of the characters.
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="up-popup">
          <div className="up-popup-row">
            <div className="popup-title">
              {/* It is connected with the truncateText function and it stops when the characters reache 20. */}
              <h2 className="popup-name" title={movie.name}>
                {truncateText(movie.name, 20)}
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
              <p>Stream now</p>
            </div>
            {/* Here, I have connected to the NetFlix website */}
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
          <div className="watchlist">
            <p className="Watchlist-text">Add to watchlist</p>
          </div>
          <div className="watchlist-heart">
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
