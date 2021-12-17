import axios from "axios";

const isProduction = process.env.NODE_ENV === "production";

export const baseURL = isProduction ? "http://3.6.169.33:5000/" : "http://localhost:5000/";

const Axios = axios.create({
    baseURL,
});

export default Axios;
