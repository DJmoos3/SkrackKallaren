import { IMG } from "../api/tmdb";

export default function MovieCard({ movie }) {
  return (
    <article className="card">
      {movie.poster_path ? (
        <img src={`${IMG}/w342${movie.poster_path}`} alt={`Affisch för ${movie.title}`} loading="lazy" />
      ) : (
        <div className="no-poster">Ingen affisch</div>
      )}
      <h3>{movie.title}</h3>
      <p className="meta">
        {movie.release_date?.slice(0, 4) || "Okänt år"} · ★ {movie.vote_average?.toFixed(1)}
      </p>
    </article>
  );
}
