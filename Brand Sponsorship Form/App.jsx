/* global React, ReactDOM, SponsorForm */

const SPONSOR_DEFAULTS = {
  showHero: true,
  tierStyle: "cards",
  headline: "Sponsor our school year.",
};

function App() {
  return <SponsorForm t={SPONSOR_DEFAULTS} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
