import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Hammer } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { TextField } from "../components/ui/Fields";
import Button from "../components/ui/Button";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login({ phone, password });
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not log in. Check your details.");
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
          <h1 className="font-display text-[1.4rem] font-semibold text-ink-800">Welcome back</h1>
          <p className="mt-1 text-[0.875rem] text-ink-400">Log in to your Oru Aka account.</p>

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
            <TextField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              required
            />

            <Link to="/forgot-password" className="-mt-1 self-end text-[0.825rem] font-semibold text-indigo-700 hover:underline">
              Forgot password?
            </Link>

            {error && <p className="text-[0.85rem] text-rust-500">{error}</p>}

            <Button type="submit" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in\u2026" : "Log in"}
            </Button>
          </form>

          <p className="mt-5 text-center text-[0.875rem] text-ink-400">
            New to Oru Aka?{" "}
            <Link to="/signup" className="font-semibold text-indigo-700 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
