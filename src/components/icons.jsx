function iconProps(size, className) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };
}

export function IconHome({ size = 18, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function IconPaw({ size = 18, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <circle cx="12" cy="15.2" r="4.2" />
      <circle cx="5.7" cy="9" r="1.9" />
      <circle cx="18.3" cy="9" r="1.9" />
      <circle cx="8.6" cy="4.6" r="1.7" />
      <circle cx="15.4" cy="4.6" r="1.7" />
    </svg>
  );
}

export function IconBell({ size = 18, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="M6 9a6 6 0 0 1 12 0c0 3.2 1 4.6 1.6 5.4a1 1 0 0 1-.8 1.6H5.2a1 1 0 0 1-.8-1.6C5 13.6 6 12.2 6 9Z" />
      <path d="M9.5 18.5a2.5 2.5 0 0 0 5 0" />
    </svg>
  );
}

export function IconPlus({ size = 18, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconSearch({ size = 18, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function IconMenu({ size = 22, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconClose({ size = 22, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function IconArrowLeft({ size = 18, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function IconCheck({ size = 16, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="M5 12.5 10 17l9-10" />
    </svg>
  );
}

export function IconTrash({ size = 16, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="M4 7h16" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.7 12.1a2 2 0 0 1-2 1.9H9.7a2 2 0 0 1-2-1.9L7 7" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconUser({ size = 18, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export function IconClipboard({ size = 18, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <rect x="5.5" y="4.5" width="13" height="17" rx="2" />
      <path d="M9 4.5V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v.5" />
      <path d="M9 11.5h6M9 15.5h6M9 7.5h6" />
    </svg>
  );
}

export function IconSyringe({ size = 18, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="m18 3 3 3" />
      <path d="M15.5 5.5 19 9l-9.5 9.5-4-4L15.5 5.5Z" />
      <path d="m9 12 3 3" />
      <path d="m6.5 14.5-3.5 3.5" />
      <path d="M12.5 3.5 15 6" />
    </svg>
  );
}

export function IconPaperclip({ size = 16, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="M20 11.5 12.5 19a4 4 0 0 1-5.7-5.7L14.5 5.6a2.7 2.7 0 0 1 3.8 3.8L10.6 17a1.3 1.3 0 0 1-1.9-1.9l6.8-6.8" />
    </svg>
  );
}

export function IconUpload({ size = 18, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4.5 15v3.5A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5V15" />
    </svg>
  );
}

export function IconSparkle({ size = 18, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="m12 8-1.4 2.6L8 12l2.6 1.4L12 16l1.4-2.6L16 12l-2.6-1.4Z" />
    </svg>
  );
}

export function IconInbox({ size = 36, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="M4 12h4.5l1.2 2.4a2 2 0 0 0 1.8 1.1h1a2 2 0 0 0 1.8-1.1L15.5 12H20" />
      <path d="M5.5 6.5h13l1.5 5.7V18a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 18v-5.8l1.5-5.7Z" />
    </svg>
  );
}

export function IconAlertTriangle({ size = 36, className }) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="M12 4 3 20h18L12 4Z" />
      <path d="M12 10v4" />
      <path d="M12 17.2v.1" />
    </svg>
  );
}
