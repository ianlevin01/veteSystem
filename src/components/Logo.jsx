import "./Logo.css";

function Logo({ size = "md" }) {
  return (
    <div className={`logo logo-${size}`}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="13.5" r="5.5" fill="currentColor" opacity="0.15" />
        <circle cx="12" cy="13.5" r="3.2" fill="currentColor" />
        <circle cx="5.5" cy="8" r="2" fill="currentColor" />
        <circle cx="18.5" cy="8" r="2" fill="currentColor" />
        <circle cx="8" cy="4.2" r="1.7" fill="currentColor" />
        <circle cx="16" cy="4.2" r="1.7" fill="currentColor" />
      </svg>
      <span>VeteSystem</span>
    </div>
  );
}

export default Logo;
