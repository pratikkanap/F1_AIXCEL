import { useState } from "react";

import { Link } from "react-router-dom";

import CarDiagram from "../components/CarDiagram";

import EngineInternalDiagram from "../components/EngineInternalDiagram";

import LearnF1 from "./LearnF1";

function Hero() {

  const [showLearn, setShowLearn] = useState(false);

  const handleLearnClick = () => {
    setShowLearn((previous) => !previous);
  };

  return (
    <div className="hero-viewport">

      <div className="f1-page hero-page">

        {/* =================================================
            HERO HEADING
        ================================================= */}

        <div className="hero-heading">

          <span className="hero-eyebrow">
            F1 TELEMETRY ANALYSIS TOOL
          </span>

          <h1 className="hero-title">
            Explore the machine behind{" "}
            <span className="hero-title-accent">
              EVERY LAP.
            </span>
          </h1>

          <p className="hero-subtitle">
            Hover any marker to break down what each part of a Formula 1 car actually does
            then dive into real telemetry, standings, and race data from the tabs above.
          </p>

          <div className="hero-cta-row">

            <Link
              to="/results"
              className="f1-btn hero-cta"
            >
              VIEW RACE RESULTS
            </Link>

            <button
              type="button"
              className="f1-btn-outline"
              onClick={handleLearnClick}
            >
              {showLearn
                ? "HIDE LEARN F1 GUIDE"
                : "LEARN F1 GUIDE"}
            </button>

          </div>

        </div>


        {/* =================================================
            CAR DIAGRAM
        ================================================= */}

        <CarDiagram />


        {/* =================================================
            ENGINE DIAGRAM
        ================================================= */}

        <EngineInternalDiagram />


        {/* =================================================
            SCROLL DOWN INDICATION
        ================================================= */}

        {showLearn && (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              marginTop: "35px",
              marginBottom: "35px",
              padding: "15px 0",
              boxSizing: "border-box",
            }}
          >

            {/* Animated Arrow */}

            <div
              style={{
                width: "52px",
                height: "52px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",



                fontSize: "34px",
                fontWeight: "900",



                animation:
                  "learnArrowPop 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",

               
              }}
            >
              ↓
            </div>


            {/* Scroll Text */}

            <div
              style={{
                marginTop: "12px",

                color: "#e10600",

                fontSize: "13px",

                fontWeight: "700",

                fontFamily: "monospace",

                letterSpacing: "0.16em",
              }}
            >
              SCROLL DOWN
            </div>


            {/* Small Description */}

            <div
              style={{
                marginTop: "2px",

                color: "rgba(255, 255, 255, 0.4)",

                fontSize: "10px",

                fontFamily: "monospace",

                letterSpacing: "0.1em",
              }}
            >
              LEARN F1 GUIDE BELOW
            </div>

          </div>
        )}


        {/* =================================================
            LEARN F1 GUIDE
        ================================================= */}

        {showLearn && (
          <div
            className="home-learn-section"
          >
            <LearnF1 />
          </div>
        )}

      </div>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer
        style={{
          width: "100%",
          boxSizing: "border-box",

          textAlign: "center",

          padding: "0px 0px",

          marginTop: "35px",

         
          color:
            "rgba(255, 255, 255, 0.6)",

          fontSize: "15px",

          fontWeight: "400",

          fontFamily: "monospace",

          letterSpacing: "0.06em",
        }}
      >
        © 2026 kanappratik@gmail.com
      </footer>


      {/* =================================================
          ARROW POP ANIMATION
          No App.css required
      ================================================= */}

     

    </div>
  );
}

export default Hero;