import { useEffect, useState } from "react";
import { DECADES, SORTS, SUBGENRES, getMovies } from "../api/tmdb";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import MovieCard from "../components/MovieCard";
import useFetch from "../hooks/useFetch";

export default function Catalog() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [subgenre, setSubgenre] = useState(0);
  const [decade, setDecade] = useState(0);
  const [sort, setSort] = useState("popularity.desc");
  const [page, setPage] = useState(1);

  // Vänta 400 ms efter sista tangenttryckningen innan vi söker
    useEffect(() => {
        const t = setTimeout(() => {
            const text = input.trim();
            setQuery(text.length >= 2 ? text : "");
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [input]);

  const movies = useFetch(
    (signal) => getMovies({ query, subgenre, decade, sort, page }, signal),
    [query, subgenre, decade, sort, page]
  );

  const totalPages = Math.min(movies.data?.total_pages ?? 1, 500);
  const change = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

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
          onChange={(e) => setInput(e.target.value)}
        />
        <select aria-label="Undergenre" value={subgenre} onChange={(e) => { setSubgenre(Number(e.target.value)); setPage(1); }}>
          {SUBGENRES.map((g, i) => (
            <option key={g.label} value={i}>{g.label}</option>
          ))}
        </select>
        <select aria-label="Årtionde" value={decade} onChange={(e) => { setDecade(Number(e.target.value)); setPage(1); }}>
          <option value={0}>Alla årtionden</option>
          {DECADES.map((d) => (
            <option key={d} value={d}>{d}-talet</option>
          ))}
        </select>
        <select aria-label="Sortering" value={sort} disabled={!!query} onChange={change(setSort)}>
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {movies.loading && <Loader text="Letar i källaren…" />}
      {movies.error && <ErrorMessage message={movies.error} />}

      {!movies.loading && !movies.error && (
        <>
          {results.length === 0 ? (
                      <p>
                          Inga skräckfilmer hittades på den här sidan. Prova ett annat sökord eller filter,
                          eller gå till nästa sida.
                      </p>
                  ) : (
                      <div className="grid">
                          {results.map((m) => (
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
