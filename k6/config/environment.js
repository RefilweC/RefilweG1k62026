export const config = {
  baseUrl: __ENV.K6_BASE_URL || __ENV.BASE_URL || "https://www.ndosiautomation.co.za",

  endpoints: {
    login: "/APIDEV/login",
    profile: "/APIDEV/profile",
    testimonials: "/APIDEV/testimonials",
  },

  credentials: {
    email: __ENV.K6_USER_EMAIL || __ENV.USER_EMAIL || "testerrm@gmail.com",
    password: __ENV.K6_USER_PASSWORD || __ENV.USER_PASSWORD || "Tester2026!",
  },
};
