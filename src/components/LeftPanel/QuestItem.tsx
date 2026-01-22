import { useQuests } from '../../context/QuestContext'
import QuestShield from './QuestShield'
import type { Quest } from '../../types/quest.types'
import './QuestItem.css'

interface QuestItemProps {
  quest: Quest
  onEdit: (quest: Quest) => void
}

export default function QuestItem({ quest, onEdit }: QuestItemProps) {
  const { state, dispatch, getGroupById } = useQuests()
  const isSelected = state.selectedQuestId === quest.id
  const group = getGroupById(quest.groupId)

  const handleClick = () => {
    dispatch({ type: 'SELECT_QUEST', payload: quest.id })
  }

  const handleDoubleClick = () => {
    onEdit(quest)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    // Could implement context menu here
  }

  const handleTrack = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({ type: 'TRACK_QUEST', payload: quest.id })
  }

  const completedSubtasks = quest.subtasks.filter(st => st.isCompleted).length
  const totalSubtasks = quest.subtasks.length
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

  return (
    <article
      className={`quest-item ${isSelected ? 'quest-item--selected' : ''} ${quest.isTracked ? 'quest-item--tracked' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
    >
      <QuestShield
        level={quest.suggestedLevel}
        icon={quest.icon}
        isTracked={quest.isTracked}
        size="md"
      />
      
      <div className="quest-item__content">
        <h3 className="quest-item__title">{quest.title}</h3>
        {quest.location && (
          <span className="quest-item__location">{quest.location}</span>
        )}
        
        {totalSubtasks > 0 && (
          <div className="quest-item__progress">
            <div className="quest-item__progress-bar">
              <div 
                className="quest-item__progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="quest-item__progress-text">
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
        )}
      </div>

      <button
        className={`quest-item__track-btn ${quest.isTracked ? 'quest-item__track-btn--active' : ''}`}
        onClick={handleTrack}
        title={quest.isTracked ? 'Untrack quest' : 'Track quest'}
        aria-label={quest.isTracked ? 'Untrack quest' : 'Track quest'}
      >
        <svg viewBox="0 0 24 24" fill={quest.isTracked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </button>

      {/* Selection indicator */}
      {isSelected && <div className="quest-item__indicator" />}
      
      {/* Group color accent */}
      <div 
        className="quest-item__accent"
        style={{ backgroundColor: group?.color || 'var(--color-text-gold)' }}
      />
    </article>
  )
}

