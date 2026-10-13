const BASE = "https://api.themoviedb.org/3";
const KEY = import.meta.env.VITE_TMDB_API_KEY;

export const IMG = "https://image.tmdb.org/t/p";
export const HORROR = 27; // TMDb:s genre-id för skräck

async function request(path, params = {}, signal) {
  if (!KEY) {
    throw new Error(
      "API-nyckel saknas. Skapa en .env-fil med VITE_TMDB_API_KEY och starta om servern."
    );
  }
  const query = new URLSearchParams({ api_key: KEY, language: "sv-SE", ...params });
  const res = await fetch(`${BASE}${path}?${query}`, { signal });
  if (!res.ok) {
    throw new Error(`Kunde inte hämta data från TMDb (felkod ${res.status}).`);
  }
  return res.json();
}

// Populära skräckfilmer, en sida i taget
export function getMovies({ page = 1 }, signal) {
  return request(
    "/discover/movie",
    { with_genres: HORROR, sort_by: "popularity.desc", page },
    signal
  );
}
