import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Hammer, ShieldCheck } from "lucide-react";
import { authApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

export default function VerifyPhonePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshSession } = useAuth();
  const phone = location.state?.phone;

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!phone) navigate("/signup", { replace: true });
  }, [phone, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  function handleDigitChange(index, value) {
    const digitsOnly = value.replace(/\D/g, "");

    if (digitsOnly.length > 1) {
      // Handles autofill/paste of the full code into one box \u2014 common on
      // mobile when the browser offers to fill the SMS code automatically.
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
    const code = digits.join("");
    if (code.length !== 6) {
      setError("Enter the full 6-digit code");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await authApi.verifyOtp({ phone, code });
      await refreshSession();
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Incorrect code. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    setError("");
    try {
      await authApi.sendOtp({ phone, purpose: "signup" });
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
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-verified-50">
            <ShieldCheck className="h-6 w-6 text-verified-500" strokeWidth={2} />
          </span>
          <h1 className="mt-4 font-display text-[1.3rem] font-semibold text-ink-800">Verify your phone</h1>
          <p className="mt-1 text-[0.875rem] text-ink-400">
            We sent a 6-digit code to <span className="font-medium text-ink-600">{phone}</span>
          </p>

          <form onSubmit={handleSubmit} className="mt-6">
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

            {error && <p className="mt-3 text-[0.85rem] text-rust-500">{error}</p>}

            <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying\u2026" : "Verify"}
            </Button>
          </form>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="mt-4 text-[0.875rem] font-semibold text-indigo-700 hover:underline disabled:text-ink-300 disabled:no-underline"
          >
            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
}
