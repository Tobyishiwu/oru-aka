import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { reviewApi } from "../../api/workers";
import { useAuth } from "../../context/AuthContext";
import { formatRelativeTime } from "../../utils/format";
import Button from "../ui/Button";
import { TextAreaField } from "../ui/Fields";
import { Spinner } from "../ui/Badges";

export default function ReviewsSection({ workerId, onReviewAdded }) {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    reviewApi
      .listForWorker(workerId)
      .then(({ data }) => setReviews(data.reviews))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [workerId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await reviewApi.create(workerId, { rating, comment });
      setReviews((prev) => [{ ...data.review, client: { name: user.name, avatarUrl: user.avatarUrl } }, ...prev]);
      setRating(0);
      setComment("");
      onReviewAdded?.();
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-card border border-ink-100 bg-white p-6">
      <h2 className="font-display text-[1.25rem] font-semibold text-ink-800">
        Reviews {reviews.length > 0 && `(${reviews.length})`}
      </h2>

      {isAuthenticated && user?.role === "client" && (
        <form onSubmit={handleSubmit} className="mt-5 rounded-xl bg-ink-50/60 p-4">
          <p className="text-[0.85rem] font-medium text-ink-600">Leave a review</p>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoverRating || rating) ? "fill-brass-400 text-brass-400" : "text-ink-200"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
          <TextAreaField
            className="mt-3"
            placeholder="How was your experience working with them?"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {error && <p className="mt-1 text-[0.8rem] text-rust-500">{error}</p>}
          <Button type="submit" size="sm" className="mt-3" disabled={submitting}>
            {submitting ? "Submitting\u2026" : "Submit review"}
          </Button>
        </form>
      )}

      <div className="mt-6 flex flex-col gap-5">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Spinner className="h-5 w-5" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-[0.875rem] text-ink-400">No reviews yet. Be the first to work with them.</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b border-ink-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-[0.75rem] font-semibold text-indigo-700">
                    {review.client?.name?.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="text-[0.875rem] font-semibold text-ink-700">{review.client?.name}</span>
                </div>
                <span className="text-[0.8rem] text-ink-300">{formatRelativeTime(review.createdAt)}</span>
              </div>
              <div className="mt-2 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${star <= review.rating ? "fill-brass-400 text-brass-400" : "text-ink-200"}`}
                    strokeWidth={0}
                  />
                ))}
              </div>
              {review.comment && <p className="mt-2 text-[0.9rem] text-ink-600">{review.comment}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
