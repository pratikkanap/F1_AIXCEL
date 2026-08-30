import { useState, useRef, useEffect } from "react";

import "./Dropdown.css";

function Dropdown({ label, options, value, onChange, disabled, getLabel, getValue }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resolveLabel = (opt) => (getLabel ? getLabel(opt) : opt.label ?? opt);
  const resolveValue = (opt) => (getValue ? getValue(opt) : opt.value ?? opt);

  const selectedOption = options.find((opt) => resolveValue(opt) === value);
  const displayText = selectedOption ? resolveLabel(selectedOption) : "SELECT";

  const handleSelect = (opt) => {
    onChange(resolveValue(opt));
    setIsOpen(false);
  };

  return (
    <div className="f1-dropdown" ref={ref}>
      {label && <label>{label}</label>}
      <button
        type="button"
        className={`f1-dropdown-trigger ${isOpen ? "open" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span>{disabled ? "LOADING..." : displayText}</span>
        <svg className="f1-dropdown-arrow" width="12" height="8" viewBox="0 0 12 8">
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div className="f1-dropdown-menu">
          {options.map((opt, i) => {
            const optValue = resolveValue(opt);
            return (
              <div
                key={i}
                className={`f1-dropdown-item ${optValue === value ? "selected" : ""}`}
                onClick={() => handleSelect(opt)}
              >
                {resolveLabel(opt)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dropdown;