import type { QuestGroup } from '../../types/quest.types'
import './QuestGroupHeader.css'

interface QuestGroupHeaderProps {
  group: QuestGroup
  questCount: number
  isCollapsed: boolean
  onToggle: () => void
  onEdit: (group: QuestGroup) => void
  onAddQuest: (groupId: string) => void
}

export default function QuestGroupHeader({
  group,
  questCount,
  isCollapsed,
  onToggle,
  onEdit,
  onAddQuest,
}: QuestGroupHeaderProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(group)
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddQuest(group.id)
  }

  return (
    <header 
      className={`quest-group-header ${isCollapsed ? 'quest-group-header--collapsed' : ''}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-expanded={!isCollapsed}
    >
      <div className="quest-group-header__left">
        <svg 
          className="quest-group-header__chevron" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        
        <h2 className="quest-group-header__title">
          {group.icon && <span className="quest-group-header__icon">{group.icon}</span>}
          {group.name}
        </h2>
      </div>

      <div className="quest-group-header__right">
        <span 
          className="quest-group-header__count"
          style={{ color: group.color }}
        >
          {questCount}
        </span>
        
        <div className="quest-group-header__actions">
          <button
            className="quest-group-header__btn"
            onClick={handleAdd}
            title="Add quest to this group"
            aria-label="Add quest"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          
          {!group.isDefault && (
            <button
              className="quest-group-header__btn"
              onClick={handleEdit}
              title="Edit group"
              aria-label="Edit group"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Accent line */}
      <div 
        className="quest-group-header__accent"
        style={{ backgroundColor: group.color }}
      />
    </header>
  )
}

