import { check, sleep } from "k6";
import { config } from "../config/environment.js";
import { post } from "./httpClient.js";
import { checkStatus, getJsonField } from "./checks.js";

export function login() {
  const maxAttempts = Number(__ENV.K6_LOGIN_RETRIES || 3);
  const retryDelaySeconds = Number(__ENV.K6_LOGIN_RETRY_DELAY || 2);

  let response;
  let token;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    response = post(config.endpoints.login, {
      email: config.credentials.email,
      password: config.credentials.password,
    });

    token =
      getJsonField(response, "token") ||
      getJsonField(response, "data.token") ||
      getJsonField(response, "accessToken") ||
      getJsonField(response, "data.accessToken");

    if (response.status === 200 && token) {
      break;
    }

    if (response.status === 429 && attempt < maxAttempts) {
      sleep(retryDelaySeconds * attempt);
      continue;
    }

    break;
  }

  checkStatus(response, 200, "Login");
  check(response, {
    "Login response has token": () => Boolean(token),
  });

  return token || null;
}
