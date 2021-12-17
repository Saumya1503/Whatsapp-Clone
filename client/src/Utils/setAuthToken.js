
import API from "./API"

const setAuthToken = (token) => {
  if (token) {
    // Apply authorization token to every request if logged in
    API.defaults.headers.common.Authorization = token;
  } else {
    // Delete auth header
    delete API.defaults.headers.common.Authorization;
  }
};
export default setAuthToken;
