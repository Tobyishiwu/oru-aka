export function TextField({ label, error, className = "", id, ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-[0.825rem] font-medium text-ink-600">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[0.9rem] text-ink-800 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-brass-300 ${
          error ? "border-rust-500" : "border-ink-100 focus:border-indigo-400"
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-[0.8rem] text-rust-500">{error}</p>}
    </div>
  );
}

export function SelectField({ label, error, className = "", id, children, ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-[0.825rem] font-medium text-ink-600">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[0.9rem] text-ink-800 focus:outline-none focus:ring-2 focus:ring-brass-300 ${
          error ? "border-rust-500" : "border-ink-100 focus:border-indigo-400"
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-[0.8rem] text-rust-500">{error}</p>}
    </div>
  );
}

export function TextAreaField({ label, error, className = "", id, ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-[0.825rem] font-medium text-ink-600">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[0.9rem] text-ink-800 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-brass-300 ${
          error ? "border-rust-500" : "border-ink-100 focus:border-indigo-400"
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-[0.8rem] text-rust-500">{error}</p>}
    </div>
  );
}
