import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { userApi } from "../api/misc";
import { TextField, SelectField } from "../components/ui/Fields";
import Button from "../components/ui/Button";

export default function ProfilePage() {
  const { user, refreshSession } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    state: user?.state || "Lagos",
    city: user?.city || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSaving(true);
    try {
      await userApi.updateMe(form);
      await refreshSession();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save changes");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAvatarSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      await userApi.uploadAvatar(formData);
      await refreshSession();
    } catch (err) {
      setError(err.response?.data?.message || "Could not upload photo");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  return (
    <div className="bg-bone py-10 sm:py-12">
      <div className="mx-auto max-w-[600px] px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-[1.7rem] font-semibold tracking-tight text-indigo-800">Your profile</h1>

        <div className="mt-7 rounded-card border border-ink-100 bg-white p-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-indigo-100"
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[1.4rem] font-semibold text-indigo-600">
                  {user?.name?.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-ink-900/40 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                <Camera className="h-5 w-5 text-bone" strokeWidth={2} />
              </div>
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarSelect} className="hidden" />
            <div>
              <p className="text-[0.95rem] font-semibold text-ink-800">{user?.name}</p>
              <p className="text-[0.825rem] text-ink-400">{user?.phone}</p>
              {isUploadingAvatar && <p className="text-[0.8rem] text-indigo-500">Uploading photo…</p>}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <TextField id="name" label="Full name" value={form.name} onChange={(e) => update("name", e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <SelectField id="state" label="State" value={form.state} onChange={(e) => update("state", e.target.value)}>
                <option value="Lagos">Lagos</option>
                <option value="Enugu">Enugu</option>
                <option value="Abuja">Abuja</option>
              </SelectField>
              <TextField id="city" label="City / area" value={form.city} onChange={(e) => update("city", e.target.value)} />
            </div>

            {error && <p className="text-[0.85rem] text-rust-500">{error}</p>}
            {success && <p className="text-[0.85rem] text-verified-600">Changes saved.</p>}

            <Button type="submit" size="md" className="mt-1 self-start" disabled={isSaving}>
              {isSaving ? "Saving\u2026" : "Save changes"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
