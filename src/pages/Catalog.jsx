import { useState } from "react";
import { getMovies } from "../api/tmdb";
import useFetch from "../hooks/useFetch";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

export default function Catalog() {
  const [page, setPage] = useState(1);
  const movies = useFetch((signal) => getMovies({ page }, signal), [page]);

  return (
    <main>
      <h1>Vad vågar du se ikväll?</h1>

      {movies.loading && <Loader text="Letar i källaren…" />}
      {movies.error && <ErrorMessage message={movies.error} />}

      {!movies.loading && !movies.error && (
        <>
          <div className="grid">
            {movies.data.results.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
          <div className="pagination">
            <button className="btn ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Föregående
            </button>
            <span>Sida {page}</span>
            <button className="btn ghost" onClick={() => setPage(page + 1)}>
              Nästa
            </button>
          </div>
        </>
      )}
    </main>
  );
}
