import { useQuests } from '../../context/QuestContext'
import type { Quest, Subtask } from '../../types/quest.types'
import './SubtaskList.css'

interface SubtaskListProps {
  quest: Quest
}

export default function SubtaskList({ quest }: SubtaskListProps) {
  const { dispatch } = useQuests()

  const handleToggle = (subtask: Subtask) => {
    dispatch({
      type: 'TOGGLE_SUBTASK',
      payload: { questId: quest.id, subtaskId: subtask.id },
    })
  }

  if (quest.subtasks.length === 0) {
    return (
      <div className="subtask-list subtask-list--empty">
        <p>No objectives defined for this quest.</p>
      </div>
    )
  }

  return (
    <ul className="subtask-list">
      {quest.subtasks.map((subtask) => (
        <li
          key={subtask.id}
          className={`subtask-item ${subtask.isCompleted ? 'subtask-item--completed' : ''}`}
        >
          <button
            className="subtask-checkbox"
            onClick={() => handleToggle(subtask)}
            aria-label={subtask.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <svg viewBox="0 0 24 24" fill="none">
              {/* Witcher-style diamond checkbox */}
              <path
                className="subtask-checkbox__border"
                d="M12 2L22 12L12 22L2 12L12 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              {subtask.isCompleted && (
                <path
                  className="subtask-checkbox__check"
                  d="M8 12L11 15L16 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>
          <span className="subtask-text">{subtask.text}</span>
        </li>
      ))}
    </ul>
  )
}

