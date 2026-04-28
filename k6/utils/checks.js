import { check } from "k6";

export function safeJson(response) {
  try {
    return response && response.body ? response.json() : null;
  } catch {
    return null;
  }
}

function getValueByPath(payload, fieldPath) {
  if (!payload || !fieldPath) {
    return undefined;
  }

  const parts = String(fieldPath).split(".");
  let current = payload;

  for (const part of parts) {
    if (current === null || current === undefined || !(part in current)) {
      return undefined;
    }
    current = current[part];
  }

  return current;
}

export function getJsonField(response, fieldName) {
  const payload = safeJson(response);
  return getValueByPath(payload, fieldName);
}

export function checkStatus(response, expectedStatus, label) {
  return check(response, {
    [`${label} status is ${expectedStatus}`]: (res) => res.status === expectedStatus,
  });
}

export function checkJsonHasField(response, fieldName, label) {
  return check(response, {
    [`${label} has ${fieldName}`]: (res) => {
      const value = getJsonField(res, fieldName);
      return value !== undefined && value !== null;
    },
  });
}
