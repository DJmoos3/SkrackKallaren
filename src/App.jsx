import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Catalog from "./pages/Catalog";
import MovieDetail from "./pages/MovieDetail";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<p>Sidan finns inte.</p>} />
        </Routes>
      </div>
    </>
  );
}
