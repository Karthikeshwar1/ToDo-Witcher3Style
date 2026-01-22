import { useQuests } from '../../context/QuestContext'
import QuestShield from '../LeftPanel/QuestShield'
import SubtaskList from './SubtaskList'
import ExpansionBadge from './ExpansionBadge'
import type { Quest } from '../../types/quest.types'
import './QuestDetails.css'

interface QuestDetailsProps {
  quest: Quest | null
  onEdit: (quest: Quest) => void
}

export default function QuestDetails({ quest, onEdit }: QuestDetailsProps) {
  const { getGroupById, dispatch } = useQuests()

  if (!quest) {
    return (
      <div className="quest-details quest-details--empty">
        <div className="quest-details__empty-content">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <h2>No Quest Selected</h2>
          <p>Select a quest from the list to view its details and objectives.</p>
        </div>
      </div>
    )
  }

  const group = getGroupById(quest.groupId)
  const completedCount = quest.subtasks.filter((st) => st.isCompleted).length
  const totalCount = quest.subtasks.length
  const allCompleted = totalCount > 0 && completedCount === totalCount

  const handleComplete = () => {
    dispatch({
      type: 'MOVE_QUEST_TO_GROUP',
      payload: { questId: quest.id, groupId: 'completed' },
    })
  }

  const handleFail = () => {
    dispatch({
      type: 'MOVE_QUEST_TO_GROUP',
      payload: { questId: quest.id, groupId: 'failed' },
    })
  }

  const handleTrack = () => {
    dispatch({ type: 'TRACK_QUEST', payload: quest.id })
  }

  return (
    <div className="quest-details">
      {/* Header with shield and title */}
      <header className="quest-details__header">
        <div className="quest-details__shield">
          <QuestShield
            level={quest.suggestedLevel}
            icon={quest.icon}
            isTracked={quest.isTracked}
            size="lg"
          />
        </div>

        <div className="quest-details__title-block">
          <h1 className="quest-details__title">{quest.title}</h1>
          
          <div className="quest-details__meta">
            {quest.location && (
              <span className="quest-details__location">{quest.location}</span>
            )}
            {quest.suggestedLevel && (
              <span className="quest-details__level">
                Suggested Level {quest.suggestedLevel}
              </span>
            )}
          </div>
        </div>

        <div className="quest-details__actions">
          <button
            className={`quest-action-btn ${quest.isTracked ? 'quest-action-btn--active' : ''}`}
            onClick={handleTrack}
            title={quest.isTracked ? 'Untrack' : 'Track Quest'}
          >
            <svg viewBox="0 0 24 24" fill={quest.isTracked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </button>
          
          <button
            className="quest-action-btn"
            onClick={() => onEdit(quest)}
            title="Edit Quest"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Divider */}
      <div className="quest-details__divider divider-worn" />

      {/* Objectives */}
      <section className="quest-details__objectives">
        <h2 className="quest-details__section-title">
          Objectives
          {totalCount > 0 && (
            <span className="quest-details__progress">
              {completedCount}/{totalCount}
            </span>
          )}
        </h2>
        
        <SubtaskList quest={quest} />
      </section>

      {/* Completion prompt */}
      {allCompleted && quest.groupId !== 'completed' && quest.groupId !== 'failed' && (
        <div className="quest-details__complete-prompt animate-fadeIn">
          <p>All objectives completed!</p>
          <div className="quest-details__complete-actions">
            <button className="complete-btn complete-btn--success" onClick={handleComplete}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Complete Quest
            </button>
            <button className="complete-btn complete-btn--fail" onClick={handleFail}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              Mark as Failed
            </button>
          </div>
        </div>
      )}

      {/* Category badge */}
      {group && (
        <div className="quest-details__badge">
          <ExpansionBadge text={group.name} color={group.color} />
        </div>
      )}
    </div>
  )
}

