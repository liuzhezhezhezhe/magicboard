import axios from "axios";

axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
  withCredentials: true,
});

/**
 * Before Request
 */
instance.interceptors.request.use(
  (config) => {
    // Add interceptors before send request.
    return config;
  },
  (error) => {
    // Add interceptors when get some error.
    return Promise.reject(error);
  }
);

/**
 * Got Response
 */
instance.interceptors.response.use(
  (response) => {
    const { status } = response;
    if (status === 200) return response;
    return Promise.reject(response);
  },
  (error) => {
    // Add some method to resolve problem
    return Promise.reject(error);
  }
);

export default instance;
