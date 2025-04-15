const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Movie, Watchlist } = require('./models/movie');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/movies')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Search movies
app.get('/movies/search', async (req, res) => {
  const { query } = req.query;
  try {
    const movies = await Movie.find({
      title: { $regex: query || '', $options: 'i' }
    });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add initial movies (for testing)
app.post('/init-movies', async (req, res) => {
  try {
    await Movie.insertMany([
      { title: "Inception", year: 2010, imdbID: "tt1375666", type: "movie" },
      { title: "Dune", year: 2021, imdbID: "tt15239678", type: "movie" }
    ]);
    res.json({ message: "Test movies added to catalog" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add movie to watchlist
app.post('/watchlist', async (req, res) => {
  try {
    const movie = await Movie.findOne({ imdbID: req.body.imdbID });
    if (!movie) {
      return res.status(404).json({ error: "Movie not found in catalog" });
    }

    const existing = await Watchlist.findOne({
      movieId: movie._id,
      userId: "anonymous"
    });

    if (existing) {
      return res.status(409).json({ error: "Movie already in watchlist" });
    }

    const watchlistItem = new Watchlist({
      movieId: movie._id,
      userId: "anonymous"
    });

    await watchlistItem.save();
    res.status(201).json(watchlistItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get watchlist (with movie details flattened)
app.get('/watchlist', async (req, res) => {
  try {
    const items = await Watchlist.find({ userId: "anonymous" }).populate('movieId');
    const formatted = items.map(item => {
      const movie = item.movieId;
      return {
        _id: item._id,
        title: movie.title,
        year: movie.year,
        imdbID: movie.imdbID,
        type: movie.type,
        movieId: movie._id
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete movie from watchlist
// DELETE route
app.delete('/watchlist/:id', async (req, res) => {
  console.log("Deleting watchlist item ID:", req.params.id); // Debug log

  try {
    const deletedItem = await Watchlist.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Watchlist item not found" });
    }

    res.json({ message: "Removed from watchlist", deletedItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update movie (e.g. title) in watchlist
app.put('/watchlist/:id', async (req, res) => {
  try {
    const watchlistItem = await Watchlist.findById(req.params.id).populate('movieId');
    if (!watchlistItem) {
      return res.status(404).json({ error: "Watchlist item not found" });
    }

    // Update movie info directly in the Movie collection
    const updatedMovie = await Movie.findByIdAndUpdate(
      watchlistItem.movieId._id,
      { title: req.body.title },
      { new: true }
    );

    res.json({ message: "Movie updated", movie: updatedMovie });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET    /movies/search?query=...');
  console.log('- POST   /watchlist');
  console.log('- GET    /watchlist');
  console.log('- DELETE /watchlist/:id');
  console.log('- PUT    /watchlist/:id');
  console.log('- POST   /init-movies');
});

