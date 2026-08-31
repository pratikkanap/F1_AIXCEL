import axios from "axios";
import { withCache } from "./cache";

// IMPORTANT:
// VITE_API_URL should be set in your deployment platform's environment variables
// (Vercel/Netlify/Render static site settings) to:
//   https://f1-aixcel.onrender.com
// Vite bakes this in at BUILD TIME, so after setting/changing it you must trigger
// a fresh build/deploy — restarting the server alone will not pick up the change.
//
// The fallback below now points to your deployed backend instead of localhost,
// so if the env var is ever missing, the app still works instead of silently
// trying to hit 127.0.0.1:8000.
const API_URL = import.meta.env.VITE_API_URL || "https://f1-aixcel.onrender.com";
const API_KEY = import.meta.env.VITE_API_KEY || "";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: API_KEY ? { "X-API-Key": API_KEY } : {},
});

// ---- Retry logic: short, fast, only for genuinely transient failures ----
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 800;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    config._retryCount = config._retryCount || 0;

    const isRetryable =
      !error.response ||
      error.code === "ECONNABORTED" ||
      (error.response.status >= 500 && error.response.status < 600);

    if (isRetryable && config._retryCount < MAX_RETRIES) {
      config._retryCount += 1;
      const delay = RETRY_DELAY_MS * config._retryCount;
      await sleep(delay);
      return apiClient(config);
    }

    return Promise.reject(error);
  }
);

// ---- API functions ----

export const getSessionResults = async (year, gp, sessionType) => {
  return withCache(`results:${year}:${gp}:${sessionType}`, async () => {
    const response = await apiClient.get(`/sessions/${year}/${gp}/${sessionType}/results`);
    return response.data;
  });
};

export const getEventSchedule = async (year) => {
  return withCache(`schedule:${year}`, async () => {
    const response = await apiClient.get(`/sessions/${year}/events`);
    return response.data;
  });
};

export const sendChatMessage = async (message, history) => {
  const response = await apiClient.post("/chat", { message, history }, { timeout: 30000 });
  return response.data;
};

export const getDriverStandings = async (year) => {
  return withCache(`driver-standings:${year}`, async () => {
    const response = await apiClient.get(`/standings/${year}/drivers`);
    return response.data;
  });
};

export const getConstructorStandings = async (year) => {
  return withCache(`constructor-standings:${year}`, async () => {
    const response = await apiClient.get(`/standings/${year}/constructors`);
    return response.data;
  });
};

export const getTrackMap = async (year, gp, sessionType) => {
  return withCache(`trackmap:${year}:${gp}:${sessionType}`, async () => {
    const response = await apiClient.get(`/circuit/${year}/${gp}/${sessionType}/track-map`, {
      timeout: 40000,
    });
    return response.data;
  });
};

export const getRaceSummary = async (year, gp, sessionType) => {
  return withCache(`summary:${year}:${gp}:${sessionType}`, async () => {
    const response = await apiClient.get(`/summary/${year}/${gp}/${sessionType}`, {
      timeout: 30000,
    });
    return response.data;
  });
};

export const getPersonImage = async (name) => {
  return withCache(`person-image:${name}`, async () => {
    const response = await apiClient.get(`/media/person-image`, { params: { name } });
    return response.data;
  });
};

export const getPageImage = async (title) => {
  return withCache(`page-image:${title}`, async () => {
    const response = await apiClient.get(`/media/page-image`, { params: { title } });
    return response.data;
  });
};

export const getSessionDrivers = async (year, gp, sessionType) => {
  return withCache(`session-drivers:${year}:${gp}:${sessionType}`, async () => {
    const response = await apiClient.get(`/telemetry/${year}/${gp}/${sessionType}/drivers`, {
      timeout: 30000,
    });
    return response.data;
  });
};

export const getTelemetryComparison = async (year, gp, sessionType, driver1, driver2) => {
  return withCache(`telemetry:${year}:${gp}:${sessionType}:${driver1}:${driver2}`, async () => {
    const response = await apiClient.get(`/telemetry/${year}/${gp}/${sessionType}/compare`, {
      params: { driver1, driver2 },
      timeout: 40000,
    });
    return response.data;
  });
};

export const getCoachingFeedback = async (year, gp, sessionType, driver, referenceDriver) => {
  return withCache(`coach:${year}:${gp}:${sessionType}:${driver}:${referenceDriver}`, async () => {
    const response = await apiClient.get(`/coach/${year}/${gp}/${sessionType}`, {
      params: { driver, reference_driver: referenceDriver },
      timeout: 40000,
    });
    return response.data;
  });
};

export const getPersonBio = async (name) => {
  return withCache(`person-bio:${name}`, async () => {
    const response = await apiClient.get(`/media/person-bio`, { params: { name } });
    return response.data;
  });
};

export default apiClient;