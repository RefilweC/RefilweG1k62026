import { group, sleep } from "k6";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { config } from "../config/environment.js";
import { login } from "../utils/auth.js";
import { get, post, put, del } from "../utils/httpClient.js";
import { checkStatus, checkJsonHasField, getJsonField } from "../utils/checks.js";
import {
  createTestimonialPayload,
  updateTestimonialPayload,
} from "../data/testData.js";

export const options = {
  stages: [
    { duration: "10s", target: 1 },
    { duration: "20s", target: 3 },
    { duration: "10s", target: 0 },
  ],

  thresholds: {
    http_req_failed: ["rate<1.01"],
    http_req_duration: ["p(95)<1000"],
  },
};

export function setup() {
  const token = login();
  return { token };
}

export default function (data) {
  const token = data && data.token;
  let testimonialId;

  if (!token) {
    sleep(1);
    return;
  }

  
  group("Get Profile", () => {
    const response = get(config.endpoints.profile, token);

    checkStatus(response, 200, "Get Profile");
    checkJsonHasField(response, "data.Email", "Profile response");
  });

  group("Post Testimonial", () => {
    const payload = createTestimonialPayload();

    const response = post(config.endpoints.testimonials, payload, token);

    checkStatus(response, 201, "Post Testimonial");
    checkJsonHasField(response, "data.Id", "Created testimonial");

    testimonialId = getJsonField(response, "data.Id") || getJsonField(response, "id");
    if (!testimonialId) {
      throw new Error(
        `Post Testimonial failed: unable to read id (status ${response.status})`
      );
    }


  });

  group("Update Testimonial", () => {
    const payload = updateTestimonialPayload();

    const response = put(
      `${config.endpoints.testimonials}/${testimonialId}`,
      payload,
      token
    );

    checkStatus(response, 200, "Update Testimonial");
    checkJsonHasField(response, "data.UpdatedAt", "Updated testimonial");
  });

  
  group("Delete Testimonial", () => {
    const response = del(`${config.endpoints.testimonials}/${testimonialId}`, token);

    checkStatus(response, 200, "Delete Testimonial");
    checkJsonHasField(response, "success", "Deleted testimonial");
  });

  
  sleep(1);
  
}

export function handleSummary(data) {
  const reportDir = __ENV.K6_REPORT_DIR || "reports";
  return {
    [`${reportDir}/testimonial-summary.html`]: htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
