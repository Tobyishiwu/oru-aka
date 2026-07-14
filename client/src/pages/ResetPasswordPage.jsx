import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Hammer, KeyRound } from "lucide-react";
import { authApi } from "../api/auth";
import { TextField } from "../components/ui/Fields";
import Button from "../components/ui/Button";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!phone) navigate("/forgot-password", { replace: true });
  }, [phone, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Same verified logic as VerifyPhonePage: handles both normal single-digit
  // typing and a full code being pasted/autofilled into one box.
  function handleDigitChange(index, value) {
    const digitsOnly = value.replace(/\D/g, "");

    if (digitsOnly.length > 1) {
      const next = [...digits];
      for (let i = 0; i < digitsOnly.length && index + i < 6; i++) {
        next[index + i] = digitsOnly[i];
      }
      setDigits(next);
      const lastFilledIndex = Math.min(index + digitsOnly.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
      return;
    }

    const next = [...digits];
    next[index] = digitsOnly;
    setDigits(next);
    if (digitsOnly && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const code = digits.join("");
    if (code.length !== 6) {
      setError("Enter the full 6-digit code");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.resetPassword({ phone, code, newPassword });
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset your password. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    setError("");
    try {
      await authApi.requestPasswordReset(phone);
      setResendCooldown(30);
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend code");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bone px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-bone">
            <Hammer className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="font-display text-[1.3rem] font-semibold tracking-tight text-indigo-800">Oru Aka</span>
        </div>

        <div className="rounded-card border border-ink-100 bg-white p-7 shadow-card">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
            <KeyRound className="h-6 w-6 text-indigo-600" strokeWidth={2} />
          </span>
          <h1 className="mt-4 font-display text-[1.3rem] font-semibold text-ink-800">Reset your password</h1>
          <p className="mt-1 text-[0.875rem] text-ink-400">
            Enter the code sent to <span className="font-medium text-ink-600">{phone}</span> and choose a new password.
          </p>

          {success ? (
            <p className="mt-6 rounded-xl bg-verified-50 px-4 py-3 text-[0.9rem] font-medium text-verified-600">
              Password reset successfully. Taking you to log in…
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5 text-left">
              <div className="flex justify-center gap-2">
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    inputMode="numeric"
                    maxLength={1}
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    className="h-12 w-11 rounded-xl border border-ink-200 text-center text-[1.2rem] font-semibold text-ink-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-brass-300"
                  />
                ))}
              </div>

              <TextField
                id="newPassword"
                label="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                minLength={6}
                required
              />
              <TextField
                id="confirmPassword"
                label="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                autoComplete="new-password"
                minLength={6}
                required
              />

              {error && <p className="text-[0.85rem] text-rust-500">{error}</p>}

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Resetting…" : "Reset password"}
              </Button>

              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-[0.875rem] font-semibold text-indigo-700 hover:underline disabled:text-ink-300 disabled:no-underline"
              >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
