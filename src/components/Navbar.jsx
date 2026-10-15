import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
    const count = useSelector((s) => s.cart.items.length);

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
            </nav>
        </header>
    );
}