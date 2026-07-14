import { useEffect, useRef, useState } from "react";
import { Briefcase, Check, Pencil, Trash2, Upload, X } from "lucide-react";
import { workerApi } from "../../api/workers";
import { PageSpinner, Spinner } from "../ui/Badges";

const MAX_PHOTOS = 8;

export default function DashboardPortfolioPage() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [captionDraft, setCaptionDraft] = useState("");
  const [savingCaption, setSavingCaption] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    workerApi
      .getMyProfile()
      .then(({ data }) => setPhotos(data.profile.photos || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  async function handleFileSelect(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (photos.length + files.length > MAX_PHOTOS) {
      setError(`You can have a maximum of ${MAX_PHOTOS} photos`);
      return;
    }

    setError("");
    setIsUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("photos", file));

    try {
      const { data } = await workerApi.uploadPhotos(formData);
      setPhotos(data.photos);
    } catch (err) {
      setError(err.response?.data?.message || "Could not upload photos");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(photoId) {
    try {
      const { data } = await workerApi.deletePhoto(photoId);
      setPhotos(data.photos);
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete photo");
    }
  }

  function startEditingCaption(photo) {
    setEditingId(photo._id);
    setCaptionDraft(photo.caption || "");
  }

  async function saveCaption(photoId) {
    setSavingCaption(true);
    try {
      const { data } = await workerApi.updatePhotoCaption(photoId, captionDraft.trim());
      setPhotos(data.photos);
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save caption");
    } finally {
      setSavingCaption(false);
    }
  }

  if (isLoading) return <PageSpinner />;

  return (
    <div className="rounded-card border border-ink-100 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-display text-[1.2rem] font-semibold text-ink-800">
            <Briefcase className="h-5 w-5 text-brass-500" strokeWidth={2} />
            Your portfolio
          </h2>
          <p className="mt-1 text-[0.875rem] text-ink-400">
            Showcase your past work. Clients trust profiles with real examples — add a short
            note to each photo explaining the job.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-ink-50 px-3 py-1 text-[0.8rem] font-medium text-ink-500">
          {photos.length} / {MAX_PHOTOS}
        </span>
      </div>

      {error && <p className="mt-3 text-[0.85rem] text-rust-500">{error}</p>}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <div key={photo._id} className="group overflow-hidden rounded-xl border border-ink-100">
            <div className="relative aspect-[4/3] bg-ink-100">
              <img src={photo.url} alt={photo.caption || ""} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
              <button
                type="button"
                onClick={() => handleDelete(photo._id)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink-900/70 text-bone transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Delete photo"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <div className="p-3">
              {editingId === photo._id ? (
                <div className="flex items-center gap-1.5">
                  <input
                    autoFocus
                    value={captionDraft}
                    onChange={(e) => setCaptionDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveCaption(photo._id)}
                    placeholder="e.g. Rewired a 4-bedroom duplex in Enugu"
                    maxLength={140}
                    className="w-full rounded-lg border border-ink-200 px-2.5 py-1.5 text-[0.825rem] text-ink-700 placeholder:text-ink-300 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-brass-300"
                  />
                  <button
                    type="button"
                    onClick={() => saveCaption(photo._id)}
                    disabled={savingCaption}
                    aria-label="Save caption"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-verified-50 text-verified-600"
                  >
                    {savingCaption ? <Spinner className="h-3.5 w-3.5" /> : <Check className="h-4 w-4" strokeWidth={2.25} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    aria-label="Cancel"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-ink-400"
                  >
                    <X className="h-4 w-4" strokeWidth={2.25} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => startEditingCaption(photo)}
                  className="flex w-full items-start gap-1.5 text-left"
                >
                  {photo.caption ? (
                    <p className="text-[0.825rem] text-ink-600">{photo.caption}</p>
                  ) : (
                    <p className="flex items-center gap-1 text-[0.825rem] text-ink-300">
                      <Pencil className="h-3 w-3" strokeWidth={2} />
                      Add a caption
                    </p>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 text-ink-400 transition-colors hover:border-indigo-400 hover:text-indigo-600"
          >
            {isUploading ? (
              <Spinner className="h-6 w-6" />
            ) : (
              <>
                <Upload className="h-6 w-6" strokeWidth={1.75} />
                <span className="text-[0.8rem] font-medium">Add photo of past work</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
