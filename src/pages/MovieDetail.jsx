import { Link, useParams } from "react-router-dom";
import { IMG, RENT_FACTOR, getMovie, priceFor } from "../api/tmdb";
import useFetch from "../hooks/useFetch";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import Price from "../components/Price";

export default function MovieDetail() {
  const { id } = useParams();
  const { data: movie, loading, error } = useFetch((s) => getMovie(id, s), [id]);

  if (loading) return <Loader text="Gräver fram filmfakta…" />;
  if (error) return <ErrorMessage message={error} />;

  const base = priceFor(movie);
  const director = movie.credits?.crew.find((c) => c.job === "Director");
  const cast = movie.credits?.cast.slice(0, 6).map((c) => c.name).join(", ");

  return (
    <main className="detail">
      <Link to="/">← Tillbaka till katalogen</Link>
      <div className="detail-body">
        {movie.poster_path && (
          <img src={`${IMG}/w500${movie.poster_path}`} alt={`Affisch för ${movie.title}`} />
        )}
        <div>
          <h1>{movie.title}</h1>
          {movie.tagline && <p className="tagline">{movie.tagline}</p>}
          <p className="meta">
            {movie.release_date?.slice(0, 4)} · {movie.runtime} min · ★ {movie.vote_average?.toFixed(1)} ·{" "}
            {movie.genres.map((g) => g.name).join(", ")}
          </p>
          <p>{movie.overview || "Det finns ingen svensk beskrivning av den här filmen."}</p>
          {director && <p><strong>Regi:</strong> {director.name}</p>}
          {cast && <p><strong>Skådespelare:</strong> {cast}</p>}

          <div className="buy-box">
            <span>Köp <Price amount={base} /></span>
            <span>Hyr <Price amount={Math.round(base * RENT_FACTOR)} /></span>
          </div>
        </div>
      </div>
    </main>
  );
}
