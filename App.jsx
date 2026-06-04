/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakRadio, TweakSelect, SponsorForm */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showHero": true,
  "tierStyle": "cards",
  "headline": "Sponsor our school year."
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  return (
    <>
      <SponsorForm t={t} />
      <TweaksPanel>
        <TweakSection label="Hero" />
        <TweakToggle label="Show hero banner" value={t.showHero} onChange={(v) => setTweak("showHero", v)} />
        <TweakSelect label="Headline" value={t.headline}
          options={["Sponsor our school year.", "Fuel a year at Moore.", "Partner with Moore Elementary."]}
          onChange={(v) => setTweak("headline", v)} />
        <TweakSection label="Tiers" />
        <TweakRadio label="Tier layout" value={t.tierStyle}
          options={["cards", "compact"]}
          onChange={(v) => setTweak("tierStyle", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
