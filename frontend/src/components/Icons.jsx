// Thin, consistent SVG icon set (24px viewBox, stroke-based)
export const Icon = ({ name, size = 16, className = "", color = "currentColor" }) => {
  const s = { width: size, height: size, display: "inline-block", flexShrink: 0, verticalAlign: "middle" };
  const paths = {
    search: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    analyze: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    github: (
      <svg style={s} className={className} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
    sparkle: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
      </svg>
    ),
    zap: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    list: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
    checkCircle: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    alertTriangle: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    clock: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    user: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    messageCircle: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    gitMerge: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 009 9"/>
      </svg>
    ),
    leaf: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8C8 10 5.9 16.17 3.82 19.34a1 1 0 001.64 1.14 32.11 32.11 0 011.62-1.93C7.63 17.25 10.02 16 12 16c4 0 8-3 8-8H17z"/>
      </svg>
    ),
    link: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    ),
    pin: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 00-1.11-1.79l-1.78-.9A2 2 0 0115 10.76V6a1 1 0 000-2H9a1 1 0 000 2v4.76a2 2 0 01-1.11 1.79l-1.78.9A2 2 0 005 15.24V17z"/>
      </svg>
    ),
    arrowRight: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
      </svg>
    ),
    xCircle: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
    rocket: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/>
        <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
    ),
    bar: (
      <svg style={s} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  };
  return paths[name] || null;
};
