import api from "./client";

export const chatApi = {
  listConversations: () => api.get("/chat/conversations"),
  getOrCreateConversation: (userId) => api.post("/chat/conversations", { userId }),
  getMessages: (conversationId) => api.get(`/chat/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, text) =>
    api.post(`/chat/conversations/${conversationId}/messages`, { text }),
};

export const boostApi = {
  getPricing: () => api.get("/boosts/pricing"),
  request: (durationDays) => api.post("/boosts", { durationDays }),
  getMine: () => api.get("/boosts/me"),
};

export const metaApi = {
  getTrades: () => api.get("/meta/trades"),
  getStates: () => api.get("/meta/states"),
  getTradeCounts: () => api.get("/meta/trade-counts"),
};

export const userApi = {
  updateMe: (payload) => api.patch("/users/me", payload),
  uploadAvatar: (formData) =>
    api.post("/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const adminApi = {
  getStats: () => api.get("/admin/stats"),
  getVerificationQueue: () => api.get("/admin/verification-queue"),
  approveVerification: (workerId, notes) =>
    api.patch(`/admin/verification/${workerId}/approve`, { notes }),
  rejectVerification: (workerId, notes) =>
    api.patch(`/admin/verification/${workerId}/reject`, { notes }),
  listUsers: (params) => api.get("/admin/users", { params }),
  deactivateUser: (userId) => api.patch(`/admin/users/${userId}/deactivate`),
};

