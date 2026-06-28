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
      "Largest logo placement on event shirts",
      "Logo and website placement on year-round Lewisburg-facing signage",
      "Premium pop-up tent location at the event",
      "Featured newsletter sponsor spotlight",
      "6 complimentary event shirts",
      "Dedicated recognition across print and digital campaign materials",
      "Dedicated custom social media and newsletter spotlight",
      "Prominent logo on the physical campus sponsor banner",
      "Digital 2026-27 Title Sponsor badge",
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
      "Recognition on year-round sponsor banners along the fence",
      "Featured newsletter spotlight",
      "Dedicated social media and newsletter recognition",
      "Digital 2026-27 Platinum Sponsor badge",
    ],
  },
  {
    id: "gold", name: "Gold", amount: "$1,000",
    badge: { kind: "limited", label: "Limited · 10 spots" },
    summary: "Medium shirt logo, school “Thank You” banner & flyer placement.",
    benefits: [
      "Medium logo placement on event shirts",
      "2 complimentary event shirts",
      "Medium logo on the physical campus sponsor banner",
      "Recognition on year-round school sponsor banners along the fence",
      "Dedicated social media post",
      "Recognition in event newsletter",
      "Logo on digital and print event flyer",
      "Digital 2026-27 Gold Sponsor badge",
    ],
  },
  {
    id: "champion", name: "Community Champion", amount: "$600",
    badge: { kind: "open", label: "Open" },
    summary: "School banner recognition, a group social post & newsletter mention.",
    benefits: [
      "Small logo on the physical campus sponsor banner",
      "Logo included in group social media post",
      "Recognition in event newsletter",
      "Digital 2026-27 Community Champion badge",
    ],
  },
  {
    id: "builder", name: "Community Builder", amount: "$300",
    badge: { kind: "open", label: "Open" },
    summary: "Your name on the school “Thank You” banner & sponsor list.",
    benefits: [
      "Business/your name on physical campus sponsor banner",
      "Recognition in social media post",
      "Digital 2026-27 Community Builder badge",
    ],
  },
];

const HEADLINE_EM = {
  "Sponsor our school year.": "school year",
  "Fuel a year at Moore.": "a year",
  "Partner with Moore Elementary.": "Moore Elementary",
};

/* Paste your online donation page URL here when it's ready. Leave "" for now. */
const ONLINE_DONATION_URL = "https://www.zeffy.com/en-US/donation-form/mes-moore-miles-sponsorship";

const SPONSOR_SUBMIT_ENDPOINT = "/api/submit-sponsor.php";
const LOGO_UPLOAD_ENDPOINT = "/api/upload-logo.php";

const SPONSORSHIP_DECK_DOWNLOAD = "https://drive.google.com/uc?export=download&id=1mnGF-1skbeB61SNJOUlQhVU4tVE5hl4P";
const SPONSORSHIP_DECK_VIEW = "https://drive.google.com/file/d/1mnGF-1skbeB61SNJOUlQhVU4tVE5hl4P/view";
const REFERRAL_EMAIL_HREF = "mailto:?subject=Moore%20Elementary%20School%20business%20sponsorship%20opportunity&body=Hi%2C%0A%0AAs%20you%20know%2C%20my%20_____%20attends%20Moore%20Elementary%20School%20in%20Franklin%2C%20TN.%20The%20Moore%20Elementary%20PTO%20is%20gearing%20up%20for%20the%202026%E2%80%932027%20school%20year%2C%20and%20they%27re%20looking%20for%20local%20business%20sponsors%20to%20help%20fund%20classroom%20support%2C%20student%20experiences%2C%20teacher%20appreciation%2C%20and%20community%20events%20throughout%20the%20year.%0A%0AThe%20PTO%20has%20put%20together%20a%20full%20sponsorship%20deck%20with%20tier%20options%20and%20benefits%20%E2%80%94%20from%20small%20community-builder%20levels%20all%20the%20way%20up%20to%20a%20title%20sponsorship%20for%20Moore%20Miles%2C%20our%20signature%20annual%20fundraiser.%20Every%20sponsorship%20reaches%20a%20school%20community%20of%20450%2B%20families%20and%20comes%20with%20year-round%20recognition.%20All%20contributions%20are%20tax-deductible.%0A%0AI%27d%20love%20for%20you%20to%20take%20a%20look%20at%20the%20deck%20and%20consider%20whether%20this%20might%20be%20a%20good%20fit%20for%20your%20business%3A%0A%0Ahttps%3A%2F%2Fdrive.google.com%2Ffile%2Fd%2F1mnGF-1skbeB61SNJOUlQhVU4tVE5hl4P%2Fview%0A%0AReady%20to%20sign%20up%3F%20You%20can%20commit%20for%20the%202026%E2%80%932027%20school%20year%20here%3A%0A%0Ahttps%3A%2F%2Fmoorevolunteers.org%2FBrand%20Sponsorship%20Form%2F%0A%0AHappy%20to%20answer%20any%20questions%20or%20connect%20you%20directly%20with%20the%20PTO.%20Thanks%20so%20much%20for%20considering%21%0A%0ABest%2C";

async function uploadLogoToServer(file) {
  const formData = new FormData();
  formData.append("logo", file);

  const response = await fetch(LOGO_UPLOAD_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Logo upload failed.");
  }

  return result;
}

async function submitSponsorToNotion(payload){
  const response = await fetch(SPONSOR_SUBMIT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Sponsor submission failed.");
  }

  return result;
}


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
          <a className="btn-deck" href={SPONSORSHIP_DECK_DOWNLOAD}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download sponsorship deck
          </a>
          <a className="btn-deck" href={REFERRAL_EMAIL_HREF} style={{ background: "transparent", color: "#0c1546", border: "1.5px solid #0c1546" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Send via email
          </a>
          <span className="referral-note">Share with a local business owner</span>
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
  const [noWebsite, setNoWebsite] = useState(false);
  const [social, setSocial]     = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [addressType, setAddressType] = useState("");
  const [address, setAddress]   = useState("");
  const [contact, setContact]   = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [hearAbout, setHearAbout]   = useState("");
  const [hearName, setHearName]     = useState("");
  const [hearTeacher, setHearTeacher] = useState("");
  const [hearOther, setHearOther]   = useState("");
  const [donateMethod, setDonateMethod] = useState("");
  const [logo, setLogo]         = useState(null);
  const [message, setMessage]   = useState("");
  const [error, setError]       = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* Inline styles so these new controls look right without extra CSS */
  const selectStyle = {
    width: "100%", fontSize: ".95rem", padding: "14px 16px",
    border: "1px solid #dde3ef", borderRadius: "12px", background: "#fff",
    color: "#172033", outline: "none", appearance: "auto",
  };
  const box = { width: "16px", height: "16px", margin: 0, flex: "0 0 auto", cursor: "pointer" };
  // inline-block + width:auto neutralizes any inherited ".field label" block/uppercase rules
  const optLabel = {
    display: "inline-block", width: "auto", margin: 0, fontWeight: 500,
    textTransform: "none", letterSpacing: 0, fontSize: ".95rem", color: "#172033", cursor: "pointer",
  };
  const inlineRow = { display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "8px" };
  const methodCard = (active, disabled = false) => ({
    display: "flex", alignItems: "center", gap: "13px", width: "100%", boxSizing: "border-box",
    padding: "16px 18px", marginBottom: "12px", textAlign: "left", cursor: disabled ? "not-allowed" : "pointer",
    border: "1.5px solid " + (active ? "#0c1546" : "#dde3ef"), borderRadius: "14px",
    background: disabled ? "#f1f3f8" : (active ? "#f6f8ff" : "#fff"),
    opacity: disabled ? .62 : 1,
  });

  const pickLogo = (f) => {
    if (logo && logo.url) URL.revokeObjectURL(logo.url);
    setLogo({ name: f.name, size: f.size, url: URL.createObjectURL(f), file: f });
  };
  const clearLogo = () => {
    if (logo && logo.url) URL.revokeObjectURL(logo.url);
    setLogo(null);
  };

  const submit = async () => {
    setError("");

    if (!tier) return setError("Please choose a sponsorship tier.");
    if (!business.trim()) return setError("Please enter your business or organization name.");
    if (!noWebsite && !website.trim()) return setError("Please enter your website, or check that you don't have one.");
    if (!addressType) return setError("Please select an address type — Residential or Business.");
    if (!address.trim()) return setError("Please enter your address.");
    if (!contact.trim()) return setError("Please enter a primary contact name.");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Please enter a valid email address.");
    if (!phone.trim()) return setError("Please enter a phone number.");
    if (!hearAbout) return setError("Please tell us how you heard about Moore Elementary.");
    if ((hearAbout === "Parent" || hearAbout === "Student") && !hearName.trim())
      return setError("Please enter the " + hearAbout.toLowerCase() + "'s name.");
    if (hearAbout === "Other" && !hearOther.trim())
      return setError("Please tell us how you heard about us.");
    if (!donateMethod) return setError("Please choose how you'd like to donate.");

    const selectedTierForSubmit = TIERS.find((x) => x.id === tier);
    const tierName = selectedTierForSubmit ? selectedTierForSubmit.name : tier;
    const tierAmount = selectedTierForSubmit ? selectedTierForSubmit.amount : "";

    setSubmitting(true);

    try {
      let logoUrl = "";

      if (logo && logo.file) {
        const uploadResult = await uploadLogoToServer(logo.file);
        logoUrl = uploadResult.url || "";
      }

      const hearAboutDetails = [
        hearAbout ? "How they heard about Moore Elementary: " + hearAbout : "",
        hearName ? hearAbout + " name: " + hearName.trim() : "",
        hearTeacher ? "Teacher: " + hearTeacher.trim() : "",
        hearOther ? "Other referral details: " + hearOther.trim() : "",
      ].filter(Boolean).join("\n");

      const messageDetails = [
        message.trim(),
        hearAboutDetails,
        "Donation method: " + (donateMethod === "check" ? "Check" : "Online donation"),
        noWebsite ? "Website: No website" : "",
        tierAmount ? "Sponsorship amount: " + tierAmount : "",
      ].filter(Boolean).join("\n\n");

      await submitSponsorToNotion({
        submittedAt: new Date().toISOString(),
        businessName: business.trim(),
        business: business.trim(),
        website: noWebsite ? "" : website.trim(),
        noWebsite: noWebsite,
        social: social.trim(),
        linkedin: linkedin.trim(),
        addressType: addressType,
        address: address.trim(),
        contactName: contact.trim(),
        contact: contact.trim(),
        email: email.trim(),
        phone: phone.trim(),
        sponsorshipTier: tierName,
        tier: tierName,
        tierAmount: tierAmount,
        logoUrl: logoUrl,
        message: messageDetails,
      });

    window.location.href = "/thank-you/?form=sponsor";
      
    } catch (err) {
      console.error("Sponsor submission error:", err);
      setError(err.message || "There was a problem submitting your sponsorship. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setTier(""); setBusiness(""); setWebsite(""); setNoWebsite(false);
    setSocial(""); setLinkedin(""); setAddressType(""); setAddress("");
    setContact(""); setEmail(""); setPhone("");
    setHearAbout(""); setHearName(""); setHearTeacher(""); setHearOther("");
    setDonateMethod("");
    clearLogo(); setMessage(""); setError(""); setConfirmed(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedTier = TIERS.find((x) => x.id === tier);
  const showNameTeacher = hearAbout === "Parent" || hearAbout === "Student";

  return (
    <div className="vol-body" data-screen-label="Corporate Sponsor Form">

      {t.showHero && (
        <header className="vol-hero">
          <div className="vol-hero-inner">
            <div className="vol-eyebrow">PTO Fundraiser · 2026–2027 School Year</div>
            <h1 className="vol-title"><Headline text={t.headline} /></h1>
            <p className="vol-copy">Partner with the Moore Elementary PTO to fund a full year of classroom support, student experiences, and community events — culminating in Moore Miles, our signature Fun Run. Choose a tier below; every sponsorship reaches an entire school of families.</p>
            <div className="vol-pills">
              <div className="vol-pill"><span className="pill-dot"></span>450+ families reached</div>
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
            <ConfirmScreen tier={selectedTier} method={donateMethod} onReset={reset} />
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
                      <label>Website <span className="req">*</span></label>
                      <input type="text" value={website} disabled={noWebsite}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yourbusiness.com"
                        style={noWebsite ? { background: "#f1f3f8", color: "#9aa3b2" } : undefined} />
                      <div style={{ ...inlineRow, marginTop: "10px" }}>
                        <input id="noWebsite" type="checkbox" checked={noWebsite} style={box}
                          onChange={(e) => { setNoWebsite(e.target.checked); if (e.target.checked) setWebsite(""); }} />
                        <label htmlFor="noWebsite" style={optLabel}>We don't have a website</label>
                      </div>
                    </div>

                    <div className="field field-full">
                      <label>Social Media</label>
                      <input type="text" value={social} onChange={(e) => setSocial(e.target.value)} placeholder="@yourbusiness" />
                    </div>

                    <div className="field field-full">
                      <label>LinkedIn</label>
                      <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/company/yourbusiness" />
                    </div>

                    <div className="field field-full">
                      <label>Address Type <span className="req">*</span></label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "22px", marginTop: "4px", justifyContent: "flex-start" }}>
                        <div style={inlineRow}>
                          <input id="addrRes" type="radio" name="addrType" style={box}
                            checked={addressType === "Residential"} onChange={() => setAddressType("Residential")} />
                          <label htmlFor="addrRes" style={optLabel}>Residential</label>
                        </div>
                        <div style={inlineRow}>
                          <input id="addrBiz" type="radio" name="addrType" style={box}
                            checked={addressType === "Business"} onChange={() => setAddressType("Business")} />
                          <label htmlFor="addrBiz" style={optLabel}>Business</label>
                        </div>
                      </div>
                    </div>

                    {addressType && (
                      <div className="field field-full">
                        <label>{addressType} Address <span className="req">*</span></label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, City, State ZIP" />
                      </div>
                    )}
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
                      <label>Phone Number <span className="req">*</span></label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(615) 555-0000" />
                    </div>
                    <div className="field">
                      <label>How did you hear about Moore Elementary? <span className="req">*</span></label>
                      <select value={hearAbout} onChange={(e) => setHearAbout(e.target.value)} style={selectStyle}>
                        <option value="">Select one…</option>
                        <option value="Parent">Parent</option>
                        <option value="Student">Student</option>
                        <option value="Social Media">Social Media</option>
                        <option value="School Outreach">School Outreach</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {showNameTeacher && (
                      <>
                        <div className="field">
                          <label>{hearAbout} Name <span className="req">*</span></label>
                          <input type="text" value={hearName} onChange={(e) => setHearName(e.target.value)} placeholder="First Last" />
                        </div>
                        <div className="field">
                          <label>Teacher</label>
                          <input type="text" value={hearTeacher} onChange={(e) => setHearTeacher(e.target.value)} placeholder="Teacher's name" />
                        </div>
                      </>
                    )}

                    {hearAbout === "Other" && (
                      <div className="field field-full">
                        <label>Tell us how <span className="req">*</span></label>
                        <textarea value={hearOther} onChange={(e) => setHearOther(e.target.value)} placeholder="How did you hear about Moore Elementary?"></textarea>
                      </div>
                    )}
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

                <FormSection num={6} title="How would you like to donate?" required>
                  <p className="helper">Choose how you'd like to complete your tax-deductible contribution. We'll show the matching details on the confirmation page.</p>
                  <label style={methodCard(donateMethod === "check")}>
                    <input type="radio" name="donateMethod" style={box}
                      checked={donateMethod === "check"} onChange={() => setDonateMethod("check")} />
                    <span style={{ display: "block" }}>
                      <span style={{ display: "block", fontWeight: 700, color: "#0c1546", fontSize: "1rem", textTransform: "none", letterSpacing: 0 }}>Mail or drop check to school (make payable to MES)</span>
                    </span>
                  </label>
                  <div
                    aria-hidden={donateMethod !== "check"}
                    style={{
                      maxHeight: donateMethod === "check" ? "180px" : 0,
                      opacity: donateMethod === "check" ? 1 : 0,
                      transform: donateMethod === "check" ? "translateY(0)" : "translateY(-8px)",
                      overflow: "hidden",
                      margin: donateMethod === "check" ? "0 0 12px" : 0,
                      transition: "max-height 300ms ease, opacity 250ms ease, transform 300ms ease, margin 300ms ease",
                    }}>
                    <div style={{ padding: "16px 18px", background: "#f6f8ff", border: "1px solid #d8dff5", borderRadius: "14px", color: "#0c1546", lineHeight: 1.5 }}>
                      <strong>Moore Elementary School</strong><br />
                      1061 Lewisburg Pike<br />
                      Franklin, TN 37064
                    </div>
                  </div>
                  <label style={methodCard(donateMethod === "online", true)} aria-disabled="true">
                    <input type="radio" name="donateMethod" style={box}
                      checked={donateMethod === "online"} disabled onChange={() => {}} />
                    <span style={{ display: "block" }}>
                      <span style={{ display: "block", fontWeight: 700, color: "#667085", fontSize: "1rem", textTransform: "none", letterSpacing: 0 }}>Online donation</span>
                      <span style={{ display: "block", fontWeight: 600, color: "#8a94a6", fontSize: ".88rem", textTransform: "none", letterSpacing: 0, marginTop: "2px" }}>Not available at this time</span>
                    </span>
                  </label>

                  {donateMethod === "online" && (
                    <div style={{ marginTop: "4px", padding: "20px 22px", background: "#f6f8ff", border: "1px solid #d8dff5", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
                      <span style={{ color: "#0c1546", fontWeight: 500, fontSize: ".95rem" }}>
                        You'll be taken to our secure donation page to complete your gift.
                      </span>
                      {/* TODO: replace "#" with your donation page URL when it's ready */}
                      <a href={ONLINE_DONATION_URL || "#"}
                        target={ONLINE_DONATION_URL ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        onClick={(e) => { if (!ONLINE_DONATION_URL) e.preventDefault(); }}
                        style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 22px", background: "#0c1546", color: "#ffc200", borderRadius: "10px", fontWeight: 700, fontSize: ".95rem", textDecoration: "none", whiteSpace: "nowrap", letterSpacing: ".01em", textTransform: "none" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        Donate online
                      </a>
                    </div>
                  )}
                </FormSection>

                <div className="submit-section">
                  <p className="submit-note">Submitting this form reserves your tier and lets the PTO follow up to confirm details. You'll complete your tax-deductible donation on the next step.</p>
                  <button type="button" className="btn-submit" onClick={submit} disabled={submitting}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    {submitting ? "Submitting..." : "Submit Sponsorship"}
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

function ConfirmScreen({ tier, method, onReset }) {
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
            {method === "check" ? (
              <>
                <div>
                  <div className="donate-kicker">One last step</div>
                  <h3>Drop your check at the school</h3>
                  <p>Make your check payable to <strong>Moore Elementary School</strong> and drop it at the front office, or mail it to the address below. Your tax-deductible donation completes your sponsorship.</p>
                </div>
                <div className="donate-actions">
                  <div style={{ background: "#fff", border: "1px solid #e6e9f2", borderRadius: "14px", padding: "16px 18px", fontWeight: 600, color: "#0c1546", lineHeight: 1.5 }}>
                    Moore Elementary School<br />
                    <span style={{ fontWeight: 500, color: "#5a6477" }}>1061 Lewisburg Pike<br />Franklin, TN 37064</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="donate-kicker">One last step</div>
                  <h3>Complete your donation</h3>
                  <p>Finish your sponsorship with your tax-deductible gift through our secure online donation page.</p>
                </div>
                <div className="donate-actions">
                  <a className="btn-donate" href={ONLINE_DONATION_URL || undefined}
                    target="_blank" rel="noopener noreferrer"
                    onClick={(e) => { if (!ONLINE_DONATION_URL) e.preventDefault(); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    Donate online
                  </a>
                  <span className="donate-note">{ONLINE_DONATION_URL ? "Opens our secure donation page" : "Secure donation page — link coming soon"}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <button type="button" className="btn-text" onClick={onReset}>Submit another sponsorship →</button>
      </div>
    </div>
  );
}

Object.assign(window, { SponsorForm });
