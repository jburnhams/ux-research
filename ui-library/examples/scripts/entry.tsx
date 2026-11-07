// Mounts one example screen per URL hash, for the render script and for local viewing.
// ?theme=dark renders the dark theme; ?density=compact the compact density.
import "@fontsource-variable/public-sans";
import "@fontsource-variable/archivo/wdth.css";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { BookFiring } from "@/screens/book-firing";
import { Booked } from "@/screens/booked";
import { KilnRoom } from "@/screens/kiln-room";
import { bookings } from "@/screens/sample-data";
import { SystemPage } from "@/screens/system";

const params = new URLSearchParams(location.search);
if (params.get("theme") === "dark") document.documentElement.classList.add("dark");
if (params.get("density")) document.documentElement.dataset.density = params.get("density")!;

const screens: Record<string, () => React.ReactElement> = {
  "kiln-room": () => <KilnRoom load={{ status: "ready", data: bookings }} />,
  "kiln-room-loading": () => <KilnRoom load={{ status: "loading" }} />,
  "kiln-room-empty": () => <KilnRoom load={{ status: "ready", data: [] }} />,
  book: () => <BookFiring />,
  "book-errors": () => <BookFiring initial={{ firing: "glaze", kiln: "2", pieces: "6", tallest: "38" }} showErrors />,
  booked: () => <Booked firing="glaze" kiln="2" pieces={6} tallest={24} />,
  system: () => <SystemPage />,
};

function App() {
  const [hash, setHash] = React.useState(location.hash.slice(1) || "kiln-room");
  React.useEffect(() => {
    const on = () => {
      setHash(location.hash.slice(1) || "kiln-room");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  const Screen = screens[hash] ?? screens["kiln-room"];
  return <Screen key={hash} />;
}

createRoot(document.getElementById("root")!).render(<App />);
