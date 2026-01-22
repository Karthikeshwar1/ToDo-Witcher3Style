import { useState } from 'react'
import { useQuests } from '../../context/QuestContext'
import QuestGroupHeader from './QuestGroupHeader'
import QuestItem from './QuestItem'
import type { Quest, QuestGroup } from '../../types/quest.types'
import './QuestGroupList.css'

interface QuestGroupListProps {
  onAddQuest: (groupId?: string) => void
  onEditQuest: (quest: Quest) => void
  onAddGroup: () => void
  onEditGroup: (group: QuestGroup) => void
}

export default function QuestGroupList({
  onAddQuest,
  onEditQuest,
  onAddGroup,
  onEditGroup,
}: QuestGroupListProps) {
  const { state, dispatch, getQuestsByGroup } = useQuests()
  const [searchFocused, setSearchFocused] = useState(false)

  const sortedGroups = [...state.groups].sort((a, b) => a.order - b.order)

  const handleToggleGroup = (groupId: string) => {
    dispatch({ type: 'TOGGLE_GROUP_COLLAPSE', payload: groupId })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })
  }

  return (
    <div className="quest-group-list">
      {/* Search bar */}
      <div className={`quest-search ${searchFocused ? 'quest-search--focused' : ''}`}>
        <svg className="quest-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="quest-search__input"
          placeholder="Search quests..."
          value={state.searchQuery}
          onChange={handleSearch}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {state.searchQuery && (
          <button
            className="quest-search__clear"
            onClick={() => dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })}
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Quest groups */}
      <div className="quest-groups">
        {sortedGroups.map((group) => {
          const quests = getQuestsByGroup(group.id)
          
          return (
            <div key={group.id} className="quest-group">
              <QuestGroupHeader
                group={group}
                questCount={quests.length}
                isCollapsed={group.isCollapsed}
                onToggle={() => handleToggleGroup(group.id)}
                onEdit={onEditGroup}
                onAddQuest={onAddQuest}
              />
              
              {!group.isCollapsed && (
                <div className="quest-group__items">
                  {quests.length > 0 ? (
                    quests.map((quest) => (
                      <QuestItem
                        key={quest.id}
                        quest={quest}
                        onEdit={onEditQuest}
                      />
                    ))
                  ) : (
                    <div className="quest-group__empty">
                      <span>No quests</span>
                      <button 
                        className="quest-group__add-btn"
                        onClick={() => onAddQuest(group.id)}
                      >
                        Add quest
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add group button */}
      <button className="add-group-btn" onClick={onAddGroup}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>Add Quest Group</span>
      </button>
    </div>
  )
}

