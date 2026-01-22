import './QuestShield.css'

interface QuestShieldProps {
  level?: number
  icon?: string
  isTracked?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function QuestShield({ level, icon, isTracked, size = 'md' }: QuestShieldProps) {
  return (
    <div className={`quest-shield quest-shield--${size} ${isTracked ? 'quest-shield--tracked' : ''}`}>
      <svg className="quest-shield__bg" viewBox="0 0 40 48" fill="none">
        {/* Shield shape */}
        <path
          d="M20 2L4 8V24C4 34 12 42 20 46C28 42 36 34 36 24V8L20 2Z"
          fill="url(#shieldGradient)"
          stroke="url(#shieldStroke)"
          strokeWidth="1.5"
        />
        {/* Inner highlight */}
        <path
          d="M20 6L8 10V24C8 32 14 38 20 42C26 38 32 32 32 24V10L20 6Z"
          fill="url(#shieldInner)"
          opacity="0.5"
        />
        <defs>
          <linearGradient id="shieldGradient" x1="20" y1="2" x2="20" y2="46">
            <stop offset="0%" stopColor="#a52a2a" />
            <stop offset="50%" stopColor="#8b2323" />
            <stop offset="100%" stopColor="#5c1818" />
          </linearGradient>
          <linearGradient id="shieldStroke" x1="20" y1="2" x2="20" y2="46">
            <stop offset="0%" stopColor="#d4a373" />
            <stop offset="50%" stopColor="#8b7355" />
            <stop offset="100%" stopColor="#5c4d3d" />
          </linearGradient>
          <linearGradient id="shieldInner" x1="20" y1="6" x2="20" y2="42">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
      
      {icon && (
        <span className="quest-shield__icon">{icon}</span>
      )}
      
      {isTracked && (
        <div className="quest-shield__tracked-indicator" title="Tracked Quest">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
      )}
      
      {level !== undefined && (
        <span className="quest-shield__level">{level}</span>
      )}
    </div>
  )
}

