import { useState } from "react";
import "./EngineInternalDiagram.css";

const engineParts = [
  // =========================================================
  // AIR / INTAKE
  // =========================================================

  {
    id: "air-intake",
    label: "Air Intake",
    description:
      "Air enters the power unit through the intake system and is directed toward the turbocharger compressor.",
    x: 50,
    y: 8,
  },

  {
    id: "compressor",
    label: "Compressor",
    description:
      "The compressor increases the pressure of incoming air before it enters the engine.",
    x: 35,
    y: 20,
  },

  {
    id: "intercooler",
    label: "Charge Air Cooling",
    description:
      "Compressed intake air is cooled before entering the engine to improve air density and combustion efficiency.",
    x: 22,
    y: 31,
  },

  {
    id: "intake-plenum",
    label: "Intake Plenum",
    description:
      "Distributes pressurised intake air to the six cylinders of the V6 engine.",
    x: 50,
    y: 31,
  },

  {
    id: "throttle",
    label: "Throttle System",
    description:
      "Controls the amount of air entering the engine according to driver demand and power-unit control.",
    x: 66,
    y: 27,
  },

  // =========================================================
  // COMBUSTION
  // =========================================================

  {
    id: "fuel-injection",
    label: "Fuel Injection",
    description:
      "Precisely delivers fuel into the combustion system for the engine's combustion process.",
    x: 51,
    y: 42,
  },

  {
    id: "combustion-chambers",
    label: "Combustion Chambers",
    description:
      "Six combustion chambers burn the air-fuel mixture and create the pressure that drives the pistons.",
    x: 50,
    y: 51,
  },

  {
    id: "pistons",
    label: "Pistons",
    description:
      "Pistons move inside the cylinders and convert combustion pressure into mechanical movement.",
    x: 50,
    y: 62,
  },

  {
    id: "connecting-rods",
    label: "Connecting Rods",
    description:
      "Connect the pistons to the crankshaft and transfer their movement into rotational motion.",
    x: 50,
    y: 70,
  },

  {
    id: "crankshaft",
    label: "Crankshaft",
    description:
      "Converts piston movement into rotational mechanical power.",
    x: 50,
    y: 79,
  },

  // =========================================================
  // VALVE TRAIN
  // =========================================================

  {
    id: "camshafts",
    label: "Camshafts",
    description:
      "Control the opening and closing of the engine's intake and exhaust valves.",
    x: 35,
    y: 47,
  },

  {
    id: "intake-valves",
    label: "Intake Valves",
    description:
      "Allow compressed intake air to enter the combustion chambers.",
    x: 39,
    y: 42,
  },

  {
    id: "exhaust-valves",
    label: "Exhaust Valves",
    description:
      "Allow combustion gases to leave the cylinders and enter the exhaust system.",
    x: 61,
    y: 42,
  },

  {
    id: "spark-plugs",
    label: "Spark Plugs",
    description:
      "Ignite the compressed air-fuel mixture inside the combustion chambers.",
    x: 55,
    y: 48,
  },

  // =========================================================
  // EXHAUST / TURBO
  // =========================================================

  {
    id: "exhaust-manifold",
    label: "Exhaust Manifold",
    description:
      "Collects exhaust gases from the cylinders and directs them toward the turbocharger turbine.",
    x: 68,
    y: 50,
  },

  {
    id: "turbine",
    label: "Turbocharger Turbine",
    description:
      "Uses energy from exhaust gases to drive the turbocharger compressor.",
    x: 78,
    y: 28,
  },

  {
    id: "turbo-shaft",
    label: "Turbo Shaft",
    description:
      "Connects the compressor and turbine, allowing exhaust energy to drive the compressor.",
    x: 58,
    y: 23,
  },

  {
    id: "exhaust-system",
    label: "Exhaust System",
    description:
      "Carries combustion gases away from the turbocharger and out of the car.",
    x: 85,
    y: 43,
  },

  // =========================================================
  // 2026 HYBRID SYSTEM
  // =========================================================

  {
    id: "mgu-k",
    label: "MGU-K",
    description:
      "The 2026 Motor Generator Unit-Kinetic recovers kinetic energy during braking and can provide electrical power for propulsion.",
    x: 69,
    y: 77,
  },

  {
    id: "energy-store",
    label: "Energy Store",
    description:
      "Stores electrical energy recovered by the MGU-K and supplies electrical energy when required.",
    x: 82,
    y: 70,
  },

  {
    id: "control-electronics",
    label: "Power Unit Control Electronics",
    description:
      "Controls and monitors the internal combustion engine and electrical power-unit systems.",
    x: 88,
    y: 60,
  },

  // =========================================================
  // SUPPORT SYSTEMS
  // =========================================================

  {
    id: "oil-system",
    label: "Oil System",
    description:
      "Lubricates and cools critical engine components while maintaining oil pressure.",
    x: 24,
    y: 67,
  },

  {
    id: "cooling-system",
    label: "Engine Cooling",
    description:
      "Removes heat from the engine and keeps the power unit within its operating temperature range.",
    x: 17,
    y: 55,
  },

  {
    id: "engine-block",
    label: "Engine Block",
    description:
      "The main structural body of the V6 engine containing the cylinders and supporting major internal components.",
    x: 31,
    y: 57,
  },

  {
    id: "crankcase",
    label: "Crankcase",
    description:
      "Supports and encloses the crankshaft and lower engine components.",
    x: 40,
    y: 86,
  },
];

function EngineInternalDiagram() {
  const [activePart, setActivePart] = useState(null);

  const active = engineParts.find(
    (part) => part.id === activePart
  );

  return (
    <section className="engine-section">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="engine-section-header">

        <div>
          <span className="engine-eyebrow">
            2026 // POWER UNIT
          </span>

          <h2>
            INTERNAL ENGINE ARCHITECTURE
          </h2>

          <p>
            Simplified technical view of the 2026 F1
            turbo-hybrid power unit.
          </p>
        </div>

        <div className="engine-status">
          <span></span>
          POWER UNIT ONLINE
        </div>

      </div>


      {/* =====================================================
          ENGINE DIAGRAM
      ====================================================== */}

      <div className="engine-diagram-stage">

        <div className="engine-corner engine-corner-tl"></div>
        <div className="engine-corner engine-corner-tr"></div>
        <div className="engine-corner engine-corner-bl"></div>
        <div className="engine-corner engine-corner-br"></div>


        <svg
          viewBox="0 0 1000 430"
          className="engine-diagram-svg"
          preserveAspectRatio="xMidYMid meet"
        >

          {/* =================================================
              GRID
          ================================================= */}

          <defs>

            <pattern
              id="engineGrid"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="1"
                cy="1"
                r="0.8"
                className="engine-grid-dot"
              />
            </pattern>

          </defs>

          <rect
            x="0"
            y="0"
            width="1000"
            height="430"
            fill="url(#engineGrid)"
          />


          {/* =================================================
              TECHNICAL FRAME
          ================================================= */}

          <g className="engine-frame">

            <path d="M35 35 H210" />
            <path d="M235 35 H765" />
            <path d="M790 35 H965" />

            <path d="M35 35 V60" />
            <path d="M965 35 V60" />

            <path d="M35 395 V370" />
            <path d="M965 395 V370" />

            <path d="M35 395 H210" />
            <path d="M235 395 H765" />
            <path d="M790 395 H965" />

          </g>


          {/* =================================================
              MAIN RUNNING ENERGY LINE
          ================================================= */}

          <g className="engine-energy-circuit">

            <path
              d="
                M90 105
                H210
                V135
                H310
                V165
                H410
                V195
                H510
                V225
                H610
                V255
                H710
                V285
                H810
                V315
                H910
              "
              className="engine-running-line"
            />

            {/* AIR */}

            <path
              d="
                M500 70
                V100
                H360
                V145
                H270
                V190
              "
              className="engine-running-line air-line"
            />

            {/* EXHAUST */}

            <path
              d="
                M630 300
                H735
                V265
                H830
                V220
                H925
              "
              className="engine-running-line exhaust-line"
            />

            {/* ELECTRICAL */}

            <path
              d="
                M620 350
                H705
                V380
                H835
              "
              className="engine-running-line electrical-line"
            />

          </g>


          {/* =================================================
              AIR INTAKE
          ================================================= */}

          <path
            d="
              M455 65
              H545
              L525 95
              H475
              Z
            "
            className="engine-component intake"
          />

          <text
            x="500"
            y="57"
            className="engine-label"
            textAnchor="middle"
          >
            AIR INTAKE
          </text>


          {/* =================================================
              TURBOCHARGER
          ================================================= */}

          <g className="turbo-system">

            {/* Compressor */}

            <circle
              cx="350"
              cy="145"
              r="45"
              className="turbo-housing"
            />

            <circle
              cx="350"
              cy="145"
              r="18"
              className="turbo-core"
            />

            <path
              d="
                M335 130
                L365 160

                M365 130
                L335 160
              "
              className="turbo-detail"
            />


            {/* Turbine */}

            <circle
              cx="750"
              cy="145"
              r="45"
              className="turbo-housing"
            />

            <circle
              cx="750"
              cy="145"
              r="18"
              className="turbo-core"
            />

            <path
              d="
                M735 130
                L765 160

                M765 130
                L735 160
              "
              className="turbo-detail"
            />


            {/* Shaft */}

            <line
              x1="395"
              y1="145"
              x2="705"
              y2="145"
              className="turbo-shaft"
            />

          </g>


          {/* =================================================
              V6 ENGINE BLOCK
          ================================================= */}

          <path
            d="
              M320 205

              L395 170
              L500 190
              L605 170
              L680 205

              L650 350

              L350 350

              Z
            "
            className="engine-block-shape"
          />


          {/* =================================================
              LEFT CYLINDER BANK
          ================================================= */}

          <g className="cylinder-bank">

            <path
              d="
                M345 215
                L405 185
                L450 225
                L420 325
                L350 325
                Z
              "
              className="cylinder-head"
            />

            <circle
              cx="375"
              cy="235"
              r="17"
              className="cylinder"
            />

            <circle
              cx="385"
              cy="275"
              r="17"
              className="cylinder"
            />

            <circle
              cx="395"
              cy="315"
              r="17"
              className="cylinder"
            />

          </g>


          {/* =================================================
              RIGHT CYLINDER BANK
          ================================================= */}

          <g className="cylinder-bank">

            <path
              d="
                M595 185
                L655 215
                L650 325
                L580 325
                L550 225
                Z
              "
              className="cylinder-head"
            />

            <circle
              cx="625"
              cy="235"
              r="17"
              className="cylinder"
            />

            <circle
              cx="615"
              cy="275"
              r="17"
              className="cylinder"
            />

            <circle
              cx="605"
              cy="315"
              r="17"
              className="cylinder"
            />

          </g>


          {/* =================================================
              COMBUSTION
          ================================================= */}

          <g className="combustion-zone">

            <path
              d="M363 228 L375 216 L387 228"
              className="combustion"
            />

            <path
              d="M373 268 L385 256 L397 268"
              className="combustion"
            />

            <path
              d="M383 308 L395 296 L407 308"
              className="combustion"
            />

            <path
              d="M613 228 L625 216 L637 228"
              className="combustion"
            />

            <path
              d="M603 268 L615 256 L627 268"
              className="combustion"
            />

            <path
              d="M593 308 L605 296 L617 308"
              className="combustion"
            />

          </g>


          {/* =================================================
              PISTONS
          ================================================= */}

          <g className="piston-group">

            <rect
              x="365"
              y="235"
              width="20"
              height="25"
              className="piston"
            />

            <rect
              x="375"
              y="275"
              width="20"
              height="25"
              className="piston"
            />

            <rect
              x="385"
              y="315"
              width="20"
              height="25"
              className="piston"
            />

            <rect
              x="615"
              y="235"
              width="20"
              height="25"
              className="piston"
            />

            <rect
              x="605"
              y="275"
              width="20"
              height="25"
              className="piston"
            />

            <rect
              x="595"
              y="315"
              width="20"
              height="25"
              className="piston"
            />

          </g>


          {/* =================================================
              CONNECTING RODS
          ================================================= */}

          <g className="connecting-rods">

            <line
              x1="375"
              y1="260"
              x2="475"
              y2="350"
            />

            <line
              x1="385"
              y1="300"
              x2="500"
              y2="350"
            />

            <line
              x1="395"
              y1="340"
              x2="525"
              y2="350"
            />

            <line
              x1="625"
              y1="260"
              x2="525"
              y2="350"
            />

            <line
              x1="615"
              y1="300"
              x2="500"
              y2="350"
            />

            <line
              x1="605"
              y1="340"
              x2="475"
              y2="350"
            />

          </g>


          {/* =================================================
              CRANKSHAFT
          ================================================= */}

          <line
            x1="350"
            y1="350"
            x2="650"
            y2="350"
            className="crankshaft"
          />

          <circle
            cx="430"
            cy="350"
            r="14"
            className="crank-journal"
          />

          <circle
            cx="500"
            cy="350"
            r="14"
            className="crank-journal"
          />

          <circle
            cx="570"
            cy="350"
            r="14"
            className="crank-journal"
          />


          {/* =================================================
              CAMSHAFTS
          ================================================= */}

          <line
            x1="350"
            y1="205"
            x2="410"
            y2="180"
            className="camshaft"
          />

          <line
            x1="590"
            y1="180"
            x2="650"
            y2="205"
            className="camshaft"
          />


          {/* =================================================
              VALVES
          ================================================= */}

          <g className="valves">

            <line
              x1="370"
              y1="215"
              x2="360"
              y2="230"
            />

            <line
              x1="390"
              y1="215"
              x2="400"
              y2="230"
            />

            <line
              x1="610"
              y1="215"
              x2="600"
              y2="230"
            />

            <line
              x1="630"
              y1="215"
              x2="640"
              y2="230"
            />

          </g>


          {/* =================================================
              FUEL INJECTORS
          ================================================= */}

          <g className="injectors">

            <circle cx="380" cy="225" r="3" />
            <circle cx="390" cy="265" r="3" />
            <circle cx="400" cy="305" r="3" />

            <circle cx="620" cy="225" r="3" />
            <circle cx="610" cy="265" r="3" />
            <circle cx="600" cy="305" r="3" />

          </g>


          {/* =================================================
              EXHAUST MANIFOLD
          ================================================= */}

          <path
            d="
              M405 235
              C445 215 470 195 500 190

              M405 275
              C450 240 475 210 500 190

              M405 315
              C450 275 480 220 500 190

              M595 235
              C555 215 530 195 500 190

              M595 275
              C550 240 525 210 500 190

              M595 315
              C550 275 520 220 500 190
            "
            className="exhaust-manifold"
          />


          {/* =================================================
              MGU-K
          ================================================= */}

          <rect
            x="645"
            y="355"
            width="105"
            height="40"
            rx="3"
            className="mgu-k-box"
          />

          <text
            x="697"
            y="380"
            className="component-label"
            textAnchor="middle"
          >
            MGU-K
          </text>


          {/* =================================================
              ENERGY STORE
          ================================================= */}

          <rect
            x="805"
            y="350"
            width="120"
            height="45"
            className="energy-store-box"
          />

          <path
            d="M820 365 H910"
            className="battery-line"
          />

          <path
            d="M820 377 H900"
            className="battery-line"
          />

          <text
            x="865"
            y="390"
            className="component-label"
            textAnchor="middle"
          >
            ENERGY STORE
          </text>


          {/* =================================================
              CONTROL ELECTRONICS
          ================================================= */}

          <rect
            x="820"
            y="300"
            width="110"
            height="35"
            className="electronics-box"
          />

          <text
            x="875"
            y="322"
            className="component-label"
            textAnchor="middle"
          >
            PU CONTROL
          </text>


          {/* =================================================
              LABELS
          ================================================= */}

          <g className="engine-annotations">

            <text x="100" y="125">
              AIR
            </text>

            <text x="150" y="210">
              CHARGE AIR
            </text>

            <text x="90" y="320">
              OIL
            </text>

            <text x="405" y="380">
              CRANKSHAFT
            </text>

            <text x="650" y="420">
              ERS-K
            </text>

          </g>


          {/* =================================================
              HOTSPOTS
          ================================================= */}

          {engineParts.map((part) => {

            const cx = (part.x / 100) * 1000;
            const cy = (part.y / 100) * 430;

            return (
              <g
                key={part.id}
                transform={`translate(${cx}, ${cy})`}
                className={`engine-hotspot ${
                  activePart === part.id
                    ? "active"
                    : ""
                }`}
                onMouseEnter={() =>
                  setActivePart(part.id)
                }
                onMouseLeave={() =>
                  setActivePart(null)
                }
              >

                <circle
                  r="12"
                  className="engine-hotspot-ring"
                />

                <circle
                  r="4"
                  className="engine-hotspot-dot"
                />

                <circle
                  r="22"
                  className="engine-hotspot-hit"
                />

              </g>
            );
          })}

        </svg>


        {/* =====================================================
            BOTTOM HUD
        ====================================================== */}

        <div className="engine-bottom-hud">

          <span>
            <b>01</b> AIR
          </span>

          <span>
            <b>02</b> COMBUSTION
          </span>

          <span>
            <b>03</b> CRANK
          </span>

          <span>
            <b>04</b> ERS-K
          </span>

        </div>

      </div>


      {/* =====================================================
          INFORMATION PANEL
      ====================================================== */}

      <div
        className={`engine-info-panel ${
          active ? "visible" : ""
        }`}
      >

        {active ? (
          <>
            <div className="engine-info-number">

              {String(
                engineParts.findIndex(
                  (part) => part.id === active.id
                ) + 1
              ).padStart(2, "0")}

            </div>

            <div>

              <span className="engine-info-title">
                {active.label.toUpperCase()}
              </span>

              <p>
                {active.description}
              </p>

            </div>
          </>
        ) : (
          <div>

            <span className="engine-info-title">
              INTERNAL POWER UNIT
            </span>

            <p>
              Hover over a marker to explore the
              internal architecture of the 2026 F1
              power unit.
            </p>

          </div>
        )}

      </div>

    </section>
  );
}

export default EngineInternalDiagram;