/**
 * Die-cut sticker versions of designs from the PATCHED wall (cherries, heart, smiley, palm, disco ball, GOOD VIBES).
 * Purely decorative.
 */
type P = { className?: string; style?: React.CSSProperties };
const OUT = { fill: "#fff", stroke: "#fff", strokeWidth: 10, strokeLinejoin: "round" as const };

export function Cherries({ className, style }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <g {...OUT}>
        <circle cx="33" cy="70" r="17" /><circle cx="66" cy="66" r="17" />
        <path d="M33 54 C40 30 52 18 64 14 M66 50 C64 34 62 24 64 14" fill="none" />
        <path d="M64 14 C74 8 86 12 90 20 C80 26 70 24 64 14Z" />
      </g>
      <path d="M33 54 C40 30 52 18 64 14 M66 50 C64 34 62 24 64 14" fill="none" stroke="#2f5d2a" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M64 14 C74 8 86 12 90 20 C80 26 70 24 64 14Z" fill="#3f7a35" />
      <circle cx="33" cy="70" r="17" fill="#c41e3a" /><circle cx="66" cy="66" r="17" fill="#d42a46" />
      <circle cx="27" cy="64" r="4" fill="#fff" opacity=".55" /><circle cx="60" cy="60" r="4" fill="#fff" opacity=".55" />
    </svg>
  );
}

export function Heart({ className, style }: P) {
  const d = "M50 86 C20 66 8 50 8 33 C8 20 18 11 30 11 C39 11 46 16 50 24 C54 16 61 11 70 11 C82 11 92 20 92 33 C92 50 80 66 50 86Z";
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <path d={d} {...OUT} />
      <path d={d} fill="#17130f" />
      <text x="50" y="50" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fbf8f3" fontFamily="var(--font-brand)" letterSpacing=".5">PATCHED</text>
    </svg>
  );
}

export function Smiley({ className, style }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <circle cx="50" cy="50" r="42" {...OUT} />
      <circle cx="50" cy="50" r="42" fill="#f6c945" />
      <ellipse cx="37" cy="40" rx="5" ry="8" fill="#17130f" /><ellipse cx="63" cy="40" rx="5" ry="8" fill="#17130f" />
      <path d="M28 58 C34 74 66 74 72 58" fill="none" stroke="#17130f" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function Palm({ className, style }: P) {
  const leaves = "M50 30 C40 18 24 16 12 22 C26 22 36 26 44 34 M50 30 C58 16 74 12 88 18 C74 20 64 24 56 34 M50 30 C46 18 50 8 58 4 C56 14 56 22 52 32 M50 30 C36 30 24 38 20 50 C30 42 40 38 48 36 M50 30 C64 30 76 38 80 50 C70 42 60 38 52 36";
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <g {...OUT}><path d={leaves} /><path d="M50 32 C54 52 52 74 46 94" fill="none" /></g>
      <path d="M50 32 C54 52 52 74 46 94" fill="none" stroke="#17130f" strokeWidth="5" strokeLinecap="round" />
      <path d={leaves} fill="#17130f" stroke="#17130f" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function Disco({ className, style }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <circle cx="50" cy="54" r="38" {...OUT} />
      <line x1="50" y1="4" x2="50" y2="16" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
      <line x1="50" y1="4" x2="50" y2="16" stroke="#6e655b" strokeWidth="2.5" />
      <circle cx="50" cy="54" r="38" fill="#cfc6bb" />
      <g stroke="#8f857a" strokeWidth="1.6" fill="none">
        <ellipse cx="50" cy="54" rx="38" ry="12" /><ellipse cx="50" cy="54" rx="38" ry="26" />
        <ellipse cx="50" cy="54" rx="12" ry="38" /><ellipse cx="50" cy="54" rx="26" ry="38" /><line x1="12" y1="54" x2="88" y2="54" />
      </g>
      <path d="M30 36 l6 -8 l6 8 l-6 8z" fill="#fff" opacity=".9" />
      <circle cx="66" cy="70" r="4" fill="#fff" opacity=".7" />
    </svg>
  );
}

export function GoodVibes({ className, style }: P) {
  return (
    <svg viewBox="0 0 140 90" className={className} style={style} aria-hidden="true">
      <rect x="4" y="4" width="132" height="82" rx="20" fill="#fff" />
      <rect x="10" y="10" width="120" height="70" rx="15" fill="#17130f" />
      <text x="70" y="42" textAnchor="middle" fontSize="23" fontWeight="900" fill="#fbf8f3" fontFamily="var(--font-brand)">GOOD</text>
      <text x="70" y="67" textAnchor="middle" fontSize="23" fontWeight="900" fill="#e9a955" fontFamily="var(--font-brand)">VIBES</text>
    </svg>
  );
}
