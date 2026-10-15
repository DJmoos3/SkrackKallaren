// Sekundärt API (VG-krav 2): Frankfurter – gratis valutakurser, ingen nyckel behövs.
export async function getRates(signal) {
    const res = await fetch(
        "https://api.frankfurter.dev/v2/rates?base=SEK&quotes=USD,EUR,GBP,NOK",
        { signal }
    );
    if (!res.ok) throw new Error("Kunde inte hämta valutakurser.");
    const rows = await res.json(); // en lista: [{ base, quote, rate, date }, ...]
    const rates = { SEK: 1 };
    rows.forEach((r) => {
        rates[r.quote] = r.rate;
    });
    return rates;
}