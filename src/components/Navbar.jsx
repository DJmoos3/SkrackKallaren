import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        Skräckkällaren
      </Link>
      <nav>
        <NavLink to="/" end>
          Katalog
        </NavLink>
      </nav>
    </header>
  );
}
