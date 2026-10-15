import { useState } from "react";
import { DECADES, SORTS, SUBGENRES, getHorrorPool, getMovies } from "../api/tmdb";
import useFetch from "../hooks/useFetch";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const PAGE_SIZE = 20;

// Sortering av sökresultat sker i webbläsaren
const dateOf = (m) => m.release_date || "9999";
const SORTERS = {
    "popularity.desc": (a, b) => b.popularity - a.popularity,
    "vote_average.desc": (a, b) => b.vote_average - a.vote_average,
    "primary_release_date.asc": (a, b) => dateOf(a).localeCompare(dateOf(b)),
    "primary_release_date.desc": (a, b) => dateOf(b).localeCompare(dateOf(a)),
};

export default function Catalog() {
    const [input, setInput] = useState("");
    const [subgenre, setSubgenre] = useState(0);
    const [decade, setDecade] = useState(0);
    const [sort, setSort] = useState("popularity.desc");
    const [page, setPage] = useState(1);

    const typed = input.trim().toLowerCase();
    const searching = typed.length > 0;

    // Bläddring (tom sökruta): TMDb filtrerar och sidindelar
    const browse = useFetch(
        (signal) =>
            searching ? Promise.resolve(null) : getMovies({ subgenre, decade, sort, page }, signal),
        [searching, subgenre, decade, sort, page]
    );

    // Sökning: hämta skräckfilmerna en gång och sök bland dem lokalt
    const pool = useFetch(
        (signal) =>
            searching ? getHorrorPool({ subgenre, decade }, signal) : Promise.resolve(null),
        [searching, subgenre, decade]
    );

    const { loading, error } = searching ? pool : browse;

    let movies = [];
    let totalPages = 1;
    if (searching) {
        if (pool.data) {
            const matches = pool.data.filter((m) =>
                [m.title, m.original_title]
                    .filter(Boolean)
                    .map((t) => t.toLowerCase())
                    .some((t) => (typed.length === 1 ? t.startsWith(typed) : t.includes(typed)))
            );
            matches.sort(SORTERS[sort]);
            totalPages = Math.max(Math.ceil(matches.length / PAGE_SIZE), 1);
            movies = matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
        }
    } else if (browse.data) {
        movies = browse.data.results;
        totalPages = Math.min(browse.data.total_pages, 500);
    }

    return (
        <main>
            <h1>Vad vågar du se ikväll?</h1>
            <p className="meta">Köp eller hyr skräckfilmer, från gamla klassiker till nya mardrömmar.</p>

            <div className="filters">
                <input
                    type="search"
                    placeholder="Sök bland skräckfilmer…"
                    aria-label="Sök bland skräckfilmer"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setPage(1);
                    }}
                />
                <select
                    aria-label="Undergenre"
                    value={subgenre}
                    onChange={(e) => {
                        setSubgenre(Number(e.target.value));
                        setPage(1);
                    }}
                >
                    {SUBGENRES.map((g, i) => (
                        <option key={g.label} value={i}>{g.label}</option>
                    ))}
                </select>
                <select
                    aria-label="Årtionde"
                    value={decade}
                    onChange={(e) => {
                        setDecade(Number(e.target.value));
                        setPage(1);
                    }}
                >
                    <option value={0}>Alla årtionden</option>
                    {DECADES.map((d) => (
                        <option key={d} value={d}>{d}-talet</option>
                    ))}
                </select>
                <select
                    aria-label="Sortering"
                    value={sort}
                    onChange={(e) => {
                        setSort(e.target.value);
                        setPage(1);
                    }}
                >
                    {SORTS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>

            {loading && <Loader text="Letar i källaren…" />}
            {error && <ErrorMessage message={error} />}

            {!loading && !error && (
                <>
                    {movies.length === 0 ? (
                        <p>
                            {searching
                                ? "Inga skräckfilmer matchar sökningen. Sökningen gäller de mest populära skräckfilmerna för de valda filtren."
                                : "Inga filmer hittades. Prova ett annat filter."}
                        </p>
                    ) : (
                        <div className="grid">
                            {movies.map((m) => (
                                <MovieCard key={m.id} movie={m} />
                            ))}
                        </div>
                    )}
                    <div className="pagination">
                        <button className="btn ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                            Föregående
                        </button>
                        <span>Sida {page} av {totalPages}</span>
                        <button className="btn ghost" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                            Nästa
                        </button>
                    </div>
                </>
            )}
        </main>
    );
}