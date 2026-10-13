// Enkel prisvisning i SEK (valutaväxling kommer i ett senare steg)
export default function Price({ amount }) {
  return (
    <span>
      {new Intl.NumberFormat("sv-SE", {
        style: "currency",
        currency: "SEK",
        maximumFractionDigits: 0,
      }).format(amount)}
    </span>
  );
}
