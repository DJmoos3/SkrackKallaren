import { Link } from "react-router-dom";
import { IMG, priceFor } from "../api/tmdb";
import Price from "./Price";

export default function MovieCard({ movie }) {
  return (
    <article className="card">
      <Link to={`/movie/${movie.id}`}>
        {movie.poster_path ? (
          <img src={`${IMG}/w342${movie.poster_path}`} alt={`Affisch för ${movie.title}`} loading="lazy" />
        ) : (
          <div className="no-poster">Ingen affisch</div>
        )}
        <h3>{movie.title}</h3>
      </Link>
      <p className="meta">
        {movie.release_date?.slice(0, 4) || "Okänt år"} · ★ {movie.vote_average?.toFixed(1)}
      </p>
      <div className="card-footer">
        <strong>
          <Price amount={priceFor(movie)} />
        </strong>
      </div>
    </article>
  );
}
