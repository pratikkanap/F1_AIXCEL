import axios from "axios";
import { withCache } from "./cache";


// =========================================================
// API CONFIGURATION
// =========================================================
//
// LOCAL DEVELOPMENT:
// React/Vite  -> http://127.0.0.1:8000
//
// DEPLOYED:
// Vercel      -> VITE_API_URL
//                    |
//                    v
//                  Render
//
// This prevents a local .env value from accidentally
// sending localhost requests to the deployed backend.
// =========================================================

const API_URL = import.meta.env.DEV
  ? "http://127.0.0.1:8000"
  : import.meta.env.VITE_API_URL;


// Safety check for production
if (!API_URL) {
  throw new Error(
    "VITE_API_URL is not configured for the deployed frontend."
  );
}


// Remove trailing slash if someone enters:
// https://example.onrender.com/
// instead of:
// https://example.onrender.com
const NORMALIZED_API_URL = API_URL.replace(/\/+$/, "");


console.log("=================================");
console.log("F1 API Configuration");
console.log("Environment:", import.meta.env.DEV ? "LOCAL" : "DEPLOYED");
console.log("Frontend URL:", window.location.origin);
console.log("Backend URL:", NORMALIZED_API_URL);
console.log("=================================");


// =========================================================
// API KEY
// =========================================================
//
// Keep this ONLY if your FastAPI backend actually expects
// an X-API-Key header.
//
// IMPORTANT:
// If this variable is your Grok/xAI secret key, DO NOT put
// it in VITE_API_KEY. Grok/xAI secrets must remain on the
// FastAPI/Render backend.
//
// If X-API-Key is an application-level key used by your own
// FastAPI backend, the optional code below can remain.
// =========================================================

const API_KEY =
  import.meta.env.VITE_API_KEY || "";


// =========================================================
// AXIOS CLIENT
// =========================================================

const apiClient = axios.create({
  baseURL: NORMALIZED_API_URL,

  timeout: 15000,

  headers: {
    "Content-Type": "application/json",

    ...(API_KEY
      ? {
          "X-API-Key": API_KEY,
        }
      : {}),
  },
});


// =========================================================
// RETRY LOGIC
// =========================================================

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 800;


const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));


apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const config = error.config;

    if (!config) {
      return Promise.reject(error);
    }


    config._retryCount =
      config._retryCount || 0;


    const isRetryable =
      !error.response ||
      error.code === "ECONNABORTED" ||
      error.code === "ERR_NETWORK" ||
      (error.response.status >= 500 &&
        error.response.status < 600);


    if (
      isRetryable &&
      config._retryCount < MAX_RETRIES
    ) {
      config._retryCount += 1;


      const delay =
        RETRY_DELAY_MS *
        config._retryCount;


      await sleep(delay);


      return apiClient(config);
    }


    return Promise.reject(error);
  }
);


// =========================================================
// BACKEND WAKE-UP / HEALTH CHECK
// =========================================================
//
// On Render, this helps wake the sleeping backend.
//
// On localhost, it simply checks whether FastAPI is running.
//
// It does NOT prevent the application from loading if the
// backend is unavailable.
// =========================================================

export const wakeBackend = async () => {
  try {
    const response =
      await apiClient.get("/health", {
        timeout: 60000,
      });


    console.log(
      "Backend health:",
      response.data
    );


    return response.data;

  } catch (error) {

    console.warn(
      "Backend wake-up failed:",
      error.message
    );


    return null;
  }
};


// =========================================================
// SESSION RESULTS
// =========================================================

export const getSessionResults = async (
  year,
  gp,
  sessionType
) => {

  return withCache(
    `results:${year}:${gp}:${sessionType}`,

    async () => {

      const response =
        await apiClient.get(
          `/sessions/${year}/${gp}/${sessionType}/results`
        );


      return response.data;
    }
  );
};


// =========================================================
// EVENT SCHEDULE
// =========================================================

export const getEventSchedule = async (
  year
) => {

  return withCache(
    `schedule:${year}`,

    async () => {

      const response =
        await apiClient.get(
          `/sessions/${year}/events`
        );


      return response.data;
    }
  );
};


// =========================================================
// CHAT
// =========================================================

export const sendChatMessage = async (
  message,
  history
) => {

  const response =
    await apiClient.post(
      "/chat",

      {
        message,
        history,
      },

      {
        timeout: 60000,
      }
    );


  return response.data;
};


// =========================================================
// DRIVER STANDINGS
// =========================================================

export const getDriverStandings = async (
  year
) => {

  return withCache(
    `driver-standings:${year}`,

    async () => {

      const response =
        await apiClient.get(
          `/standings/${year}/drivers`
        );


      return response.data;
    }
  );
};


// =========================================================
// CONSTRUCTOR STANDINGS
// =========================================================

export const getConstructorStandings =
  async (year) => {

    return withCache(
      `constructor-standings:${year}`,

      async () => {

        const response =
          await apiClient.get(
            `/standings/${year}/constructors`
          );


        return response.data;
      }
    );
  };


// =========================================================
// TRACK MAP
// =========================================================

export const getTrackMap = async (
  year,
  gp,
  sessionType
) => {

  return withCache(
    `trackmap:${year}:${gp}:${sessionType}`,

    async () => {

      const response =
        await apiClient.get(
          `/circuit/${year}/${gp}/${sessionType}/track-map`,

          {
            timeout: 60000,
          }
        );


      return response.data;
    }
  );
};


// =========================================================
// RACE SUMMARY
// =========================================================

export const getRaceSummary = async (
  year,
  gp,
  sessionType
) => {

  return withCache(
    `summary:${year}:${gp}:${sessionType}`,

    async () => {

      const response =
        await apiClient.get(
          `/summary/${year}/${gp}/${sessionType}`,

          {
            timeout: 60000,
          }
        );


      return response.data;
    }
  );
};


// =========================================================
// PERSON IMAGE
// =========================================================

export const getPersonImage = async (
  name
) => {

  return withCache(
    `person-image:${name}`,

    async () => {

      const response =
        await apiClient.get(
          "/media/person-image",

          {
            params: {
              name,
            },
          }
        );


      return response.data;
    }
  );
};


// =========================================================
// PAGE IMAGE
// =========================================================

export const getPageImage = async (
  title
) => {

  return withCache(
    `page-image:${title}`,

    async () => {

      const response =
        await apiClient.get(
          "/media/page-image",

          {
            params: {
              title,
            },
          }
        );


      return response.data;
    }
  );
};


// =========================================================
// SESSION DRIVERS
// =========================================================

export const getSessionDrivers = async (
  year,
  gp,
  sessionType
) => {

  return withCache(
    `session-drivers:${year}:${gp}:${sessionType}`,

    async () => {

      const response =
        await apiClient.get(
          `/telemetry/${year}/${gp}/${sessionType}/drivers`,

          {
            timeout: 60000,
          }
        );


      return response.data;
    }
  );
};


// =========================================================
// TELEMETRY COMPARISON
// =========================================================

export const getTelemetryComparison =
  async (
    year,
    gp,
    sessionType,
    driver1,
    driver2
  ) => {

    return withCache(
      `telemetry:${year}:${gp}:${sessionType}:${driver1}:${driver2}`,

      async () => {

        const response =
          await apiClient.get(
            `/telemetry/${year}/${gp}/${sessionType}/compare`,

            {
              params: {
                driver1,
                driver2,
              },

              timeout: 60000,
            }
          );


        return response.data;
      }
    );
  };


// =========================================================
// COACHING FEEDBACK
// =========================================================

export const getCoachingFeedback =
  async (
    year,
    gp,
    sessionType,
    driver,
    referenceDriver
  ) => {

    return withCache(
      `coach:${year}:${gp}:${sessionType}:${driver}:${referenceDriver}`,

      async () => {

        const response =
          await apiClient.get(
            `/coach/${year}/${gp}/${sessionType}`,

            {
              params: {
                driver,
                reference_driver:
                  referenceDriver,
              },

              timeout: 60000,
            }
          );


        return response.data;
      }
    );
  };


// =========================================================
// PERSON BIO
// =========================================================

export const getPersonBio = async (
  name
) => {

  return withCache(
    `person-bio:${name}`,

    async () => {

      const response =
        await apiClient.get(
          "/media/person-bio",

          {
            params: {
              name,
            },
          }
        );


      return response.data;
    }
  );
};


// =========================================================
// DEFAULT CLIENT
// =========================================================

export default apiClient;