const OMDB_BASE_URL = "https://www.omdbapi.com";
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export async function fetchMoviePoster(title) {
  try {
    const res = await fetch(
      `${OMDB_BASE_URL}/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`
    );
    const data = await res.json();

    if (data.Response === "True") {
      return {
        title: data.Title || title,
        poster: data.Poster && data.Poster !== "N/A" ? data.Poster : null,
      };
    }
    return { title, poster: null };
  } catch (err) {
    console.error("OMDb fetch error:", err);
    return { title, poster: null };
  }
}
