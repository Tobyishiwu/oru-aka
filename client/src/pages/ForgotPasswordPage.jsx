import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Hammer, KeyRound } from "lucide-react";
import { authApi } from "../api/auth";
import { TextField } from "../components/ui/Fields";
import Button from "../components/ui/Button";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await authApi.requestPasswordReset(phone);
      navigate("/reset-password", { state: { phone } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not send a reset code. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bone px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-bone">
            <Hammer className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="font-display text-[1.3rem] font-semibold tracking-tight text-indigo-800">Oru Aka</span>
        </Link>

        <div className="rounded-card border border-ink-100 bg-white p-7 shadow-card">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
            <KeyRound className="h-6 w-6 text-indigo-600" strokeWidth={2} />
          </span>
          <h1 className="mt-4 font-display text-[1.4rem] font-semibold text-ink-800">Forgot your password?</h1>
          <p className="mt-1 text-[0.875rem] text-ink-400">
            Enter your phone number and we&apos;ll send a code to reset it.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <TextField
              id="phone"
              label="Phone number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="080..."
              autoComplete="tel"
              required
            />

            {error && <p className="text-[0.85rem] text-rust-500">{error}</p>}

            <Button type="submit" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending code…" : "Send reset code"}
            </Button>
          </form>

          <p className="mt-5 text-center text-[0.875rem] text-ink-400">
            Remembered it?{" "}
            <Link to="/login" className="font-semibold text-indigo-700 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
