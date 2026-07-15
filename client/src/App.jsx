import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

import AppLayout from "./components/layout/AppLayout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminLayout from "./components/layout/AdminLayout";

import HomePage from "./pages/HomePage";
import ClientHomePage from "./pages/ClientHomePage";
import BrowseWorkersPage from "./pages/BrowseWorkersPage";
import WorkerProfilePage from "./pages/WorkerProfilePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyPhonePage from "./pages/VerifyPhonePage";
import ProfilePage from "./pages/ProfilePage";
import MessagesListPage from "./pages/MessagesListPage";
import ConversationPage from "./pages/ConversationPage";
import NotFoundPage from "./pages/NotFoundPage";

import DashboardProfilePage from "./components/dashboard/DashboardProfilePage";
import DashboardPortfolioPage from "./components/dashboard/DashboardPortfolioPage";
import DashboardVerificationPage from "./components/dashboard/DashboardVerificationPage";
import DashboardBoostPage from "./components/dashboard/DashboardBoostPage";

import AdminStatsPage from "./components/admin/AdminStatsPage";
import AdminVerificationQueuePage from "./components/admin/AdminVerificationQueuePage";
import AdminUsersPage from "./components/admin/AdminUsersPage";

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <SocketProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="workers" element={<BrowseWorkersPage />} />
            <Route path="workers/:id" element={<WorkerProfilePage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="verify-phone" element={<VerifyPhonePage />} />

            <Route
              path="home"
              element={
                <ProtectedRoute roles={["client"]}>
                  <ClientHomePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="messages"
              element={
                <ProtectedRoute>
                  <MessagesListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="messages/:conversationId"
              element={
                <ProtectedRoute>
                  <ConversationPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="dashboard"
              element={
                <ProtectedRoute roles={["worker"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardProfilePage />} />
              <Route path="portfolio" element={<DashboardPortfolioPage />} />
              <Route path="verification" element={<DashboardVerificationPage />} />
              <Route path="boost" element={<DashboardBoostPage />} />
            </Route>

            <Route
              path="admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminStatsPage />} />
              <Route path="verification-queue" element={<AdminVerificationQueuePage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}


