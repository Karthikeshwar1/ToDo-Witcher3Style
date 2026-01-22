import './ExpansionBadge.css'

interface ExpansionBadgeProps {
  text: string
  color?: string
}

export default function ExpansionBadge({ text, color }: ExpansionBadgeProps) {
  return (
    <div className="expansion-badge" style={{ '--badge-color': color } as React.CSSProperties}>
      <div className="expansion-badge__border">
        <svg viewBox="0 0 200 40" preserveAspectRatio="none">
          {/* Ornate border shape */}
          <path
            d="M10,20 L20,5 L180,5 L190,20 L180,35 L20,35 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          {/* Corner decorations */}
          <circle cx="20" cy="5" r="2" fill="currentColor" />
          <circle cx="180" cy="5" r="2" fill="currentColor" />
          <circle cx="20" cy="35" r="2" fill="currentColor" />
          <circle cx="180" cy="35" r="2" fill="currentColor" />
          {/* Side accents */}
          <path d="M5,20 L10,20" stroke="currentColor" strokeWidth="1" />
          <path d="M190,20 L195,20" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <span className="expansion-badge__text">{text}</span>
    </div>
  )
}

