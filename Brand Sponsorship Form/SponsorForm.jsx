/* global React */
const { useState, useRef } = React;

/* ---------- Data ---------- */
const TIERS = [
  {
    id: "title", name: "Title Sponsor", amount: "$5,000",
    badge: { kind: "flagship", label: "Flagship · 1 spot" },
    summary: "Naming rights, a speaking slot & top billing across the entire campaign.",
    benefits: [
      "Naming rights: “Moore Miles presented by [Your Business]”",
      "Speaking opportunity at the event",
      "Largest logo placement among all sponsors on event shirts",
      "Featured placement on Lewisburg-facing signage or car rider line banners",
      "Premium pop-up tent location at the event",
      "6 complimentary event shirts",
      "Dedicated sponsor recognition across campaign materials",
      "Dedicated customizeable social media and newsletter spotlight",
      "Logo on printed and digital materials, including flyers, banners, and emails",
      "Prominent logo on the physical campus sponsor banner",
      "Digital Title Sponsor badge",
    ],
  },
  {
    id: "platinum", name: "Platinum", amount: "$2,000",
    badge: { kind: "limited", label: "Limited · 4 spots" },
    summary: "Branded track sign, large shirt logo & year-round banner recognition.",
    benefits: [
      "Branded track sign with QR code",
      "Large logo placement on event shirts",
      "Large logo on the physical campus sponsor banner",
      "4 complimentary event shirts",
      "Recognition on year-round school sponsor banners along the fence",
      "Featured sponsor signage opportunities",
      "Featured newsletter sponsor spotlight",
      "Social media and newsletter recognition",
      "Digital Platinum Sponsor badge",
    ],
  },
  {
    id: "gold", name: "Gold", amount: "$1,000",
    badge: { kind: "limited", label: "Limited · 10 spots" },
    summary: "Medium shirt logo, school “Thank You” banner & flyer placement.",
    benefits: [
      "Medium logo placement on event shirts",
      "2 complimentary event shirts",
      "Logo on the physical campus sponsor banner",
      "Recognition on year-round school sponsor banners along the fence",
      "Logo included on social media post",
      "Recognition in event newsletter",
      "Logo featured on digital and print event flyer",
      "Digital Gold Sponsor badge",
    ],
  },
  {
    id: "champion", name: "Community Champion", amount: "$600",
    badge: { kind: "open", label: "Open" },
    summary: "School banner recognition, a group social post & newsletter mention.",
    benefits: [
      "Small logo on the physical campus sponsor banner",
      "Logo included in group Instagram post",
      "Recognition in event newsletter",
      "Digital Community Champion badge",
    ],
  },
  {
    id: "builder", name: "Community Builder", amount: "$300",
    badge: { kind: "open", label: "Open" },
    summary: "Your name on the school “Thank You” banner & sponsor list.",
    benefits: [
      "Business/personal name on the physical campus sponsor banner",
      "Recognition on year-round school sponsor banners along the fence",
      "Recognition in social media post",
      "Digital Community Builder badge",
    ],
  },
];

const HEADLINE_EM = {
  "Sponsor our school year.": "school year",
  "Fuel a year at Moore.": "a year",
  "Partner with Moore Elementary.": "Moore Elementary",
};

function Headline({ text }) {
  const em = HEADLINE_EM[text];
  if (!em || !text.includes(em)) return <>{text}</>;
  const [before, after] = text.split(em);
  return <>{before}<em>{em}</em>{after}</>;
}

/* ---------- Sub-components ---------- */
function TierCard({ tier, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={"tier-card" + (selected ? " selected" : "")}>
      <div className="tier-head" onClick={onSelect} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(); } }}>
        <div className="tier-top">
          <span className="tier-name">{tier.name}</span>
          <span className="tier-radio">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="2 6 5 9 10 3"></polyline>
            </svg>
          </span>
        </div>
        <div className="tier-amount">{tier.amount}</div>
        <span className={"tier-badge " + tier.badge.kind}>
          <span className="spot-dot"></span>{tier.badge.label}
        </span>
        <p className="tier-summary">{tier.summary}</p>
      </div>
      <button type="button" className={"tier-expand" + (open ? " open" : "")} onClick={() => setOpen(!open)}
        aria-expanded={open}>
        <span>{open ? "Hide benefits" : "View benefits"}</span>
        <svg className="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div className={"tier-benefits-wrap" + (open ? " open" : "")}>
        <div className="tier-benefits-inner">
          <ul className="tier-benefits">
            {tier.benefits.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ReferralBand() {
  return (
    <section className="referral-band" aria-labelledby="referral-title">
      <div className="referral-text">
        <div className="referral-kicker">Pass it on</div>
        <h2 className="referral-headline" id="referral-title">Know a business that should <em>sponsor</em>?</h2>
        <p className="referral-copy">You don't have to own a business to make a difference. Download our sponsorship deck and share it with a local business owner — a favorite restaurant, your family's dentist, the shop down the street. One quick introduction can help fund a whole year for Moore students.</p>
        <div className="referral-actions">
          <a className="btn-deck" href="uploads/moore-miles-sponsorship-deck.pdf" download>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download sponsorship deck
          </a>
          <span className="referral-note">PDF · ready to text or email</span>
        </div>
      </div>
      <div className="referral-visual" aria-hidden="true">
        <div className="deck-stack">
          <div className="deck-page deck-page-3"></div>
          <div className="deck-page deck-page-2"></div>
          <img className="deck-cover-img" src="assets/sponsorship-deck-cover.png" alt="Sponsorship deck cover" />
        </div>
      </div>
    </section>
  );
}

function FormSection({ num, title, sub, required, children }) {
  return (
    <div className="form-section">
      <div className="section-label">
        <div className="section-num">{num}</div>
        <div className="section-title-form">
          {title}{required && <span className="req"> *</span>}
          {sub && <span className="section-sub">{sub}</span>}
        </div>
      </div>
      {children}
    </div>
  );
}

function LogoUpload({ file, onPick, onClear }) {
  const inputRef = useRef(null);
  const fmtSize = (b) => b < 1024 * 1024 ? (b / 1024).toFixed(0) + " KB" : (b / 1048576).toFixed(1) + " MB";
  return (
    <>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/svg+xml,.svg,.png,.jpg,.jpeg" style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files[0]; if (f) onPick(f); }} />
      {file ? (
        <div className="logo-drop has-file">
          <div className="logo-preview-row">
            <img className="logo-thumb" src={file.url} alt="Logo preview" />
            <div className="logo-file-meta">
              <div className="logo-file-name">{file.name}</div>
              <div className="logo-file-size">{fmtSize(file.size)}</div>
            </div>
            <button type="button" className="logo-remove" onClick={onClear}>Remove</button>
          </div>
        </div>
      ) : (
        <div className="logo-drop" onClick={() => inputRef.current && inputRef.current.click()}>
          <div className="logo-drop-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <div className="logo-drop-title">Upload your logo</div>
          <div className="logo-drop-hint">Vector file or transparent PNG preferred · PNG, JPG, or SVG</div>
        </div>
      )}
    </>
  );
}

/* ---------- Main page ---------- */
function SponsorForm({ t }) {
  const [tier, setTier]         = useState("");
  const [business, setBusiness] = useState("");
  const [website, setWebsite]   = useState("");
  const [address, setAddress]   = useState("");
  const [contact, setContact]   = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [connection, setConn]   = useState("");
  const [logo, setLogo]         = useState(null);
  const [message, setMessage]   = useState("");
  const [error, setError]       = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const pickLogo = (f) => {
    if (logo && logo.url) URL.revokeObjectURL(logo.url);
    setLogo({ name: f.name, size: f.size, url: URL.createObjectURL(f) });
  };
  const clearLogo = () => {
    if (logo && logo.url) URL.revokeObjectURL(logo.url);
    setLogo(null);
  };

  const submit = () => {
    setError("");
    if (!tier) return setError("Please choose a sponsorship tier.");
    if (!business.trim()) return setError("Please enter your business or organization name.");
    if (!contact.trim()) return setError("Please enter a primary contact name.");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Please enter a valid email address.");
    setConfirmed(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setTier(""); setBusiness(""); setWebsite(""); setAddress("");
    setContact(""); setEmail(""); setPhone(""); setConn("");
    clearLogo(); setMessage(""); setError(""); setConfirmed(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedTier = TIERS.find((x) => x.id === tier);

  return (
    <div className="vol-body" data-screen-label="Corporate Sponsor Form">
      <header className="brand-bar">
        <div className="brand-bar-inner">
          <div className="brand-lockup">
            <img src="assets/MES Stacked.png" alt="Moore Elementary PTO" />
            <div>
              <span className="brand-name">Moore Elementary PTO</span>
              <span className="brand-sub">Home of the Eagles</span>
            </div>
          </div>
          <a className="brand-back" href="https://moorevolunteers.org">>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            Back to site
          </a>
        </div>
      </header>

      {t.showHero && (
        <header className="vol-hero">
          <div className="vol-hero-inner">
            <div className="vol-eyebrow">PTO Fundraiser · 2026–2027 School Year</div>
            <h1 className="vol-title"><Headline text={t.headline} /></h1>
            <p className="vol-copy">Partner with the Moore Elementary PTO to fund a full year of classroom support, student experiences, and community events — culminating in Moore Miles, our signature Fun Run. Choose a tier below; every sponsorship reaches an entire school of families.</p>
            <div className="vol-pills">
              <div className="vol-pill"><span className="pill-dot"></span>500+ students reached</div>
              <div className="vol-pill"><span className="pill-dot"></span>Year-long recognition</div>
              <div className="vol-pill"><span className="pill-dot"></span>Tax-deductible</div>
            </div>
          </div>
          <div className="hero-bottom-bar"></div>
        </header>
      )}

      <main className="vol-main">
        <div className="container">
          {confirmed ? (
            <ConfirmScreen tier={selectedTier} onReset={reset} />
          ) : (
            <>
              <ReferralBand />
              <div className="form-wrap">
              <div className="form-card">
                {error && <div className="error-msg">{error}</div>}

                <FormSection num={1} title="Choose your sponsorship tier" required>
                  <p className="helper">Every sponsorship supports the PTO's work throughout the 2026–2027 school year and is celebrated at Moore Miles, our culminating event. Higher tiers have limited availability.</p>
                  <div className={"tier-grid" + (t.tierStyle === "compact" ? " compact" : "")}>
                    {TIERS.map((tr) => (
                      <TierCard key={tr.id} tier={tr} selected={tier === tr.id} onSelect={() => setTier(tr.id)} />
                    ))}
                  </div>
                </FormSection>

                <FormSection num={2} title="Business information">
                  <div className="field-grid">
                    <div className="field field-full">
                      <label>Business / Organization Name <span className="req">*</span></label>
                      <input type="text" value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="e.g. Eagle Builders LLC" />
                    </div>
                    <div className="field field-full">
                      <label>Website or Social</label>
                      <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https:// or @yourbusiness" />
                    </div>
                    <div className="field field-full">
                      <label>Business Address</label>
                      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, City, State ZIP" />
                    </div>
                  </div>
                </FormSection>

                <FormSection num={3} title="Primary contact">
                  <div className="field-grid">
                    <div className="field">
                      <label>Contact Name <span className="req">*</span></label>
                      <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="First Last" />
                    </div>
                    <div className="field">
                      <label>Email Address <span className="req">*</span></label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" />
                    </div>
                    <div className="field">
                      <label>Phone Number</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(615) 555-0000" />
                    </div>
                    <div className="field">
                      <label>Connection to Moore</label>
                      <input type="text" value={connection} onChange={(e) => setConn(e.target.value)} placeholder="e.g. Parent of a 3rd grader, alum, neighbor" />
                    </div>
                  </div>
                </FormSection>

                <FormSection num={4} title="Logo for recognition" sub=" (Title, Platinum & Gold)">
                  <p className="helper">Sponsors at the Gold tier and above are featured by logo on Moore Miles t-shirts and the year-long thank-you banner. Send a vector file or transparent PNG so we can print it crisply.</p>
                  <LogoUpload file={logo} onPick={pickLogo} onClear={clearLogo} />
                </FormSection>

                <FormSection num={5} title="Anything else you'd like us to know?">
                  <div className="field">
                    <label>Message <span className="section-sub" style={{ textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How you'd like to be recognized, questions about a tier, or a note for the PTO."></textarea>
                  </div>
                </FormSection>

                <div className="submit-section">
                  <p className="submit-note">Submitting this form reserves your tier and lets the PTO follow up to confirm details. You'll complete your tax-deductible donation on the next step.</p>
                  <button type="button" className="btn-submit" onClick={submit}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    Submit Sponsorship
                  </button>
                </div>
              </div>
            </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function ConfirmScreen({ tier, onReset }) {
  return (
    <div className="form-wrap">
      <div className="confirm-shell">
        <div className="confirm-badge">🎉</div>
        <div className="confirm-title">Thank you for sponsoring <em>Moore Elementary</em>!</div>
        <p className="confirm-msg">We've received your sponsorship details and the PTO will reach out shortly to confirm everything and collect your logo. Your support powers a full year of programs for Moore families — and we can't wait to celebrate you at Moore Miles this spring.</p>
        {tier && (
          <div className="confirm-recap">
            {tier.name} · <span className="recap-amount">{tier.amount}</span>
          </div>
        )}

        <div className="donate-band">
          <div className="donate-band-grid">
            <div>
              <div className="donate-kicker">One last step</div>
              <h3>Complete your donation</h3>
              <p>Finish your sponsorship by sending your tax-deductible donation to the Moore Elementary PTO. You can give online, or make checks payable to Moore Elementary School.</p>
            </div>
            <div className="donate-actions">
              <button type="button" className="btn-donate" onClick={() => {}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                Donate
              </button>
              <span className="donate-note">Secure donation page — link coming soon</span>
            </div>
          </div>
        </div>

        <button type="button" className="btn-text" onClick={onReset}>Submit another sponsorship →</button>
      </div>
    </div>
  );
}

Object.assign(window, { SponsorForm });
