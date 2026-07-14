import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Briefcase, CheckCircle2, ChevronLeft, ChevronRight, Clock, MapPin, MessageCircle, Phone, X } from "lucide-react";
import { workerApi } from "../api/workers";
import { chatApi } from "../api/misc";
import { useAuth } from "../context/AuthContext";
import { getTradeIcon } from "../utils/tradeIcons";
import { formatNaira } from "../utils/format";
import { RatingStars, VerifiedBadge, PageSpinner } from "../components/ui/Badges";
import Button from "../components/ui/Button";
import ReviewsSection from "../components/workers/ReviewsSection";

export default function WorkerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [avatarExpanded, setAvatarExpanded] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    workerApi
      .getById(id)
      .then(({ data }) => setProfile(data.profile))
      .catch(() => setProfile(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleMessage() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/workers/${id}` } } });
      return;
    }
    setStartingChat(true);
    try {
      const { data } = await chatApi.getOrCreateConversation(profile.user._id);
      navigate(`/messages/${data.conversation._id}`);
    } catch (err) {
      // surfaced inline rather than blocking navigation entirely
    } finally {
      setStartingChat(false);
    }
  }

  if (isLoading) return <PageSpinner />;
  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-[1.5rem] font-semibold text-ink-800">Worker not found</h1>
        <p className="mt-2 text-ink-400">This profile may have been removed or unpublished.</p>
        <Button className="mt-6" onClick={() => navigate("/workers")}>
          Browse other workers
        </Button>
      </div>
    );
  }

  const TradeIcon = getTradeIcon(profile.trade);
  const photos = profile.photos?.length ? profile.photos : null;
  const hasPhone = Boolean(profile.user?.phone);
  const whatsappNumber = hasPhone ? profile.user.phone.replace("+", "") : null;
  const isOwnProfile = user?._id === profile.user?._id;

  return (
    <div className="bg-bone py-10 sm:py-12">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main column */}
          <div className="flex flex-col gap-6">
            {/* Header card */}
            <div className="overflow-hidden rounded-card border border-ink-100 bg-white">
              {photos ? (
                <div>
                  <div className="group relative aspect-[16/9] w-full bg-ink-100">
                    <img src={photos[activePhoto].url} alt={photos[activePhoto].caption || profile.trade} className="h-full w-full object-cover" />

                    {photos.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setActivePhoto((i) => (i === 0 ? photos.length - 1 : i - 1))}
                          aria-label="Previous photo"
                          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/50 text-bone transition-opacity hover:bg-ink-900/70 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePhoto((i) => (i === photos.length - 1 ? 0 : i + 1))}
                          aria-label="Next photo"
                          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/50 text-bone transition-opacity hover:bg-ink-900/70 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
                        </button>

                        <span className="absolute bottom-3 right-3 rounded-full bg-ink-900/60 px-2.5 py-1 text-[0.75rem] font-medium text-bone">
                          {activePhoto + 1} / {photos.length}
                        </span>
                      </>
                    )}
                  </div>
                  {photos[activePhoto].caption && (
                    <p className="border-t border-ink-100 px-4 py-3 text-[0.875rem] text-ink-600">
                      {photos[activePhoto].caption}
                    </p>
                  )}
                  {photos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto p-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {photos.map((p, i) => (
                        <button
                          key={p._id || i}
                          type="button"
                          onClick={() => setActivePhoto(i)}
                          title={p.caption || undefined}
                          className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 ${
                            i === activePhoto ? "border-indigo-600" : "border-transparent"
                          }`}
                        >
                          <img src={p.url} alt={p.caption || `Portfolio photo ${i + 1}`} className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex aspect-[16/9] w-full items-center justify-center bg-indigo-50">
                  <TradeIcon className="h-12 w-12 text-indigo-300" strokeWidth={1.5} />
                </div>
              )}

              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => profile.user?.avatarUrl && setAvatarExpanded(true)}
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-indigo-100 ${
                        profile.user?.avatarUrl ? "cursor-zoom-in" : "cursor-default"
                      }`}
                      aria-label={profile.user?.avatarUrl ? "View full photo" : undefined}
                    >
                      {profile.user?.avatarUrl ? (
                        <img src={profile.user.avatarUrl} alt={profile.user.name} className="h-full w-full object-cover transition-transform hover:scale-105" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[1.2rem] font-semibold text-indigo-600">
                          {profile.user?.name?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </button>
                    <div>
                      <h1 className="font-display text-[1.4rem] font-semibold text-ink-800">{profile.user?.name}</h1>
                      <p className="text-[0.95rem] font-medium text-brass-600">{profile.trade}</p>
                      <div className="mt-1 flex items-center gap-1 text-[0.825rem] text-ink-400">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                        {profile.city}, {profile.state}
                      </div>
                    </div>
                  </div>
                  <VerifiedBadge status={profile.verificationStatus} />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <RatingStars rating={profile.ratingAverage} reviewCount={profile.ratingCount} size="md" />
                </div>

                {profile.tagline && <p className="mt-4 text-[0.95rem] text-ink-600">{profile.tagline}</p>}
                {profile.bio && <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-500">{profile.bio}</p>}

                {profile.skills?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-ink-50 px-3 py-1.5 text-[0.8rem] font-medium text-ink-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 grid grid-cols-3 gap-4 border-t border-ink-100 pt-5 text-center font-mono">
                  <div>
                    <p className="flex items-center justify-center gap-1.5 text-[1.05rem] font-semibold text-ink-800">
                      <Briefcase className="h-3.5 w-3.5 text-ink-300" strokeWidth={2} />
                      {profile.jobsCompletedCount}
                    </p>
                    <p className="mt-1 font-body text-[0.75rem] text-ink-300">jobs done</p>
                  </div>
                  <div className="border-x border-ink-100">
                    <p className="text-[1.05rem] font-semibold text-ink-800">{profile.yearsExperience}y</p>
                    <p className="mt-1 font-body text-[0.75rem] text-ink-300">experience</p>
                  </div>
                  <div>
                    <p className="flex items-center justify-center gap-1.5 text-[1.05rem] font-semibold text-ink-800">
                      <Clock className="h-3.5 w-3.5 text-ink-300" strokeWidth={2} />
                    </p>
                    <p className="mt-1 font-body text-[0.75rem] text-ink-300">{profile.responseTimeLabel}</p>
                  </div>
                </div>
              </div>
            </div>

            <ReviewsSection workerId={profile._id} />
          </div>

          {/* Sticky contact sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card border border-ink-100 bg-white p-6">
              <p className="font-mono text-[1.4rem] font-semibold text-ink-800">
                From {formatNaira(profile.startingPrice)}
              </p>
              <p className="text-[0.825rem] text-ink-400">{profile.priceUnit}</p>

              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-verified-50 px-3 py-1 text-[0.8rem] font-medium text-verified-600">
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                {profile.availability}
              </div>

              {!isOwnProfile && (
                <div className="mt-5 flex flex-col gap-2.5">
                  <Button variant="primary" size="md" className="w-full" onClick={handleMessage} disabled={startingChat}>
                    <MessageCircle className="h-4 w-4" strokeWidth={2} />
                    {startingChat ? "Starting chat\u2026" : "Message"}
                  </Button>
                  {hasPhone && (
                    <a href={`tel:${profile.user.phone}`} className="w-full">
                      <Button variant="outline" size="md" className="w-full">
                        <Phone className="h-4 w-4" strokeWidth={2} />
                        Call
                      </Button>
                    </a>
                  )}
                  {hasPhone && (
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="brass" size="md" className="w-full">
                        Chat on WhatsApp
                      </Button>
                    </a>
                  )}
                </div>
              )}

              {isOwnProfile && (
                <Button variant="outline" size="md" className="mt-5 w-full" onClick={() => navigate("/dashboard")}>
                  Edit your profile
                </Button>
              )}

              <p className="mt-4 text-[0.8rem] leading-relaxed text-ink-300">
                Oru Aka connects you directly with this professional. Agree on price and details
                before work begins.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {avatarExpanded && profile.user?.avatarUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/80 p-6"
          onClick={() => setAvatarExpanded(false)}
        >
          <button
            type="button"
            onClick={() => setAvatarExpanded(false)}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-bone/15 text-bone transition-colors hover:bg-bone/25"
          >
            <X className="h-5 w-5" strokeWidth={2.25} />
          </button>
          <img
            src={profile.user.avatarUrl}
            alt={profile.user.name}
            onClick={(e) => e.stopPropagation()}
            className="h-[min(80vw,28rem)] w-[min(80vw,28rem)] rounded-full object-cover shadow-card-lg"
          />
        </div>
      )}
    </div>
  );
}
