import { createContext, useState } from "react";
import { fetchMoviePoster } from "../api/omdb.jsx"; // switched to OMDb

export const RecommendationContext = createContext();

export function RecommendationProvider({ children }) {
  const [recommendations, setRecommendations] = useState([]);
  const [movie, setMovie] = useState(null);
  const [moviePoster, setMoviePoster] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use env backend URL if available, else fallback to localhost
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const getRecommendations = async (movieTitle) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie: movieTitle }),
      });
      const data = await res.json();
      setMovie(data.movie);
      setRecommendations(data.recommendations);

      const posterData = await fetchMoviePoster(data.movie);
      setMoviePoster(posterData.poster);
    } catch (err) {
      setError("Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  // Load 20 default movies (hardcoded or from OMDb popular list)
  const loadDefaultMovies = async () => {
    const defaults = [
      "Inception", "Interstellar", "The Dark Knight", "The Prestige",
      "Memento", "Avatar", "Titanic", "Gladiator", "The Matrix",
      "Fight Club", "Forrest Gump", "The Shawshank Redemption",
      "The Godfather", "Pulp Fiction", "The Lord of the Rings",
      "Harry Potter", "Star Wars", "Jurassic Park", "Frozen", "Toy Story"
    ];
    const enriched = await Promise.all(defaults.map((title) => fetchMoviePoster(title)));
    setRecommendations(enriched.map((m) => m.title));
    setMovie("Popular Movies");
    setMoviePoster(null);
  };

  return (
    <RecommendationContext.Provider
      value={{
        movie,
        moviePoster,
        recommendations,
        getRecommendations,
        loadDefaultMovies,
        loading,
        error,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
}
