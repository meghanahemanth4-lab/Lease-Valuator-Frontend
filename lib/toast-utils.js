import { toast } from "sonner";

// Success notification
export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 4000,
    position: "top-right",
  });
};

// Error notification
export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 5000,
    position: "top-right",
  });
};

// Warning notification
export const showWarningToast = (message) => {
  toast.warning(message, {
    duration: 4000,
    position: "top-right",
  });
};

// Info notification
export const showInfoToast = (message) => {
  toast.info(message, {
    duration: 3000,
    position: "top-right",
  });
};

// Loading notification
export const showLoadingToast = (message = "Loading...") => {
  return toast.loading(message, {
    position: "top-right",
  });
};

// Dismiss toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// API error handler
export const handleApiError = (error, defaultMessage = "An error occurred") => {
  let message = defaultMessage;
  
  if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.response?.data?.error) {
    message = error.response.data.error;
  } else if (error?.message) {
    message = error.message;
  } else if (error?.error?.message) {
    message = error.error.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  console.error("API Error:", error);
  showErrorToast(message);
  return message;
};

// API success handler
export const handleApiSuccess = (message = "Operation completed successfully") => {
  showSuccessToast(message);
};

// Enhanced error handler for different types of errors
export const handleDetailedError = (error, context = "") => {
  let message = "An unexpected error occurred";
  
  if (error?.response?.data) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        message = data.message || "Bad request. Please check your input.";
        break;
      case 401:
        message = "Authentication required. Please log in again.";
        break;
      case 403:
        message = "Access denied. You don't have permission to perform this action.";
        break;
      case 404:
        message = "The requested resource was not found.";
        break;
      case 409:
        message = data.message || "Conflict. The resource already exists.";
        break;
      case 422:
        message = data.message || "Validation failed. Please check your input.";
        break;
      case 500:
        message = "Server error. Please try again later.";
        break;
      default:
        message = data.message || `Error ${status}: ${data.error || 'Unknown error'}`;
    }
  } else if (error?.message) {
    message = error.message;
  }
  
  if (context) {
    message = `${context}: ${message}`;
  }
  
  showErrorToast(message);
  return message;
};
