import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IMG, priceFor } from "../api/tmdb";
import { addItem, removeItem } from "../store/cartSlice";
import Price from "./Price";

export default function MovieCard({ movie }) {
  const dispatch = useDispatch();
  const inCart = useSelector((s) => s.cart.items.some((i) => i.id === movie.id));
  const price = priceFor(movie);

  const toggle = () =>
    dispatch(
      inCart
        ? removeItem(movie.id)
        : addItem({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            basePrice: price,
            mode: "buy",
          })
    );

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
          <Price amount={price} />
        </strong>
        <button className={inCart ? "btn ghost" : "btn"} onClick={toggle}>
          {inCart ? "Ta bort" : "Lägg i kundvagn"}
        </button>
      </div>
    </article>
  );
}
