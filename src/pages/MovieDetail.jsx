import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IMG, RENT_FACTOR, getMovie, priceFor } from "../api/tmdb";
import { addItem, removeItem } from "../store/cartSlice";
import useFetch from "../hooks/useFetch";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import Price from "../components/Price";

export default function MovieDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [mode, setMode] = useState("buy");
  const { data: movie, loading, error } = useFetch((s) => getMovie(id, s), [id]);
  const inCart = useSelector((s) => s.cart.items.some((i) => i.id === Number(id)));

  if (loading) return <Loader text="Gräver fram filmfakta…" />;
  if (error) return <ErrorMessage message={error} />;

  const base = priceFor(movie);
  const trailer = movie.videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer");
  const director = movie.credits?.crew.find((c) => c.job === "Director");
  const cast = movie.credits?.cast.slice(0, 6).map((c) => c.name).join(", ");

  const toggle = () =>
    dispatch(
      inCart
        ? removeItem(movie.id)
        : addItem({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            basePrice: mode === "rent" ? Math.round(base * RENT_FACTOR) : base,
            mode,
          })
    );

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
            <label>
              <input type="radio" checked={mode === "buy"} onChange={() => setMode("buy")} disabled={inCart} /> Köp{" "}
              <Price amount={base} />
            </label>
            <label>
              <input type="radio" checked={mode === "rent"} onChange={() => setMode("rent")} disabled={inCart} /> Hyr{" "}
              <Price amount={Math.round(base * RENT_FACTOR)} />
            </label>
            <button className={inCart ? "btn ghost" : "btn"} onClick={toggle}>
              {inCart ? "Ta bort från kundvagn" : "Lägg i kundvagn"}
            </button>
          </div>
        </div>
      </div>

      {trailer && (
        <section>
          <h2>Trailer</h2>
          <div className="video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
              title={`Trailer för ${movie.title}`}
              allowFullScreen
            />
          </div>
        </section>
      )}
    </main>
  );
}
