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

// Parametrar för /discover/movie. TMDb filtrerar genre, årtionde och sortering själv.
function discoverParams({ subgenre, decade, sort = "popularity.desc", page = 1 }) {
    const ids = SUBGENRES[subgenre]?.ids ?? [HORROR];
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
    return params;
}

// Bläddring: en sida i taget, redan filtrerad på skräck av TMDb
export function getMovies({ subgenre, decade, sort, page = 1 }, signal) {
    return request("/discover/movie", discoverParams({ subgenre, decade, sort, page }), signal);
}

// Sökning: hämta de mest populära skräckfilmerna för valda filter (en gång per kombination)
// och låt sidan söka bland dem. Fler sidor = fler sökbara filmer men fler anrop.
const POOL_PAGES = 10; // 10 sidor ≈ 200 filmer
const poolCache = new Map();

export async function getHorrorPool({ subgenre, decade }, signal) {
    const key = `${subgenre}-${decade}`;
    if (poolCache.has(key)) return poolCache.get(key);

    const base = { subgenre, decade, sort: "popularity.desc" };
    const first = await request("/discover/movie", discoverParams({ ...base, page: 1 }), signal);
    const lastPage = Math.min(first.total_pages, POOL_PAGES); // TMDb ger fel om man ber om en sida som inte finns
    const rest = await Promise.all(
        Array.from({ length: Math.max(lastPage - 1, 0) }, (_, i) =>
            request("/discover/movie", discoverParams({ ...base, page: i + 2 }), signal)
        )
    );

    // Ta bort dubbletter (populariteten kan ändras medan sidorna hämtas)
    const byId = new Map();
    [first, ...rest].flatMap((p) => p.results).forEach((m) => byId.set(m.id, m));
    const movies = [...byId.values()];

    poolCache.set(key, movies);
    return movies;
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