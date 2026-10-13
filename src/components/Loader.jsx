export default function Loader({ text = "Hämtar…" }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="spinner" />
      <span>{text}</span>
    </div>
  );
}
