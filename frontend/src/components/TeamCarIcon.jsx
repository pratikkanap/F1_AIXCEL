function TeamCarIcon({ teamName, color }) {
  return (
    <svg viewBox="0 0 100 40" className="team-car-icon" style={{ color }}>
      <path
        d="M5 30 L15 30 C17 22 25 16 35 16 L55 16 C62 16 68 20 72 26 L90 26 C93 26 95 28 95 30 L95 30 L5 30 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="22" cy="31" r="6" fill="#0A0A0A" stroke="currentColor" strokeWidth="2" />
      <circle cx="78" cy="31" r="6" fill="#0A0A0A" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default TeamCarIcon;