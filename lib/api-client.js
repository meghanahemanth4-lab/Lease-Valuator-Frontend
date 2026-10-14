import axios from "axios";
import { handleApiSuccess, showWarningToast } from "./toast-utils";

// Resolve API base URL
const resolvedBaseUrl =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:8080";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: resolvedBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Read-only guard: prevent mutations for specific roles (e.g., ROLE_DEPLOYER)
const isReadOnlyRole = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return false;
    const parsed = JSON.parse(storedUser);
    const roles = Array.isArray(parsed?.roles)
      ? parsed.roles
      : typeof parsed?.role === "string"
      ? [parsed.role]
      : [];
    return roles.includes("ROLE_DEPLOYER");
  } catch (e) {
    return false;
  }
};

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// GET request wrapper
export const get = async (url, config = {}) => {
  try {
    console.log(`Making GET request to: ${apiClient.defaults.baseURL}${url}`);
    const response = await apiClient.get(url, config);
    console.log(`GET response from ${url}:`, response.data);
    return { data: response.data, error: null };
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return {
      data: null,
      error: error.response
        ? {
          status: error.response.status,
          statusText: error.response.statusText,
          message: error.response.data || error.message,
        }
        : error,
    };
  }
};

// POST request wrapper
export const post = async (url, data, config = {}) => {
  try {
    // Block POST for read-only users
    if (isReadOnlyRole()) {
      showWarningToast("You have read-only access. Action not permitted.");
      return {
        data: null,
        error: {
          status: 403,
          statusText: "Forbidden",
          message: "Read-only user is not permitted to perform this action.",
        },
      };
    }
    const response = await apiClient.post(url, data, config);
    // Show success toast similar to older app's success alert
    try {
      const message = response?.data?.message || response?.data?.success || "Operation completed successfully";
      if (message) handleApiSuccess(message);
    } catch (e) {
      // noop: toast is best-effort and should not affect flow
    }
    return {
      data: response.data,
      error: null,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    console.error(`Error posting data to ${url}:`, error);
    return {
      data: null,
      error: error.response
        ? {
          status: error.response.status,
          statusText: error.response.statusText,
          message: error.response.data?.message || error.response.data || error.message,
          data: error.response.data,
        }
        : error,
    };
  }
};

// PUT request wrapper
export const put = async (url, data, config = {}) => {
  try {
    // Block PUT for read-only users
    if (isReadOnlyRole()) {
      showWarningToast("You have read-only access. Action not permitted.");
      return {
        data: null,
        error: {
          status: 403,
          statusText: "Forbidden",
          message: "Read-only user is not permitted to perform this action.",
        },
      };
    }
    const response = await apiClient.put(url, data, config);
    // Show success toast similar to older app's success alert
    try {
      const message = response?.data?.message || response?.data?.success || "Operation completed successfully";
      if (message) handleApiSuccess(message);
    } catch (e) {
      // noop
    }
    return {
      data: response.data,
      error: null,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    console.error(`Error updating data at ${url}:`, error);
    return {
      data: null,
      error: error.response
        ? {
          status: error.response.status,
          statusText: error.response.statusText,
          message: error.response.data?.message || error.response.data || error.message,
          data: error.response.data,
        }
        : error,
    };
  }
};

// DELETE request wrapper
export const del = async (url, config = {}) => {
  try {
    // Block DELETE for read-only users
    if (isReadOnlyRole()) {
      showWarningToast("You have read-only access. Action not permitted.");
      return {
        data: null,
        error: {
          status: 403,
          statusText: "Forbidden",
          message: "Read-only user is not permitted to perform this action.",
        },
      };
    }
    const response = await apiClient.delete(url, config);
    return {
      data: response.data,
      error: null,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    console.error(`Error deleting data at ${url}:`, error);
    return {
      data: null,
      error: error.response
        ? {
          status: error.response.status,
          statusText: error.response.statusText,
          message: error.response.data?.message || error.response.data || error.message,
          data: error.response.data,
        }
        : error,
    };
  }
};

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      const { status, data } = error.response;
      console.error(`Error ${status}:`, data);

      // Handle 401 Unauthorized - redirect to login
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Only redirect if not already on login page
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      } else if (status === 500) {
        console.error("A server error occurred. Please try again later.");
      } else if (status === 404) {
        console.error("The requested resource was not found.");
      } else if (status === 400) {
        console.error(data?.message || "Bad Request");
      }
    } else if (error.request) {
      // No response received
      console.error("No response received:", error.request);
      console.error("Unable to connect to the server. Check your internet connection.");
    } else {
      // Something else caused the error
      console.error("Error in setup:", error.message);
      console.error("An unexpected error occurred. Please try again.");
    }
    return Promise.reject(error);
  }
);

// Export the Axios instance as default
export default apiClient;
