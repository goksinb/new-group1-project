export const fetchMovie = async (query) => {
  const apiKey = "pdUII47F5C3IAAvK6tjYcg2EzkWTICjXO7Jtsxhq";
  try {
    const response = await fetch(
      `https://api.watchmode.com/v1/autocomplete-search/?apiKey=${apiKey}&search_value=${encodeURIComponent(
        query
      )}&search_type=1`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("API Response:", data); // Debug API response
    return data.results || []; // Fixed: return results, not title_results
  } catch (error) {
    console.error("Something went wrong:", error);
    return [];
  }
};
