function LineOverlayChart({ title, series, yLabel, height = 220 }) {
  const viewW = 1000;
  const viewH = height;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };

  const allX = series.flatMap((s) => s.points.map((p) => p.x));
  const allY = series.flatMap((s) => s.points.map((p) => p.y));
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(0, Math.min(...allY));
  const maxY = Math.max(...allY);

  const plotW = viewW - padding.left - padding.right;
  const plotH = viewH - padding.top - padding.bottom;

  const scaleX = (x) => padding.left + ((x - minX) / (maxX - minX || 1)) * plotW;
  const scaleY = (y) => padding.top + plotH - ((y - minY) / (maxY - minY || 1)) * plotH;

  const buildPath = (points) =>
    points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${scaleX(p.x).toFixed(1)} ${scaleY(p.y).toFixed(1)}`)
      .join(" ");

  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => minY + ((maxY - minY) / yTicks) * i);

  return (
    <div className="telemetry-chart-card">
      <div className="telemetry-chart-header">
        <span className="telemetry-chart-title">{title}</span>
        <div className="telemetry-chart-legend">
          {series.map((s, i) => (
            <span key={i} className="legend-item">
              <span className="legend-dot" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="telemetry-chart-svg">
        {yTickValues.map((v, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={scaleY(v)}
              x2={viewW - padding.right}
              y2={scaleY(v)}
              className="chart-gridline"
            />
            <text x={padding.left - 8} y={scaleY(v) + 3} textAnchor="end" className="chart-axis-label mono">
              {Math.round(v)}
            </text>
          </g>
        ))}

        {series.map((s, i) => (
          <path key={i} d={buildPath(s.points)} fill="none" stroke={s.color} strokeWidth="2" />
        ))}

        <text x={14} y={viewH / 2} textAnchor="middle" className="chart-axis-label mono" transform={`rotate(-90, 14, ${viewH / 2})`}>
          {yLabel}
        </text>
      </svg>
    </div>
  );
}

export default LineOverlayChart;