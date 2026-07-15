import { useEffect, useState } from "react";
import { workerApi } from "../../api/workers";
import { useAuth } from "../../context/AuthContext";
import { TextField, SelectField, TextAreaField } from "../ui/Fields";
import Button from "../ui/Button";
import { PageSpinner } from "../ui/Badges";

const TRADES = [
  "Electrician",
  "Plumber",
  "Tiler",
  "Tailor",
  "Carpenter",
  "AC Technician",
  "Painter",
  "Welder",
  "Solar Installer",
  "POP Ceiling Installer",
  "Mechanic",
  "Mason",
  "Generator Technician",
  "Handyman",
];

const EMPTY_FORM = {
  trade: "Electrician",
  tagline: "",
  bio: "",
  skills: "",
  state: "Lagos",
  city: "",
  yearsExperience: 0,
  startingPrice: "",
  priceUnit: "per job",
  availability: "Available now",
};

export default function DashboardProfilePage() {
  const { workerProfile, setWorkerProfile } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    workerApi
      .getMyProfile()
      .then(({ data }) => {
        setHasProfile(true);
        setForm({
          ...data.profile,
          skills: (data.profile.skills || []).join(", "),
        });
      })
      .catch(() => setHasProfile(false))
      .finally(() => setIsLoading(false));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSaving(true);

    const payload = {
      ...form,
      yearsExperience: Number(form.yearsExperience),
      startingPrice: Number(form.startingPrice),
    };

    try {
      if (hasProfile) {
        const { data } = await workerApi.updateMyProfile(payload);
        setWorkerProfile(data.profile);
      } else {
        const { data } = await workerApi.createProfile(payload);
        setWorkerProfile(data.profile);
        setHasProfile(true);
      }
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save your profile");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <PageSpinner />;

  return (
    <div className="rounded-card border border-ink-100 bg-white p-6">
      <h2 className="font-display text-[1.2rem] font-semibold text-ink-800">
        {hasProfile ? "Edit your listing" : "Create your listing"}
      </h2>
      <p className="mt-1 text-[0.875rem] text-ink-400">
        This is what clients see when they search for workers. Be specific &mdash; detailed
        profiles get more contacts.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField id="trade" label="Trade" value={form.trade} onChange={(e) => update("trade", e.target.value)}>
            {TRADES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </SelectField>
          <TextField
            id="tagline"
            label="Tagline"
            value={form.tagline}
            onChange={(e) => update("tagline", e.target.value)}
            placeholder="e.g. Industrial & residential wiring specialist"
            maxLength={120}
          />
        </div>

        <TextAreaField
          id="bio"
          label="About you"
          rows={4}
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
          placeholder="Tell clients about your experience, specialties, and what makes your work stand out."
          maxLength={1000}
        />

        <TextField
          id="skills"
          label="Skills (comma-separated)"
          value={form.skills}
          onChange={(e) => update("skills", e.target.value)}
          placeholder="e.g. Rewiring, Panel upgrades, Inverter installation"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField id="state" label="State" value={form.state} onChange={(e) => update("state", e.target.value)}>
            <option value="Lagos">Lagos</option>
            <option value="Enugu">Enugu</option>
            <option value="Abuja">Abuja</option>
          </SelectField>
          <TextField
            id="city"
            label="City / neighborhood"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="e.g. Ikeja GRA"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField
            id="yearsExperience"
            label="Years of experience"
            type="number"
            min={0}
            max={60}
            value={form.yearsExperience}
            onChange={(e) => update("yearsExperience", e.target.value)}
          />
          <TextField
            id="startingPrice"
            label="Starting price (\u20a6)"
            type="number"
            min={0}
            value={form.startingPrice}
            onChange={(e) => update("startingPrice", e.target.value)}
            required
          />
          <SelectField id="priceUnit" label="Price unit" value={form.priceUnit} onChange={(e) => update("priceUnit", e.target.value)}>
            <option value="per job">Per job</option>
            <option value="per hour">Per hour</option>
            <option value="per day">Per day</option>
          </SelectField>
        </div>

        <SelectField id="availability" label="Availability" value={form.availability} onChange={(e) => update("availability", e.target.value)}>
          <option value="Available now">Available now</option>
          <option value="Available this week">Available this week</option>
          <option value="Booked">Booked</option>
        </SelectField>

        {error && <p className="text-[0.85rem] text-rust-500">{error}</p>}
        {success && <p className="text-[0.85rem] text-verified-600">Profile saved successfully.</p>}

        <Button type="submit" size="lg" className="mt-1 self-start" disabled={isSaving}>
          {isSaving ? "Saving\u2026" : hasProfile ? "Save changes" : "Create listing"}
        </Button>
      </form>
    </div>
  );
}

