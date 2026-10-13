const BASE = "https://api.themoviedb.org/3";
const KEY = import.meta.env.VITE_TMDB_API_KEY;

export const IMG = "https://image.tmdb.org/t/p";
export const HORROR = 27; // TMDb:s genre-id för skräck

// Filtreralternativ som visas i katalogen
export const SUBGENRES = [
  { label: "Alla skräckfilmer", ids: [27] },
  { label: "Skräck + thriller", ids: [27, 53] },
  { label: "Skräck + mysterium", ids: [27, 9648] },
  { label: "Skräck + sci-fi", ids: [27, 878] },
  { label: "Skräck + komedi", ids: [27, 35] },
];

export const DECADES = [1960, 1970, 1980, 1990, 2000, 2010, 2020];

export const SORTS = [
  { value: "popularity.desc", label: "Mest populära" },
  { value: "vote_average.desc", label: "Högst betyg" },
  { value: "primary_release_date.asc", label: "Äldst först" },
  { value: "primary_release_date.desc", label: "Nyast först" },
];

async function request(path, params = {}, signal) {
  if (!KEY) {
    throw new Error(
      "API-nyckel saknas. Skapa en .env-fil med VITE_TMDB_API_KEY och starta om dev-servern."
    );
  }
  const query = new URLSearchParams({ api_key: KEY, language: "sv-SE", ...params });
  const res = await fetch(`${BASE}${path}?${query}`, { signal });
  if (!res.ok) {
    throw new Error(`Kunde inte hämta data från TMDb (felkod ${res.status}).`);
  }
  return res.json();
}

const yearOf = (m) => Number(m.release_date?.slice(0, 4)) || 0;

/**
 * Katalogen är alltid skräckfilmer.
 * - Utan sökord: /discover/movie filtreras direkt i API:et (genre, årtionde, sortering).
 * - Med sökord: /search/movie kan inte filtrera på genre, så vi filtrerar
 *   resultatet i klienten (skräck + valt undergenre + valt årtionde).
 */
export async function getMovies({ query, subgenre, decade, sort, page = 1 }, signal) {
  const ids = SUBGENRES[subgenre]?.ids ?? [HORROR];

  if (query) {
    const data = await request("/search/movie", { query, page }, signal);
    const results = data.results.filter(
      (m) =>
        ids.every((id) => m.genre_ids.includes(id)) &&
        (!decade || (yearOf(m) >= decade && yearOf(m) <= decade + 9))
    );
    return { ...data, results };
  }

  const params = {
    with_genres: ids.join(","), // komma = alla genrer måste matcha
    sort_by: sort,
    page,
  };
  if (sort !== "popularity.desc") params["vote_count.gte"] = 50; // undvik okända filmer med få röster
  if (decade) {
    params["primary_release_date.gte"] = `${decade}-01-01`;
    params["primary_release_date.lte"] = `${decade + 9}-12-31`;
  }
  return request("/discover/movie", params, signal);
}

export function getMovie(id, signal) {
  return request(`/movie/${id}`, { append_to_response: "videos,credits" }, signal);
}

// Påhittat butikspris (SEK): bra betyg och äldre kultfilmer är dyrare ("samlarpris")
export function priceFor(movie) {
  const age = Math.min(Math.max(new Date().getFullYear() - yearOf(movie), 0), 60);
  return Math.round(69 + (movie.vote_average || 5) * 8 + age * 1.5);
}
export const RENT_FACTOR = 0.4;
