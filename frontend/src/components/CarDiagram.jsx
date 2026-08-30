import { useState, useEffect } from "react";

import { getPageImage } from "../api/client";

import carPartsData from "../data/carPartsData";

import "./CarDiagram.css";

function CarDiagram() {
  const [activePart, setActivePart] = useState(null);
  const [carPhoto, setCarPhoto] = useState(null);

  const active = carPartsData.find((p) => p.id === activePart);

  useEffect(() => {
    getPageImage("McLaren MCL40")
      .then((data) => {
        if (data.image_url) setCarPhoto(data.image_url);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="car-diagram-wrapper">

      {/* =====================================================
          TECHNICAL HEADER
      ====================================================== */}

      <div className="car-tech-header">

        <div className="car-tech-title">
          <span>F1 // TECHNICAL ANALYSIS</span>
          <strong>CAR INTERNAL ARCHITECTURE</strong>
        </div>

        <div className="car-tech-status">
          <span className="tech-status-dot"></span>
          SYSTEM ONLINE
        </div>

      </div>


      {/* =====================================================
          MAIN DIAGRAM
      ====================================================== */}

      <div className="car-diagram-stage">

        {/* Technical corner brackets */}

        <div className="diagram-corner diagram-corner-tl"></div>
        <div className="diagram-corner diagram-corner-tr"></div>
        <div className="diagram-corner diagram-corner-bl"></div>
        <div className="diagram-corner diagram-corner-br"></div>


        {/* Technical labels */}

        <div className="diagram-tech-label label-front">
          <span>01</span>
          FRONT AERO
        </div>

        <div className="diagram-tech-label label-center">
          <span>02</span>
          DRIVER CELL
        </div>

        <div className="diagram-tech-label label-power">
          <span>03</span>
          POWER UNIT
        </div>

        <div className="diagram-tech-label label-rear">
          <span>04</span>
          REAR AERO
        </div>


        <svg
          viewBox="0 0 1000 320"
          className="car-diagram-svg"
        >

          {/* =================================================
              TECHNICAL BACKGROUND GRID
          ================================================== */}

          <defs>

            <pattern
              id="carTechnicalGrid"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="1"
                cy="1"
                r="0.7"
                className="technical-grid-dot"
              />
            </pattern>

          </defs>

          <rect
            x="0"
            y="0"
            width="1000"
            height="320"
            fill="url(#carTechnicalGrid)"
            className="technical-grid"
          />


          {/* =================================================
              TECHNICAL FRAME
          ================================================== */}

          <g className="technical-frame">

            <path d="M40 42 H180" />
            <path d="M195 42 H350" />
            <path d="M365 42 H635" />
            <path d="M650 42 H805" />
            <path d="M820 42 H960" />

            <path d="M40 42 V68" />
            <path d="M960 42 V68" />

            <path d="M40 290 V264" />
            <path d="M960 290 V264" />

            <path d="M40 290 H180" />
            <path d="M195 290 H350" />
            <path d="M365 290 H635" />
            <path d="M650 290 H805" />
            <path d="M820 290 H960" />

          </g>


          {/* =================================================
              MAIN ORANGE RUNNING CIRCUIT
              This does NOT change the original car.
          ================================================== */}

          <g className="technical-orange-circuit">

            {/* Main perimeter line */}

            <path
              d="
                M45 72
                H165
                V58
                H285
                V72
                H410
                V55
                H590
                V72
                H715
                V55
                H835
                V72
                H955
                V245
                H925
                V275
                H790
                V290
                H650
                V275
                H500
                V290
                H350
                V275
                H210
                V290
                H75
                V245
                H45
                Z
              "
              className="running-orange-line main-running-line"
            />


            {/* Front technical circuit */}

            <path
              d="
                M45 130
                H105
                V115
                H165
                V130
                H225
              "
              className="running-orange-line secondary-running-line"
            />


            {/* Nose / cockpit circuit */}

            <path
              d="
                M180 155
                H260
                V135
                H330
                V115
                H395
              "
              className="running-orange-line secondary-running-line"
            />


            {/* Halo / cockpit circuit */}

            <path
              d="
                M355 95
                H420
                V75
                H485
                V95
                H545
              "
              className="running-orange-line secondary-running-line"
            />


            {/* Sidepod circuit */}

            <path
              d="
                M470 170
                H535
                V150
                H610
                V170
                H675
              "
              className="running-orange-line secondary-running-line"
            />


            {/* Power unit circuit */}

            <path
              d="
                M590 115
                H660
                V95
                H735
                V115
                H805
              "
              className="running-orange-line power-running-line"
            />


            {/* Engine / gearbox circuit */}

            <path
              d="
                M620 200
                H690
                V180
                H760
                V200
                H825
              "
              className="running-orange-line secondary-running-line"
            />


            {/* Floor circuit */}

            <path
              d="
                M250 235
                H330
                V250
                H430
                V235
                H535
                V250
                H650
                V235
                H760
              "
              className="running-orange-line floor-running-line"
            />


            {/* Rear suspension circuit */}

            <path
              d="
                M770 150
                H830
                V135
                H885
                V155
                H945
              "
              className="running-orange-line secondary-running-line"
            />

          </g>


          {/* =================================================
              TECHNICAL ORANGE NODES
          ================================================== */}

          <g className="technical-nodes">

            <circle cx="165" cy="72" r="3" />
            <circle cx="285" cy="72" r="3" />

            <circle cx="410" cy="55" r="3" />
            <circle cx="590" cy="72" r="3" />

            <circle cx="715" cy="55" r="3" />
            <circle cx="835" cy="72" r="3" />

            <circle cx="330" cy="115" r="3" />
            <circle cx="395" cy="115" r="3" />

            <circle cx="535" cy="150" r="3" />
            <circle cx="610" cy="170" r="3" />

            <circle cx="690" cy="180" r="3" />
            <circle cx="760" cy="200" r="3" />

            <circle cx="430" cy="250" r="3" />
            <circle cx="650" cy="235" r="3" />

          </g>


          {/* =================================================
              ORIGINAL CAR DIAGRAM
              NOTHING CHANGED BELOW THIS POINT
          ================================================== */}

          <line
            x1="60"
            y1="280"
            x2="940"
            y2="280"
            className="car-ground-line"
          />

          <g
            className={`car-outline ${
              activePart ? "dimmed" : ""
            }`}
          >

            {/* Front wing */}

            <path
              d="M20 232 L170 232 L170 246 L20 246 Z"
              className={`car-part ${
                activePart === "front-wing"
                  ? "highlight"
                  : ""
              }`}
            />

            <path
              d="M20 210 L32 210 L32 250 L20 250 Z"
              className={`car-part ${
                activePart === "front-wing"
                  ? "highlight"
                  : ""
              }`}
            />

            <path
              d="M158 212 L170 212 L170 248 L158 248 Z"
              className={`car-part ${
                activePart === "front-wing"
                  ? "highlight"
                  : ""
              }`}
            />


            {/* Nose + halo */}

            <path
              d="
                M170 232
                C 230 225, 290 190, 330 150
                C 345 135, 360 120, 395 112
              "
              className={`car-part-line ${
                activePart === "halo"
                  ? "highlight"
                  : ""
              }`}
            />

            <path
              d="
                M395 112
                C 425 100, 460 100, 480 118
                C 470 90, 430 78, 400 90
                C 380 98, 372 106, 395 112
              "
              className={`car-part ${
                activePart === "halo"
                  ? "highlight"
                  : ""
              }`}
            />


            {/* Cockpit to sidepod */}

            <path
              d="
                M395 112
                C 420 130, 440 150, 460 170
                L 610 170
                L 640 190
                L 640 230
                L 470 230
                L 460 170
              "
              className={`car-part ${
                activePart === "sidepod"
                  ? "highlight"
                  : ""
              }`}
            />


            {/* Power unit */}

            <path
              d="
                M610 170
                C 680 155, 750 130, 820 118
              "
              className={`car-part-line ${
                activePart === "power-unit"
                  ? "highlight"
                  : ""
              }`}
            />


            {/* Rear wing */}

            <path
              d="M870 90 L960 90 L960 108 L870 108 Z"
              className={`car-part ${
                activePart === "rear-wing"
                  ? "highlight"
                  : ""
              }`}
            />

            <path
              d="M868 78 L880 78 L880 175 L868 175 Z"
              className={`car-part ${
                activePart === "rear-wing"
                  ? "highlight"
                  : ""
              }`}
            />

            <path
              d="M950 80 L962 80 L962 178 L950 178 Z"
              className={`car-part ${
                activePart === "rear-wing"
                  ? "highlight"
                  : ""
              }`}
            />

            <path
              d="M820 118 L860 95 M840 190 L865 130"
              className={`car-part-line ${
                activePart === "rear-wing"
                  ? "highlight"
                  : ""
              }`}
            />


            {/* Rear body + diffuser */}

            <path
              d="
                M820 118
                L 900 175
                L 900 230
                L 640 230
              "
              className={`car-part ${
                activePart === "diffuser"
                  ? "highlight"
                  : ""
              }`}
            />

            <path
              d="
                M780 230
                L 940 230
                L 900 265
                L 800 265 Z

                M800 240 L860 240
                M810 250 L870 250
              "
              className={`car-part ${
                activePart === "diffuser"
                  ? "highlight"
                  : ""
              }`}
            />


            {/* Wheels */}

            <circle
              cx="160"
              cy="255"
              r="42"
              className={`car-wheel ${
                activePart === "front-wheel"
                  ? "highlight"
                  : ""
              }`}
            />

            <circle
              cx="160"
              cy="255"
              r="18"
              className="car-wheel-hub"
            />

            <circle
              cx="860"
              cy="255"
              r="48"
              className="car-wheel"
            />

            <circle
              cx="860"
              cy="255"
              r="20"
              className="car-wheel-hub"
            />

          </g>


          {/* =================================================
              ORIGINAL HOTSPOTS
          ================================================== */}

          {carPartsData.map((part) => (
            <g
              key={part.id}
              transform={`translate(${
                (part.x / 100) * 1000
              }, ${
                (part.y / 100) * 320
              })`}
              className={`hotspot-group ${
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
                r="14"
                className="hotspot-ring"
              />

              <circle
                r="5"
                className="hotspot-dot"
              />

              {/* Larger invisible mouse target */}

              <circle
                r="22"
                className="hotspot-hit-area"
              />

            </g>
          ))}

        </svg>


        {/* =================================================
            BOTTOM HUD
        ================================================== */}

        <div className="diagram-bottom-hud">

          <span>
            <b>01</b> AERODYNAMICS
          </span>

          <span>
            <b>02</b> DRIVER CELL
          </span>

          <span>
            <b>03</b> POWER UNIT
          </span>

          <span>
            <b>04</b> TRANSMISSION
          </span>

        </div>

      </div>


      {/* =====================================================
          INFORMATION PANEL
      ====================================================== */}

      <div
        className={`car-info-panel ${
          active ? "visible" : ""
        }`}
      >

        {active && (
          <>
            <div className="car-info-index">
              {String(
                carPartsData.findIndex(
                  (p) => p.id === activePart
                ) + 1
              ).padStart(2, "0")}
            </div>

            <div className="car-info-content">

              <span className="car-info-eyebrow">
                {active.label.toUpperCase()}
              </span>

              <p>
                {active.description}
              </p>

            </div>
          </>
        )}

        {!active && (
          <div className="car-info-placeholder">

            <span className="car-info-eyebrow">
              SYSTEM MAP
            </span>

            <p>
              Hover a marker on the car to explore each
              component.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

export default CarDiagram;