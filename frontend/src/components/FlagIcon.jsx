function FlagIcon({ code, size = 20 }) {
  if (!code) return null;
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      alt={code}
      className="flag-icon"
      style={{ width: size, height: size * 0.75 }}
      loading="lazy"
    />
  );
}

export default FlagIcon;