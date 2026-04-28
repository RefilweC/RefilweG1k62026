# RefilweG1k6 — k6 Performance Testing Framework

Performance tests for the Testimonial API, built with [k6](https://k6.io/). The API is a C# ASP.NET Core (.NET 8) application; the test suite is written in JavaScript and targets the live environment at `https://www.ndosiautomation.co.za`.

---

## Project Structure

```
RefilweG1k62026/
├── k6/
│   ├── config/
│   │   └── environment.js            # Base URL, endpoints, and credentials
│   ├── data/
│   │   └── testData.js               # Request payload factories
│   ├── reports/
│   │   └── testimonial-summary.html  # Auto-generated HTML report (after test run)
│   ├── tests/
│   │   └── testimonialTest.js        # Main k6 test script
│   ├── utils/
│   │   ├── auth.js                   # Login helper with retry logic
│   │   ├── checks.js                 # Assertion / check helpers
│   │   └── httpClient.js             # HTTP wrapper (GET, POST, PUT, DELETE)
│   └── package.json
└── src/
    └── TestimonialApi/               # C# ASP.NET Core API (.NET 8)
        ├── Controllers/              # Auth, Profile, Testimonials
        ├── DTOs/                     # Request/response shapes
        ├── Models/                   # Domain models (User, Testimonial)
        └── Services/                 # Business logic layer
```

---

## API Under Test

| Endpoint                      | Method | Description                |
|-------------------------------|--------|----------------------------|
| `/APIDEV/login`               | POST   | Authenticate, returns JWT  |
| `/APIDEV/profile`             | GET    | Get authenticated profile  |
| `/APIDEV/testimonials`        | POST   | Create a testimonial       |
| `/APIDEV/testimonials/{id}`   | PUT    | Update a testimonial       |
| `/APIDEV/testimonials/{id}`   | DELETE | Delete a testimonial       |

---

## Test Scenarios

The main test script runs a **load test** across three stages:

| Stage     | Duration | Target VUs |
|-----------|----------|------------|
| Ramp up   | 10 s     | 1          |
| Sustain   | 20 s     | 3          |
| Ramp down | 10 s     | 0          |

### Thresholds

| Metric              | Threshold         |
|---------------------|-------------------|
| `http_req_failed`   | `rate < 1.01 %`   |
| `http_req_duration` | `p(95) < 1000 ms` |

### Test Groups (per VU iteration)

1. **Get Profile** — asserts HTTP 200 and `data.Email` present  
2. **Post Testimonial** — asserts HTTP 201 and `data.Id` present  
3. **Update Testimonial** — asserts HTTP 200 and `data.UpdatedAt` present  
4. **Delete Testimonial** — asserts HTTP 200 and `success` present  

---

## Prerequisites

- [k6](https://k6.io/docs/get-started/installation/) installed globally
- Node.js (for npm scripts)
- Go (only needed when building the optional Allure k6 binary)

---

## Running the Tests

### From the project root

```bash
# Load test — report written to k6/reports/
k6 run -e K6_REPORT_DIR=k6/reports k6/tests/testimonialTest.js
```

### Using npm scripts (run from the `k6/` directory)

```bash
cd k6

# Full load test
npm test

# Smoke test — 1 VU for 3 seconds
npm run test:smoke
```

Both npm scripts automatically create the `reports/` directory if it does not exist.

---

## Configuration

All values can be overridden with environment variables:

| Variable               | Default                             | Description            |
|------------------------|-------------------------------------|------------------------|
| `K6_BASE_URL`          | `https://www.ndosiautomation.co.za` | API base URL           |
| `K6_USER_EMAIL`        | `testerrm@gmail.com`                | Test user email        |
| `K6_USER_PASSWORD`     | `Tester2026!`                       | Test user password     |
| `K6_LOGIN_RETRIES`     | `3`                                 | Login retry attempts   |
| `K6_LOGIN_RETRY_DELAY` | `2`                                 | Retry delay (seconds)  |
| `K6_REPORT_DIR`        | `reports`                           | HTML report output dir |

Example — point tests at a different environment:

```bash
k6 run \
  -e K6_BASE_URL=https://staging.example.com \
  -e K6_REPORT_DIR=k6/reports \
  k6/tests/testimonialTest.js
```

---

## Reports

After each run, an HTML report is written to the path set by `K6_REPORT_DIR`:

| Run method             | Report location                    |
|------------------------|------------------------------------|
| `npm test` (in `k6/`)  | `k6/reports/testimonial-summary.html` |
| Root-level k6 command  | path given by `-e K6_REPORT_DIR=…` |

Open the report in any browser:

```bash
open k6/reports/testimonial-summary.html
```

---

## Framework Architecture

```
testimonialTest.js
  ├── setup()           → login() → returns JWT token shared across VUs
  ├── default(data)     → per-VU iteration
  │     ├── Get Profile
  │     ├── Post Testimonial
  │     ├── Update Testimonial
  │     └── Delete Testimonial
  └── handleSummary()   → writes HTML report + coloured stdout summary
```

### Utility Modules

| Module          | Responsibility                                                                 |
|-----------------|--------------------------------------------------------------------------------|
| `httpClient.js` | Wraps `k6/http`; attaches `Content-Type`, `Accept`, and `Authorization` headers automatically |
| `auth.js`       | Logs in and retries up to `K6_LOGIN_RETRIES` times; backs off on HTTP 429      |
| `checks.js`     | Status assertions and nested JSON field validation via dot-notation paths       |
| `testData.js`   | Centralised payload factories for create and update requests                   |
| `environment.js`| Single source of truth for base URL, endpoints, and credentials                |
