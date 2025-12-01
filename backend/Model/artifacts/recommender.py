import pickle, sys, os
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import difflib

# Get the directory of this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PICKLE_PATH = os.path.join(BASE_DIR, "movies.pkl")

# Load DataFrame
with open(PICKLE_PATH, 'rb') as f:
    movies = pickle.load(f)

# Recompute vectors + similarity
cv = CountVectorizer(max_features=5000, stop_words='english')
vectors = cv.fit_transform(movies['tags']).toarray()
similarity = cosine_similarity(vectors)

def recommend(movie):
    titles = movies['title'].str.lower().str.strip().tolist()
    close_matches = difflib.get_close_matches(movie.lower().strip(), titles, n=1, cutoff=0.6)
    if not close_matches:
        return [], movie
    best_match = close_matches[0]
    idx_list = movies[movies['title'].str.lower().str.strip() == best_match].index
    if len(idx_list) == 0:
        return [], movie
    idx = idx_list[0]

    distances = similarity[idx]
    movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]
    return [movies.iloc[i[0]].title for i in movies_list], movies.iloc[idx].title

if __name__ == "__main__":
    if len(sys.argv) > 1:
        movie_title = sys.argv[1]
        recs, matched_title = recommend(movie_title)
        if recs:
            # ✅ Print searched movie first, then each recommendation on its own line
            print(matched_title)
            for r in recs:
                print(r)
        else:
            print(movie_title)
            print("No recommendations found")
    else:
        print("No movie provided")
