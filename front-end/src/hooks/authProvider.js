import axios from "axios";
import { AUTH_ENDPOINTS, TOKEN_ENDPOINTS } from "../config/config";

/**
 * Handles all authentication requests.
 */
const authProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await axios.post(AUTH_ENDPOINTS.LOGIN, {
        email,
        password,
      });
    
      const { token, user } = response.data;
      
      if (token && user) {
        localStorage.setItem(
          "auth",
          JSON.stringify({ 
            isAuthenticated: true, 
            token,
            user
          })
        );
        
        localStorage.setItem("authTime", Date.now().toString());
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        return Promise.resolve({
          message: `Welcome, ${user.firstName}!`
        });
      }
      
      return Promise.reject({
        message: "Authentication failed"
      });
    } catch (error) {
      console.error("Login error:", error);
      return Promise.reject({
        message: error.response?.data?.message || "Invalid username or password"
      });
    }
  },
  
  logout: () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("authTime");
    delete axios.defaults.headers.common["Authorization"];
    
    return Promise.resolve();
  },
  
  checkError: (error) => {
    const status = error.status || error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth");
      localStorage.removeItem("authTime");
      delete axios.defaults.headers.common["Authorization"];
      
      return Promise.reject({
        message: "Your session has expired or you are not authorized"
      });
    }
    return Promise.resolve();
  },
  
  checkAuth: () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    
    if (!auth || !auth.isAuthenticated || !auth.token) {
      return Promise.reject({
        message: "You must be logged in to access this page"
      });
    }
    
    if (auth.token && !axios.defaults.headers.common["Authorization"]) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    }
    
    const authTime = localStorage.getItem("authTime");
    if (authTime) {
      const sessionDuration = 2 * 60 * 60 * 1000; // 2 hours
      const currentTime = Date.now();
      
      if (currentTime - parseInt(authTime, 10) > sessionDuration) {
        localStorage.removeItem("auth");
        localStorage.removeItem("authTime");
        delete axios.defaults.headers.common["Authorization"];
        
        return Promise.reject({
          message: "Session expired. Please login again."
        });
      }
    }
    
    return axios
      .get(TOKEN_ENDPOINTS(auth.token))
      .then(() => Promise.resolve())
      .catch((error) => {
        localStorage.removeItem("auth");
        localStorage.removeItem("authTime");
        delete axios.defaults.headers.common["Authorization"];
        
        return Promise.reject({
          message: "Session invalid. Please login again."
        });
      });
  },
  
  getIdentity: () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth) {
      return Promise.reject({
        message: "No user found"
      });
    }
    return Promise.resolve({
      id: auth.user.id,
      fullName: auth.user.fullName,
      role: auth.user.role,
      ...auth.user
    });
  },
  
  getPermissions: () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth) {
      return Promise.resolve(auth.user.role);
    }
    return Promise.reject({
      message: "No permissions found"
    });
  },
  
  forgetPassword: async ({ email }) => {
    try {
      const response = await axios.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
      
      if (response.data.success) {
        return Promise.resolve({
          message: response.data.message
        });
      }
      
      return Promise.reject({
        message: response.data.message || "Failed to send reset instructions"
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      return Promise.reject({
        message: error.response?.data?.message || "Failed to send reset instructions"
      });
    }
  },
  
  resetPassword: async ({ token, password, confirmPassword }) => {
    try {
      const response = await axios.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
        token,
        password,
        confirmPassword
      });
      
      if (response.data.success) {
        return Promise.resolve({
          message: response.data.message || "Password reset successfully"
        });
      }
      
      return Promise.reject({
        message: response.data.message || "Failed to reset password"
      });
    } catch (error) {
      console.error("Reset password error:", error);
      return Promise.reject({
        message: error.response?.data?.message || "Failed to reset password"
      });
    }
  }
};

export default authProvider;
