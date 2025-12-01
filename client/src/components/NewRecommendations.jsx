import { useContext, useEffect, useState } from "react";
import { RecommendationContext } from "../context/RecommendationContext.jsx";
import { fetchMoviePoster } from "../api/omdb.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx"; // spinner for loading state

function NewRecommendations() {
  const { movie, moviePoster, recommendations, loading } = useContext(RecommendationContext);
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    async function loadPosters() {
      if (recommendations.length > 0) {
        const enriched = await Promise.all(
          recommendations.map((rec) => fetchMoviePoster(rec))
        );
        setPosters(enriched);
      }
    }
    loadPosters();
  }, [recommendations]);

  // Show spinner while loading
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!movie) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Recommendations for {movie}
      </h2>

      {/* Searched movie poster */}
      {moviePoster && (
        <div className="flex flex-col items-center mb-8">
          <img
            src={moviePoster}
            alt={movie}
            className="w-48 rounded-lg shadow-md"
          />
          <h3 className="mt-4 text-lg font-semibold text-gray-700">{movie}</h3>
        </div>
      )}

      {/* Recommendation posters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {posters.map((rec, i) => (
          <div
            key={i}
            className="bg-white w-48 rounded-lg shadow-md"
          >
            {rec.poster ? (
              <img
                src={rec.poster}
                alt={rec.title}
                className="w-48 rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-72 flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">No poster available</p>
              </div>
            )}
            <div className="p-4">
              <h4 className="text-md font-semibold text-gray-800 text-center">{rec.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewRecommendations;
