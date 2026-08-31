import axios from "axios";
import { withCache } from "./cache";


// =========================================================
// API CONFIGURATION
// =========================================================
//
// LOCAL DESKTOP:
//   http://localhost:5173
//   -> http://127.0.0.1:8000
//
// LOCAL PHONE:
//   http://192.168.1.102:5173
//   -> http://192.168.1.102:8000
//
// DEPLOYED DESKTOP:
//   https://f1-aixcel.vercel.app
//   -> VITE_API_URL / Render
//
// DEPLOYED PHONE:
//   https://f1-aixcel.vercel.app
//   -> VITE_API_URL / Render
// =========================================================


const getApiUrl = () => {

  // -------------------------------------------------------
  // DEPLOYED APPLICATION
  // -------------------------------------------------------
  //
  // Vercel production/preview builds use VITE_API_URL.
  // This prevents the phone from ever trying to use
  // 127.0.0.1 when using the deployed application.
  //
  if (import.meta.env.PROD) {

    const productionUrl =
      import.meta.env.VITE_API_URL;

    if (!productionUrl) {
      console.error(
        "VITE_API_URL is missing in the deployed environment."
      );
    }

    return productionUrl || "";
  }


  // -------------------------------------------------------
  // LOCAL DEVELOPMENT
  // -------------------------------------------------------

  const hostname = window.location.hostname;


  // Local desktop
  //
  // http://localhost:5173
  // http://127.0.0.1:5173
  //
  // Both should use local FastAPI.
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  ) {
    return "http://127.0.0.1:8000";
  }


  // Local phone / another device on LAN
  //
  // Example:
  // http://192.168.1.102:5173
  //
  // Automatically becomes:
  // http://192.168.1.102:8000
  //
  // This means you do NOT need to hard-code your
  // laptop IP address.
  return `http://${hostname}:8000`;
};


const API_URL = getApiUrl();


// =========================================================
// API KEY
// =========================================================
//
// IMPORTANT:
// Do not put your Grok/xAI secret key in the frontend.
//
// This is kept only because your current project already
// supports VITE_API_KEY.
//
// Ideally your Grok/xAI key should remain in FastAPI.
// =========================================================

const API_KEY =
  import.meta.env.VITE_API_KEY || "";


// =========================================================
// DEBUG INFORMATION
// =========================================================

console.log("========================================");
console.log("F1 AIXCEL API CONFIGURATION");
console.log("========================================");

console.log(
  "Environment:",
  import.meta.env.PROD
    ? "DEPLOYED"
    : "LOCAL"
);

console.log(
  "Frontend:",
  window.location.origin
);

console.log(
  "Backend:",
  API_URL
);

console.log("========================================");


// =========================================================
// AXIOS CLIENT
// =========================================================

const apiClient = axios.create({

  baseURL: API_URL,

  timeout: 15000,

  headers: API_KEY
    ? {
        "X-API-Key": API_KEY,
      }
    : {},
});


// =========================================================
// RETRY LOGIC
// =========================================================

const MAX_RETRIES = 2;

const RETRY_DELAY_MS = 800;


const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );


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

      // Network error
      !error.response ||

      // Timeout
      error.code === "ECONNABORTED" ||

      // Server error
      (
        error.response.status >= 500 &&
        error.response.status < 600
      );


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
// BACKEND WAKE-UP
// =========================================================

export const wakeBackend = async () => {

  try {

    const response =
      await apiClient.get(
        "/health",
        {
          timeout: 60000,
        }
      );

    console.log(
      "Backend is online:",
      API_URL
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