import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Hammer } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { TextField, SelectField } from "../components/ui/Fields";
import Button from "../components/ui/Button";

const ROLE_HOME = {
  worker: "/dashboard",
  admin: "/admin",
  client: "/workers",
};

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    role: searchParams.get("role") === "worker" ? "worker" : "client",
    state: "Lagos",
    city: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const data = await signup(form);
      navigate(ROLE_HOME[data.user.role] || "/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your account. Try again.");
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
          <h1 className="font-display text-[1.4rem] font-semibold text-ink-800">Create your account</h1>
          <p className="mt-1 text-[0.875rem] text-ink-400">Join Nigeria&apos;s marketplace for skilled trades.</p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => update("role", "client")}
              className={`rounded-xl border px-4 py-3 text-[0.875rem] font-semibold transition-colors ${
                form.role === "client" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-ink-100 text-ink-500"
              }`}
            >
              I need work done
            </button>
            <button
              type="button"
              onClick={() => update("role", "worker")}
              className={`rounded-xl border px-4 py-3 text-[0.875rem] font-semibold transition-colors ${
                form.role === "worker" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-ink-100 text-ink-500"
              }`}
            >
              I&apos;m a tradesperson
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <TextField
              id="name"
              label="Full name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Chidi Okeke"
              autoComplete="name"
              required
            />
            <TextField
              id="phone"
              label="Phone number"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="080..."
              autoComplete="tel"
              required
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              autoComplete="new-password"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <SelectField id="state" label="State" value={form.state} onChange={(e) => update("state", e.target.value)}>
                <option value="Lagos">Lagos</option>
                <option value="Enugu">Enugu</option>
                <option value="Abuja">Abuja</option>
              </SelectField>
              <TextField
                id="city"
                label="City / area"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="e.g. Ikeja"
              />
            </div>

            {error && <p className="text-[0.85rem] text-rust-500">{error}</p>}

            <Button type="submit" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account\u2026" : "Create account"}
            </Button>
          </form>

          <p className="mt-5 text-center text-[0.875rem] text-ink-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-700 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
