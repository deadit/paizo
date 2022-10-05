import axios from "axios";

export const BACKEND_API = process.env.REACT_APP_BACKEND_API;

export const websiteBackendApi = axios.create({
  timeout: 1000 * 5,
  baseURL: BACKEND_API,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosGetFetcher = (url: string, options?: any) =>
  websiteBackendApi.get(url, options).then((res) => res.data);
