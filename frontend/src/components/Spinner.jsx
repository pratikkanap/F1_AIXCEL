import "./Spinner.css";

function Spinner({ label = "Loading..." }) {
  return (
    <div className="f1-spinner-wrap">
      <div className="f1-spinner" />
      {label && <span className="f1-spinner-label">{label}</span>}
    </div>
  );
}

export default Spinner;