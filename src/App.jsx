import Catalog from "./pages/Catalog";

export default function App() {
  return (
    <>
      <header className="navbar">
        <span className="logo">Skräckkällaren</span>
      </header>
      <div className="container">
        <Catalog />
      </div>
    </>
  );
}
