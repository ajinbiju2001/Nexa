interface BrandMarkProps {
  size?: number;
  iconSize?: number;
  radius?: number;
}

export default function BrandMark({
  size = 40,
  iconSize,
  radius = 12,
}: BrandMarkProps) {
  const markSize = iconSize ?? size * 0.56;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background:
          'radial-gradient(circle at 24% 20%, rgba(255,255,255,0.24), transparent 32%), linear-gradient(145deg, #6fffe9 0%, #3a86ff 48%, #ff6bcb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 18px 40px rgba(26, 39, 77, 0.28)',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 1,
          borderRadius: Math.max(radius - 2, 0),
          border: '1px solid rgba(255,255,255,0.16)',
        }}
      />
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1 }}
        aria-hidden="true"
      >
        <path
          d="M15 50V14H23.5L41 35.5V14H49V50H40.8L23 28.2V50H15Z"
          fill="white"
        />
        <path
          d="M19 46V18H22.2L40.8 40.8V18H45V46H41.8L23.2 23.2V46H19Z"
          fill="url(#nexaMarkGlow)"
          fillOpacity="0.28"
        />
        <defs>
          <linearGradient id="nexaMarkGlow" x1="15" y1="14" x2="49" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6FFFE9" />
            <stop offset="0.55" stopColor="#3A86FF" />
            <stop offset="1" stopColor="#FF6BCB" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
