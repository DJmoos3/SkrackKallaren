import { useSelector } from "react-redux";

export default function Price({ amount }) {
  const { selected, rates } = useSelector((s) => s.currency);
  const value = amount * (rates[selected] ?? 1);
  return (
    <span>
      {new Intl.NumberFormat("sv-SE", {
        style: "currency",
        currency: selected,
        maximumFractionDigits: selected === "SEK" || selected === "NOK" ? 0 : 2,
      }).format(value)}
    </span>
  );
}
