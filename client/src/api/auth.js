import api from "./client";

export const authApi = {
  signup: (payload) => api.post("/auth/signup", payload),
  login: (payload) => api.post("/auth/login", payload),
  sendOtp: (payload) => api.post("/auth/send-otp", payload),
  verifyOtp: (payload) => api.post("/auth/verify-otp", payload),
  requestPasswordReset: (phone) => api.post("/auth/forgot-password", { phone }),
  resetPassword: (payload) => api.post("/auth/reset-password", payload),
  getMe: () => api.get("/auth/me"),
};
