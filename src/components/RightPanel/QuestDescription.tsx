import QuestMetadata from './QuestMetadata'
import type { Quest } from '../../types/quest.types'
import './QuestDescription.css'

interface QuestDescriptionProps {
  quest: Quest | null
  onEdit: (quest: Quest) => void
}

export default function QuestDescription({ quest, onEdit }: QuestDescriptionProps) {
  if (!quest) {
    return (
      <div className="quest-description quest-description--empty">
        <div className="quest-description__empty-illustration">
          <svg viewBox="0 0 120 120" fill="none">
            {/* Scroll/parchment illustration */}
            <path
              d="M30 20h60c5 0 10 5 10 10v60c0 5-5 10-10 10H30c-5 0-10-5-10-10V30c0-5 5-10 10-10z"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            <line x1="35" y1="40" x2="85" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.2" />
            <line x1="35" y1="50" x2="75" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.2" />
            <line x1="35" y1="60" x2="80" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.2" />
            <line x1="35" y1="70" x2="65" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.2" />
            <line x1="35" y1="80" x2="70" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          </svg>
        </div>
        <p className="quest-description__empty-text">
          Quest details will appear here when you select a quest.
        </p>
      </div>
    )
  }

  return (
    <div className="quest-description">
      <header className="quest-description__header">
        <h2 className="quest-description__title">Quest Journal</h2>
        <button
          className="quest-description__edit-btn"
          onClick={() => onEdit(quest)}
          title="Edit quest details"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </header>

      <article className="quest-description__content">
        {quest.description ? (
          <p className="quest-description__text">{quest.description}</p>
        ) : (
          <p className="quest-description__text quest-description__text--empty">
            No description has been written for this quest yet. 
            Click the edit button to add one.
          </p>
        )}
      </article>

      <QuestMetadata quest={quest} />

      {/* Decorative bottom element */}
      <div className="quest-description__flourish">
        <svg viewBox="0 0 100 20" fill="none">
          <path
            d="M0 10h30 M70 10h30 M40 10c5-8 15-8 20 0"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="50" cy="10" r="3" fill="currentColor" />
        </svg>
      </div>
    </div>
  )
}

