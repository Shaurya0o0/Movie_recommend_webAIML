import { useState, useContext, useEffect } from "react";
import { RecommendationContext } from "./context/RecommendationContext.jsx";
import NewRecommendations from "./components/NewRecommendations.jsx";

function App() {
  const { getRecommendations, loadDefaultMovies } = useContext(RecommendationContext);
  const [title, setTitle] = useState("");

  useEffect(() => {
    loadDefaultMovies(); // load 20 movies on page load
  }, []);

  const handleSearch = () => {
    if (title.trim()) {
      getRecommendations(title);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-600">
        🎬 Movie Recommender
      </h1>

      <div className="flex justify-center mb-8">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a movie title"
          className="border rounded-l px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-4 py-2 rounded-r hover:bg-indigo-700"
        >
          Get Recommendations
        </button>
      </div>

      <NewRecommendations />
    </div>
  );
}

export default App;
