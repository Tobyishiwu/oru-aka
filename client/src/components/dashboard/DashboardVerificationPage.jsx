import { useEffect, useRef, useState } from "react";
import { FileCheck, ShieldCheck, Upload } from "lucide-react";
import { workerApi } from "../../api/workers";
import Button from "../ui/Button";
import { PageSpinner, VerifiedBadge } from "../ui/Badges";

export default function DashboardVerificationPage() {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    workerApi
      .getMyProfile()
      .then(({ data }) => setStatus(data.profile.verificationStatus))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError("");
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("idDocument", file);

    try {
      const { data } = await workerApi.submitVerification(formData);
      setStatus(data.verificationStatus);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit your ID");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <PageSpinner />;

  return (
    <div className="rounded-card border border-ink-100 bg-white p-6">
      <h2 className="font-display text-[1.2rem] font-semibold text-ink-800">Get verified</h2>
      <p className="mt-1 text-[0.875rem] text-ink-400">
        Verified profiles get a trust badge and rank higher in search. Reviewed within
        24â€“48 hours of submission.
      </p>

      <div className="mt-5">
        {status === "verified" ? (
          <div className="flex items-center gap-3 rounded-xl bg-verified-50 p-4">
            <ShieldCheck className="h-6 w-6 text-verified-500" strokeWidth={2} />
            <div>
              <p className="text-[0.9rem] font-semibold text-verified-600">You&apos;re verified</p>
              <p className="text-[0.825rem] text-verified-600/80">Your profile shows the verified badge to clients.</p>
            </div>
          </div>
        ) : status === "pending" ? (
          <div className="flex items-center gap-3 rounded-xl bg-brass-50 p-4">
            <FileCheck className="h-6 w-6 text-brass-600" strokeWidth={2} />
            <div>
              <p className="text-[0.9rem] font-semibold text-brass-700">Verification in progress</p>
              <p className="text-[0.825rem] text-brass-700/80">
                We&apos;ve received your ID and are reviewing it. This usually takes 24â€“48 hours.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {status === "rejected" && (
              <p className="mb-3 text-[0.85rem] text-rust-500">
                Your last submission wasn&apos;t approved. Please upload a clear photo of a valid ID.
              </p>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 px-6 py-10 text-ink-400 transition-colors hover:border-indigo-400 hover:text-indigo-600"
            >
              <Upload className="h-7 w-7" strokeWidth={1.75} />
              <span className="text-[0.875rem] font-medium">
                {isSubmitting ? "Uploading\u2026" : "Upload a government ID"}
              </span>
              <span className="text-[0.8rem] text-ink-300">NIN slip, voter&apos;s card, or driver&apos;s license</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            {error && <p className="mt-3 text-[0.85rem] text-rust-500">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
