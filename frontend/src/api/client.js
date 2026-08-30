import axios from "axios";
import { withCache } from "./cache";

const API_KEY = import.meta.env.VITE_API_KEY || "";

const apiClient = axios.create({
  baseURL: "https://f1-aixcel.onrender.com",
  timeout: 15000,
  headers: API_KEY ? { "X-API-Key": API_KEY } : {},
});

// ---- Retry logic: short, fast, only for genuinely transient failures ----
const MAX_RETRIES = 2; // was 3 — fewer retries means faster total failure time
const RETRY_DELAY_MS = 800; // was 1500 — shorter backoff

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    config._retryCount = config._retryCount || 0;

    // Only retry on genuinely transient issues — never on 4xx (won't fix itself)
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
      timeout: 40000, // full telemetry loads are genuinely slower — give this one more room
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