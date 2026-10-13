export default function ErrorMessage({ message }) {
  return (
    <div className="error" role="alert">
      <strong>Något gick fel.</strong>
      <p>{message}</p>
    </div>
  );
}
