import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Catalog from "./pages/Catalog";
import MovieDetail from "./pages/MovieDetail";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="*" element={<p>Sidan finns inte.</p>} />
        </Routes>
      </div>
    </>
  );
}
