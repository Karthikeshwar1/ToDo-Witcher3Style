import type { Quest } from '../../types/quest.types'
import './QuestMetadata.css'

interface QuestMetadataProps {
  quest: Quest
}

export default function QuestMetadata({ quest }: QuestMetadataProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="quest-metadata">
      {quest.location && (
        <div className="quest-metadata__item">
          <div className="quest-metadata__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="quest-metadata__content">
            <span className="quest-metadata__label">Location</span>
            <span className="quest-metadata__value">{quest.location}</span>
          </div>
        </div>
      )}

      {quest.suggestedLevel && (
        <div className="quest-metadata__item">
          <div className="quest-metadata__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="quest-metadata__content">
            <span className="quest-metadata__label">Difficulty</span>
            <span className="quest-metadata__value">Level {quest.suggestedLevel}</span>
          </div>
        </div>
      )}

      {quest.reminder && (
        <div className="quest-metadata__item quest-metadata__item--reminder">
          <div className="quest-metadata__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </div>
          <div className="quest-metadata__content">
            <span className="quest-metadata__label">Reminder</span>
            <span className="quest-metadata__value">{quest.reminder}</span>
          </div>
        </div>
      )}

      <div className="quest-metadata__item">
        <div className="quest-metadata__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div className="quest-metadata__content">
          <span className="quest-metadata__label">Added</span>
          <span className="quest-metadata__value">{formatDate(quest.createdAt)}</span>
          <span className="quest-metadata__subvalue">{formatTime(quest.createdAt)}</span>
        </div>
      </div>

      {quest.completedAt && (
        <div className="quest-metadata__item quest-metadata__item--completed">
          <div className="quest-metadata__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="quest-metadata__content">
            <span className="quest-metadata__label">Completed</span>
            <span className="quest-metadata__value">{formatDate(quest.completedAt)}</span>
          </div>
        </div>
      )}

      {quest.isFailed && (
        <div className="quest-metadata__item quest-metadata__item--failed">
          <div className="quest-metadata__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <div className="quest-metadata__content">
            <span className="quest-metadata__label">Status</span>
            <span className="quest-metadata__value">Failed</span>
          </div>
        </div>
      )}
    </div>
  )
}

