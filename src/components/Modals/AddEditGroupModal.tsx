import { useState } from 'react'
import { useQuests } from '../../context/QuestContext'
import Modal from './Modal'
import type { QuestGroup } from '../../types/quest.types'

const GROUP_COLORS = [
  '#c4a258', // Gold
  '#a89a7c', // Cream
  '#8b2323', // Red
  '#4a7c4a', // Green
  '#4a6a8c', // Blue
  '#8b6914', // Bronze
  '#6b4e71', // Purple
  '#5c7c5c', // Forest
  '#8c6b4a', // Brown
  '#7c5a5a', // Dusty Rose
]

const GROUP_ICONS = ['📋', '⚔️', '🎯', '📚', '🏠', '💼', '🎮', '🎨', '🔧', '💡', '🌟', '🎭']

interface AddEditGroupModalProps {
  group: QuestGroup | null
  onSave: (group: QuestGroup) => void
  onDelete?: () => void
  onClose: () => void
}

export default function AddEditGroupModal({
  group,
  onSave,
  onDelete,
  onClose,
}: AddEditGroupModalProps) {
  const { state } = useQuests()
  const isEditing = !!group

  const [name, setName] = useState(group?.name || '')
  const [icon, setIcon] = useState(group?.icon || '')
  const [color, setColor] = useState(group?.color || GROUP_COLORS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) return

    // Calculate order for new groups (before Completed/Failed)
    const maxOrder = Math.max(
      ...state.groups
        .filter((g) => g.id !== 'completed' && g.id !== 'failed')
        .map((g) => g.order),
      -1
    )

    const groupData: QuestGroup = {
      id: group?.id || `group-${Date.now()}`,
      name: name.trim(),
      icon: icon || undefined,
      color,
      order: group?.order ?? maxOrder + 1,
      isCollapsed: group?.isCollapsed ?? false,
      isDefault: group?.isDefault,
    }

    onSave(groupData)
  }

  return (
    <Modal title={isEditing ? 'Edit Quest Group' : 'New Quest Group'} onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="group-name">Group Name *</label>
          <input
            id="group-name"
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter group name..."
            required
            autoFocus
          />
        </div>

        {/* Icon picker */}
        <div className="form-group">
          <label className="form-label">Group Icon</label>
          <div className="emoji-picker">
            <button
              type="button"
              className={`emoji-option ${!icon ? 'emoji-option--selected' : ''}`}
              onClick={() => setIcon('')}
            >
              —
            </button>
            {GROUP_ICONS.map((emoji) => (
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

        {/* Color picker */}
        <div className="form-group">
          <label className="form-label">Group Color</label>
          <div className="color-picker">
            {GROUP_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`color-option ${color === c ? 'color-option--selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="form-group">
          <label className="form-label">Preview</label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: 'var(--color-bg-dark)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
          }}>
            <span style={{ 
              fontSize: '1rem',
              width: '24px',
              textAlign: 'center',
            }}>
              {icon || '📁'}
            </span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              color: color,
              textTransform: 'uppercase',
            }}>
              {name || 'Group Name'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          {onDelete && (
            <button type="button" className="btn btn--danger" onClick={onDelete}>
              Delete Group
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button type="button" className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {isEditing ? 'Save Changes' : 'Create Group'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

