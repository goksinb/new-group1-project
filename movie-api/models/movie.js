const mongoose = require('mongoose');

// Movie catalog schema
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: Number,
  imdbID: { type: String, required: true, unique: true },
  type: String
});

// Watchlist schema
const watchlistSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  userId: { type: String, required: true, default: "anonymous" },
  addedAt: { type: Date, default: Date.now }
});

const Movie = mongoose.model('Movie', movieSchema);
const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = { Movie, Watchlist };
