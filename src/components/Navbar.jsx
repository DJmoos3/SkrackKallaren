import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRates } from "../api/currency";
import { setCurrency, setRates } from "../store/currencySlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const count = useSelector((s) => s.cart.items.length);
  const { selected, rates } = useSelector((s) => s.currency);

  useEffect(() => {
    const controller = new AbortController();
    getRates(controller.signal)
      .then((r) => dispatch(setRates(r)))
      .catch(() => {
        /* Vid fel stannar vi på SEK */
      });
    return () => controller.abort();
  }, [dispatch]);

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        Skräckkällaren
      </Link>
      <nav>
        <NavLink to="/" end>
          Katalog
        </NavLink>
        <NavLink to="/cart">Kundvagn ({count})</NavLink>
        <select
          aria-label="Välj valuta"
          value={selected}
          onChange={(e) => dispatch(setCurrency(e.target.value))}
        >
          {Object.keys(rates).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </nav>
    </header>
  );
}
