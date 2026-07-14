export default function AdireDivider({ className = "", onDark = false }) {
  return (
    <div
      className={`${onDark ? "adire-divider--on-dark" : "adire-divider"} ${className}`}
      role="presentation"
      aria-hidden="true"
    />
  );
}
