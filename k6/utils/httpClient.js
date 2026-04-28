import http from "k6/http";
import { config } from "../config/environment.js";

export function buildUrl(endpoint) {
  return `${config.baseUrl}${endpoint}`;
}

export function jsonHeaders(token = null) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return { headers };
}

export function get(endpoint, token) {
  return http.get(buildUrl(endpoint), jsonHeaders(token));
}

export function post(endpoint, body, token = null) {
  return http.post(buildUrl(endpoint), JSON.stringify(body), jsonHeaders(token));
}

export function put(endpoint, body, token) {
  return http.put(buildUrl(endpoint), JSON.stringify(body), jsonHeaders(token));
}

export function del(endpoint, token) {
  return http.del(buildUrl(endpoint), null, jsonHeaders(token));
}
