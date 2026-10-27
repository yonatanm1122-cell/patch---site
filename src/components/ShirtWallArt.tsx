/** Concept illustration for the Shirt Wall: a wall of printed shirts, one of them "yours". */
export function ShirtWallArt() {
  const shirts = Array.from({ length: 8 }, (_, i) => i);
  const mine = 5;
  const rows = [78, 222];
  return (
    <svg viewBox="0 0 520 416" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label="איור קונספט: קיר של חולצות עם תמונות האורחים, אחת מהן מסומנת">
      <rect width="520" height="416" fill="#171512" />
      {rows.map((y) => (
        <line key={y} x1="20" x2="500" y1={y} y2={y} stroke="#6B645A" strokeWidth="1" strokeDasharray="4 5" />
      ))}
      {shirts.map((i) => {
        const x = 40 + (i % 4) * 118;
        const y = rows[Math.floor(i / 4)];
        const isMine = i === mine;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <g className="sw-shirt" style={{ animationDelay: `${(i % 5) * 0.45}s` }}>
              <circle cx="40" cy="0" r="2.5" fill="#A39B8E" />
              <path
                d="M24 8 L12 13 L4 26 L14 32 L20 28 L20 96 L60 96 L60 28 L66 32 L76 26 L68 13 L56 8 C52 16 46 19 40 19 C34 19 28 16 24 8 Z"
                transform="translate(-10 0) scale(1.25 1)"
                fill={isMine ? "#F1ECE3" : "#24211D"}
                stroke={isMine ? "#C41E3A" : "#6B645A"}
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
              />
              {/* printed photo: head + shoulders */}
              <rect x="22" y="34" width="36" height="44" rx="4" fill={isMine ? "#F4EEE6" : "#2c2823"} />
              <circle cx="40" cy="50" r="8" fill={isMine ? "#C41E3A" : "#4a443c"} />
              <path d="M27 78 C27 66 53 66 53 78 Z" fill={isMine ? "#C41E3A" : "#4a443c"} />
            </g>
          </g>
        );
      })}
      <g transform="translate(128 340)">
        <path d="M70 0 L70 -18" stroke="#C41E3A" strokeWidth="1.5" strokeDasharray="3 3" />
        <rect x="18" y="0" width="104" height="32" rx="16" fill="#C41E3A" />
        <text x="70" y="21" textAnchor="middle" fontSize="15" fill="#0E0D0B" fontFamily="var(--font-sans)">זו שלי!</text>
      </g>
    </svg>
  );
}
