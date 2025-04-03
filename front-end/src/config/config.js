
export const API_URL = 'http://localhost:3001/api';
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/register`,
  FORGOT_PASSWORD: `${API_URL}/auth/forgot-password`,
  VERIFY_EMAIL: `${API_URL}/auth/verify-email`,
};

export const USER_ENDPOINTS = {
  PROFILE: `${API_URL}/users/profile`,
  UPDATE_PROFILE: `${API_URL}/users/profile`,
};

export const TOKEN_ENDPOINTS = (token) => {
   return `${API_URL}/auth/token-refresh/${token}`
};

export const API_ENDPOINT_FUNCTION = (path) => {
  return API_URL + path
}

export const GET_HEADER = async (options = {}) => {
  const authData = await localStorage.getItem("auth");
  const headers = new Headers();
  if (options.isJson) {
    headers.append('Content-Type', 'application/json');
  }

  if (authData) {
    try {
      const parsedAuth = JSON.parse(authData);
      if (parsedAuth.token) {
        headers.append('Authorization', `Bearer ${parsedAuth.token}`);
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
    }
  }

  return { headers, ...options };
};


export default {
  API_URL,
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  TOKEN_ENDPOINTS,
  API_ENDPOINT_FUNCTION,
  GET_HEADER
};
