export function FlexPortrait({ caption }: { caption: string }) {
  return (
    <div className="video-frame mx-auto w-full max-w-sm aspect-[4/3] bg-ink relative overflow-hidden">
      <svg
        viewBox="0 0 300 225"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMax slice"
        role="img"
        aria-label="Archive footage silhouette of Flex Montage, inventor of the montage"
      >
        <defs>
          <linearGradient id="flexGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff2d95" />
            <stop offset="100%" stopColor="#1be7ff" />
          </linearGradient>
        </defs>
        <rect width="300" height="225" fill="#0a0a0a" />
        <circle cx="150" cy="78" r="34" fill="url(#flexGrad)" opacity="0.85" />
        <path
          d="M150 112c-46 0-78 24-86 70-2 14 6 22 20 22h132c14 0 22-8 20-22-8-46-40-70-86-70Z"
          fill="url(#flexGrad)"
          opacity="0.85"
        />
        <path
          d="M64 150c-18 10-26 28-22 46M236 150c18 10 26 28 22 46"
          stroke="url(#flexGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div className="absolute top-2 left-2">
        <span className="rec-badge text-sm">
          <span className="rec-dot" /> REC
        </span>
      </div>
      <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between text-vhs-yellow text-xs sm:text-sm tracking-wide">
        <span>{caption}</span>
        <span>00:08:42</span>
      </div>
    </div>
  );
}
