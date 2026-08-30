import { useState } from "react";
import learnF1Content from "../data/learnF1Content";

function LearnF1() {
  const [openCategory, setOpenCategory] = useState(null);
  const [openTopic, setOpenTopic] = useState(null);

  return (
    <div className="f1-page">

      <h2 className="f1-section-title">
        LEARN F1 — BEGINNER TO FAN
      </h2>

      <p
        className="predictor-disclaimer"
        style={{ marginBottom: "1.5rem" }}
      >
        A complete guide to understanding the car, teams, FIA rules,
        safety, tyres, strategy and racing.
      </p>

      <div className="learn-categories">

        {learnF1Content.map((category, categoryIndex) => {

          const categoryOpen = openCategory === categoryIndex;

          return (
            <div
              className={`learn-category-card ${
                categoryOpen ? "category-open" : ""
              }`}
              key={category.id}
            >

              {/* CATEGORY HEADER */}
              <button
                className="learn-category-header"
                onClick={() =>
                  setOpenCategory(
                    categoryOpen ? null : categoryIndex
                  )
                }
              >

                <div className="learn-category-icon">
                  {category.icon}
                </div>

                <div className="learn-category-info">
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>

                <svg
                  width="16"
                  height="10"
                  viewBox="0 0 12 8"
                  className={`learn-arrow ${
                    categoryOpen ? "rotate" : ""
                  }`}
                >
                  <path
                    d="M1 1L6 6L11 1"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

              </button>

              {/* CATEGORY CONTENT */}
              {categoryOpen && (
                <div className="learn-category-content">

                  {category.topics.map((topic, topicIndex) => {

                    const topicOpen =
                      openTopic === `${categoryIndex}-${topicIndex}`;

                    return (
                      <div
                        className="learn-topic"
                        key={topicIndex}
                      >

                        <button
                          className={`learn-topic-header ${
                            topicOpen ? "open" : ""
                          }`}
                          onClick={() =>
                            setOpenTopic(
                              topicOpen
                                ? null
                                : `${categoryIndex}-${topicIndex}`
                            )
                          }
                        >

                          <span>{topic.title}</span>

                          <svg
                            width="14"
                            height="9"
                            viewBox="0 0 12 8"
                            className={`learn-topic-arrow ${
                              topicOpen ? "rotate" : ""
                            }`}
                          >
                            <path
                              d="M1 1L6 6L11 1"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>

                        </button>

                        {topicOpen && (
                          <div className="learn-topic-body">
                            {topic.body
                              .split("\n\n")
                              .map((para, i) => (
                                <p key={i}>{para}</p>
                              ))}
                          </div>
                        )}

                      </div>
                    );
                  })}

                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
}

export default LearnF1;