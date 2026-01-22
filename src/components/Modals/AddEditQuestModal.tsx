import { useState, useEffect } from 'react'
import { useQuests } from '../../context/QuestContext'
import Modal from './Modal'
import type { Quest, Subtask } from '../../types/quest.types'

const QUEST_ICONS = ['⚔️', '🗡️', '🛡️', '🏰', '🐉', '💀', '👑', '🔮', '📜', '🍷', '🃏', '💎', '🌙', '⭐', '🔥']

interface AddEditQuestModalProps {
  quest: Quest | null
  defaultGroupId: string | null
  onSave: (quest: Quest) => void
  onDelete?: () => void
  onClose: () => void
}

export default function AddEditQuestModal({
  quest,
  defaultGroupId,
  onSave,
  onDelete,
  onClose,
}: AddEditQuestModalProps) {
  const { state } = useQuests()
  const isEditing = !!quest

  const [title, setTitle] = useState(quest?.title || '')
  const [groupId, setGroupId] = useState(quest?.groupId || defaultGroupId || 'secondary')
  const [location, setLocation] = useState(quest?.location || '')
  const [suggestedLevel, setSuggestedLevel] = useState(quest?.suggestedLevel?.toString() || '')
  const [icon, setIcon] = useState(quest?.icon || '')
  const [description, setDescription] = useState(quest?.description || '')
  const [subtasks, setSubtasks] = useState<Subtask[]>(quest?.subtasks || [])
  const [reminder, setReminder] = useState(quest?.reminder || '')
  const [newSubtask, setNewSubtask] = useState('')

  // Filter out completed/failed groups for new quests
  const availableGroups = state.groups.filter(
    (g) => isEditing || (g.id !== 'completed' && g.id !== 'failed')
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) return

    const questData: Quest = {
      id: quest?.id || `quest-${Date.now()}`,
      groupId,
      title: title.trim(),
      location: location.trim() || undefined,
      suggestedLevel: suggestedLevel ? parseInt(suggestedLevel, 10) : undefined,
      icon: icon || undefined,
      description: description.trim(),
      subtasks,
      reminder: reminder.trim() || undefined,
      createdAt: quest?.createdAt || new Date().toISOString(),
      completedAt: quest?.completedAt,
      isFailed: quest?.isFailed,
      isTracked: quest?.isTracked,
    }

    onSave(questData)
  }

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([
        ...subtasks,
        { id: `st-${Date.now()}`, text: newSubtask.trim(), isCompleted: false },
      ])
      setNewSubtask('')
    }
  }

  const handleRemoveSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== subtaskId))
  }

  const handleSubtaskChange = (subtaskId: string, text: string) => {
    setSubtasks(subtasks.map((st) => (st.id === subtaskId ? { ...st, text } : st)))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      if (e.target === document.querySelector('.subtask-input')) {
        e.preventDefault()
        handleAddSubtask()
      }
    }
  }

  return (
    <Modal title={isEditing ? 'Edit Quest' : 'New Quest'} onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        {/* Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="quest-title">Quest Title *</label>
          <input
            id="quest-title"
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter quest title..."
            required
            autoFocus
          />
        </div>

        {/* Group and Level row */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="quest-group">Quest Group</label>
            <select
              id="quest-group"
              className="form-select"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            >
              {availableGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.icon} {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="quest-level">Difficulty Level</label>
            <input
              id="quest-level"
              type="number"
              className="form-input"
              value={suggestedLevel}
              onChange={(e) => setSuggestedLevel(e.target.value)}
              placeholder="1-100"
              min="1"
              max="100"
            />
          </div>
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label" htmlFor="quest-location">Location</label>
          <input
            id="quest-location"
            type="text"
            className="form-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where does this quest take place?"
          />
        </div>

        {/* Icon picker */}
        <div className="form-group">
          <label className="form-label">Quest Icon</label>
          <div className="emoji-picker">
            <button
              type="button"
              className={`emoji-option ${!icon ? 'emoji-option--selected' : ''}`}
              onClick={() => setIcon('')}
            >
              —
            </button>
            {QUEST_ICONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`emoji-option ${icon === emoji ? 'emoji-option--selected' : ''}`}
                onClick={() => setIcon(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="quest-description">Description</label>
          <textarea
            id="quest-description"
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write the quest journal entry..."
          />
        </div>

        {/* Subtasks/Objectives */}
        <div className="form-group">
          <label className="form-label">Objectives</label>
          <div className="subtask-form-list">
            {subtasks.map((subtask) => (
              <div key={subtask.id} className="subtask-form-item">
                <input
                  type="text"
                  className="form-input"
                  value={subtask.text}
                  onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                  placeholder="Objective..."
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(subtask.id)}
                  aria-label="Remove objective"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="subtask-form-item">
              <input
                type="text"
                className="form-input subtask-input"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add new objective..."
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                aria-label="Add objective"
                style={{ color: 'var(--color-accent-green)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Reminder */}
        <div className="form-group">
          <label className="form-label" htmlFor="quest-reminder">Reminder Note</label>
          <input
            id="quest-reminder"
            type="text"
            className="form-input"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            placeholder="e.g., Complete by Friday"
          />
        </div>

        {/* Actions */}
        <div className="form-actions">
          {onDelete && (
            <button type="button" className="btn btn--danger" onClick={onDelete}>
              Delete
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button type="button" className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {isEditing ? 'Save Changes' : 'Create Quest'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

