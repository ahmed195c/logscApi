import axios from "axios";

// Base URL for the API
const API_BASE_URL = "http://192.168.50.6:8000/api";

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add these options for better cross-origin handling
  withCredentials: false,
  timeout: 15000, // 15 seconds timeout
});

/**
 * Fetches all logs from the API
 * @returns {Promise} Promise that resolves to the logs data
 */
export const fetchLogs = async () => {
  try {
    console.log("Making API request to:", API_BASE_URL + "/logs/");
    const response = await apiClient.get("/logs/");
    console.log("API response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
};

/**
 * Fetches a single log by ID
 * @param {string|number} id - The ID of the log to fetch
 * @returns {Promise} Promise that resolves to the log data
 */
export const fetchLogById = async (id) => {
  try {
    const response = await apiClient.get(`/logs/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching log with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new log entry
 * @param {Object} logData - The log data to create
 * @returns {Promise} Promise that resolves to the created log
 */
export const createLog = async (logData) => {
  try {
    const response = await apiClient.post("/logs/", logData);
    return response.data;
  } catch (error) {
    console.error("Error creating log:", error);
    throw error;
  }
};

/**
 * Updates an existing log entry
 * @param {string|number} id - The ID of the log to update
 * @param {Object} logData - The updated log data
 * @returns {Promise} Promise that resolves to the updated log
 */
export const updateLog = async (id, logData) => {
  try {
    const response = await apiClient.put(`/logs/${id}/`, logData);
    return response.data;
  } catch (error) {
    console.error(`Error updating log with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a log entry
 * @param {string|number} id - The ID of the log to delete
 * @returns {Promise} Promise that resolves when the log is deleted
 */
export const deleteLog = async (id) => {
  try {
    await apiClient.delete(`/logs/${id}/`);
    return true;
  } catch (error) {
    console.error(`Error deleting log with ID ${id}:`, error);
    throw error;
  }
};

export default {
  fetchLogs,
  fetchLogById,
  createLog,
  updateLog,
  deleteLog,
};
