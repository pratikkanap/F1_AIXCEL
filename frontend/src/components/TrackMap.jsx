function TrackMap({ trackPoints, corners }) {
  if (!trackPoints || trackPoints.length === 0) return null;

  const xs = trackPoints.map((p) => p.X);
  const ys = trackPoints.map((p) => p.Y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const padding = 40;
  const viewW = 800;
  const viewH = 600;
  const scaleX = (viewW - padding * 2) / (maxX - minX);
  const scaleY = (viewH - padding * 2) / (maxY - minY);
  const scale = Math.min(scaleX, scaleY);

  const toSvg = (x, y) => {
    const sx = padding + (x - minX) * scale;
    const sy = viewH - (padding + (y - minY) * scale); // flip Y for correct visual orientation
    return [sx, sy];
  };

  const pathD = trackPoints
    .map((p, i) => {
      const [sx, sy] = toSvg(p.X, p.Y);
      return `${i === 0 ? "M" : "L"} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${viewW} ${viewH}`} className="track-map-svg">
      <path d={pathD} fill="none" stroke="var(--f1-white)" strokeWidth="6" strokeLinejoin="round" />
      <path d={pathD} fill="none" stroke="var(--f1-red)" strokeWidth="2" strokeLinejoin="round" />
      {corners &&
        corners.map((c, i) => {
          const [sx, sy] = toSvg(c.X, c.Y);
          return (
            <g key={i}>
              <circle cx={sx} cy={sy} r="10" fill="var(--f1-black)" stroke="var(--f1-red)" strokeWidth="1.5" />
              <text x={sx} y={sy + 4} textAnchor="middle" fontSize="10" fill="var(--f1-white)" className="mono">
                {c.Number}
              </text>
            </g>
          );
        })}
    </svg>
  );
}

export default TrackMap;