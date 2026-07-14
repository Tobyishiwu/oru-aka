const VARIANTS = {
  primary: "bg-indigo-700 text-bone hover:bg-indigo-800",
  brass: "bg-brass-400 text-indigo-900 hover:bg-brass-300",
  outline: "border border-ink-200 text-ink-700 hover:border-indigo-400 hover:text-indigo-700",
  ghost: "text-ink-500 hover:bg-ink-50 hover:text-ink-800",
  danger: "bg-rust-500 text-bone hover:bg-rust-600",
};

const SIZES = {
  sm: "px-3.5 py-2 text-[0.8rem]",
  md: "px-5 py-2.5 text-[0.9rem]",
  lg: "px-6 py-3.5 text-[0.95rem]",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
