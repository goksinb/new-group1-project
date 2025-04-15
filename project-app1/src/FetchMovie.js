export const fetchMovie = async () => {
  try {
    const response = await fetch('http://localhost:3000/movies');
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
  
};

export const searchMovies = async (query) => {
  try {
    const response = await fetch(`http://localhost:3000/movies/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Search failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};