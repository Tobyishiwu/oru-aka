import api from "./client";

export const workerApi = {
  list: (params) => api.get("/workers", { params }),
  getById: (id) => api.get(`/workers/${id}`),
  getByUserId: (userId) => api.get(`/workers/by-user/${userId}`),
  createProfile: (payload) => api.post("/workers", payload),
  getMyProfile: () => api.get("/workers/me/profile"),
  updateMyProfile: (payload) => api.patch("/workers/me/profile", payload),
  uploadPhotos: (formData) =>
    api.post("/workers/me/photos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deletePhoto: (photoId) => api.delete(`/workers/me/photos/${photoId}`),
  updatePhotoCaption: (photoId, caption) => api.patch(`/workers/me/photos/${photoId}`, { caption }),
  submitVerification: (formData) =>
    api.post("/workers/me/verification", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const reviewApi = {
  listForWorker: (workerId) => api.get(`/workers/${workerId}/reviews`),
  create: (workerId, payload) => api.post(`/workers/${workerId}/reviews`, payload),
};

