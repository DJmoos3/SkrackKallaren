import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IMG } from "../api/tmdb";
import { clearCart, removeItem } from "../store/cartSlice";
import Price from "../components/Price";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);
  const total = items.reduce((sum, i) => sum + i.basePrice, 0);

  if (items.length === 0) {
    return (
      <main>
        <h1>Kundvagn</h1>
        <p>Kundvagnen är tom. Inget att vara rädd för än.</p>
        <Link to="/">Hitta en film att köpa eller hyra</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Kundvagn</h1>
      <ul className="cart-list">
        {items.map((i) => (
          <li key={i.id}>
            {i.poster_path && <img src={`${IMG}/w92${i.poster_path}`} alt="" />}
            <div>
              <Link to={`/movie/${i.id}`}>{i.title}</Link>
              <p className="meta">{i.mode === "rent" ? "Hyrfilm" : "Köpfilm"}</p>
            </div>
            <strong>
              <Price amount={i.basePrice} />
            </strong>
            <button className="btn ghost" onClick={() => dispatch(removeItem(i.id))}>
              Ta bort
            </button>
          </li>
        ))}
      </ul>
      <p className="total">
        Totalt: <Price amount={total} />
      </p>
      <button className="btn ghost" onClick={() => dispatch(clearCart())}>
        Töm kundvagnen
      </button>
    </main>
  );
}
