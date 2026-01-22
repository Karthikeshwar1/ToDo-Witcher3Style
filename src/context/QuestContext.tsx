import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { QuestState, QuestAction, QuestGroup, Quest } from '../types/quest.types'

const STORAGE_KEY = 'witcher-quest-log-v2'

// Default groups
const defaultGroups: QuestGroup[] = [
  { id: 'main', name: 'Priority Tasks', order: 0, isCollapsed: false, isDefault: true, color: '#c4a258' },
  { id: 'secondary', name: 'General Tasks', order: 1, isCollapsed: false, isDefault: true, color: '#a89a7c' },
  { id: 'completed', name: 'Completed', order: 98, isCollapsed: true, isDefault: true, color: '#4a7c4a' },
  { id: 'failed', name: 'Cancelled', order: 99, isCollapsed: true, isDefault: true, color: '#8b2323' },
]

// Sample real-world tasks
const sampleQuests: Quest[] = [
  {
    id: 'quest-1',
    groupId: 'main',
    title: 'Q4 Financial Report',
    location: 'Office',
    suggestedLevel: 85,
    description: 'The quarterly financial report is due by end of month. This comprehensive document must include revenue analysis, expense breakdowns, profit margins, and year-over-year comparisons. The board expects detailed insights into our fiscal performance and projections for the upcoming quarter.',
    subtasks: [
      { id: 'st-1', text: 'Gather all revenue data from accounting.', isCompleted: true },
      { id: 'st-2', text: 'Compile expense reports from all departments.', isCompleted: false },
      { id: 'st-3', text: 'Create visualizations and charts.', isCompleted: false },
      { id: 'st-4', text: 'Write executive summary.', isCompleted: false },
    ],
    createdAt: new Date().toISOString(),
    icon: '📊',
  },
  {
    id: 'quest-2',
    groupId: 'main',
    title: 'Website Redesign Launch',
    location: 'Remote',
    suggestedLevel: 90,
    description: 'Our company website needs a complete overhaul. The current design is outdated and not mobile-friendly. We need to modernize the look, improve user experience, and ensure the site is optimized for search engines. Coordinate with the design team and developers.',
    subtasks: [
      { id: 'st-5', text: 'Review and approve final mockups.', isCompleted: true },
      { id: 'st-6', text: 'Test all pages on mobile devices.', isCompleted: false },
      { id: 'st-7', text: 'Set up redirects for old URLs.', isCompleted: false },
    ],
    createdAt: new Date().toISOString(),
    icon: '🌐',
  },
  {
    id: 'quest-3',
    groupId: 'secondary',
    title: 'Dentist Appointment',
    location: 'Downtown Clinic',
    suggestedLevel: 40,
    description: 'Regular six-month dental checkup and cleaning. Remember to bring insurance card and arrive 15 minutes early for paperwork.',
    subtasks: [
      { id: 'st-8', text: 'Confirm appointment time.', isCompleted: true },
      { id: 'st-9', text: 'Bring insurance documentation.', isCompleted: false },
    ],
    createdAt: new Date().toISOString(),
    icon: '🦷',
    reminder: 'Thursday 2:30 PM',
  },
  {
    id: 'quest-4',
    groupId: 'secondary',
    title: 'Grocery Shopping',
    location: 'Whole Foods',
    suggestedLevel: 25,
    description: 'Weekly grocery run. Focus on healthy options and meal prep ingredients for the week ahead.',
    subtasks: [
      { id: 'st-10', text: 'Buy vegetables and fruits.', isCompleted: false },
      { id: 'st-11', text: 'Restock pantry essentials.', isCompleted: false },
      { id: 'st-12', text: 'Get items for weekend dinner party.', isCompleted: false },
    ],
    createdAt: new Date().toISOString(),
    icon: '🛒',
  },
]

const initialState: QuestState = {
  groups: defaultGroups,
  quests: sampleQuests,
  selectedQuestId: 'quest-1',
  searchQuery: '',
}

function questReducer(state: QuestState, action: QuestAction): QuestState {
  switch (action.type) {
    case 'SET_GROUPS':
      return { ...state, groups: action.payload }
    
    case 'ADD_GROUP':
      return { ...state, groups: [...state.groups, action.payload] }
    
    case 'UPDATE_GROUP':
      return {
        ...state,
        groups: state.groups.map((g) =>
          g.id === action.payload.id ? action.payload : g
        ),
      }
    
    case 'DELETE_GROUP':
      return {
        ...state,
        groups: state.groups.filter((g) => g.id !== action.payload),
        quests: state.quests.filter((q) => q.groupId !== action.payload),
      }
    
    case 'TOGGLE_GROUP_COLLAPSE':
      return {
        ...state,
        groups: state.groups.map((g) =>
          g.id === action.payload ? { ...g, isCollapsed: !g.isCollapsed } : g
        ),
      }
    
    case 'SET_QUESTS':
      return { ...state, quests: action.payload }
    
    case 'ADD_QUEST':
      return { ...state, quests: [...state.quests, action.payload] }
    
    case 'UPDATE_QUEST':
      return {
        ...state,
        quests: state.quests.map((q) =>
          q.id === action.payload.id ? action.payload : q
        ),
      }
    
    case 'DELETE_QUEST':
      return {
        ...state,
        quests: state.quests.filter((q) => q.id !== action.payload),
        selectedQuestId: state.selectedQuestId === action.payload ? null : state.selectedQuestId,
      }
    
    case 'SELECT_QUEST':
      return { ...state, selectedQuestId: action.payload }
    
    case 'TOGGLE_SUBTASK': {
      const { questId, subtaskId } = action.payload
      return {
        ...state,
        quests: state.quests.map((q) =>
          q.id === questId
            ? {
                ...q,
                subtasks: q.subtasks.map((st) =>
                  st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
                ),
              }
            : q
        ),
      }
    }
    
    case 'MOVE_QUEST_TO_GROUP': {
      const { questId, groupId } = action.payload
      const isCompleting = groupId === 'completed'
      const isFailing = groupId === 'failed'
      
      return {
        ...state,
        quests: state.quests.map((q) =>
          q.id === questId
            ? {
                ...q,
                groupId,
                completedAt: isCompleting ? new Date().toISOString() : undefined,
                isFailed: isFailing,
              }
            : q
        ),
      }
    }
    
    case 'TRACK_QUEST':
      return {
        ...state,
        quests: state.quests.map((q) => ({
          ...q,
          isTracked: q.id === action.payload ? !q.isTracked : false,
        })),
      }
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    
    case 'LOAD_STATE':
      return action.payload
    
    default:
      return state
  }
}

interface QuestContextValue {
  state: QuestState
  dispatch: React.Dispatch<QuestAction>
  selectedQuest: Quest | null
  getQuestsByGroup: (groupId: string) => Quest[]
  getGroupById: (groupId: string) => QuestGroup | undefined
}

const QuestContext = createContext<QuestContextValue | null>(null)

export function QuestProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(questReducer, initialState, (initial) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as QuestState
        // Merge with defaults to handle any new fields
        return {
          ...initial,
          ...parsed,
          groups: parsed.groups?.length ? parsed.groups : initial.groups,
        }
      }
    } catch (e) {
      console.error('Failed to load state from localStorage:', e)
    }
    return initial
  })

  // Persist to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.error('Failed to save state to localStorage:', e)
    }
  }, [state])

  const selectedQuest = state.quests.find((q) => q.id === state.selectedQuestId) || null

  const getQuestsByGroup = (groupId: string): Quest[] => {
    let quests = state.quests.filter((q) => q.groupId === groupId)
    
    // Apply search filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      quests = quests.filter(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.location?.toLowerCase().includes(query) ||
          q.description.toLowerCase().includes(query)
      )
    }
    
    // Sort: tracked quest first, then by level (descending)
    return quests.sort((a, b) => {
      if (a.isTracked && !b.isTracked) return -1
      if (!a.isTracked && b.isTracked) return 1
      return (b.suggestedLevel || 0) - (a.suggestedLevel || 0)
    })
  }

  const getGroupById = (groupId: string): QuestGroup | undefined => {
    return state.groups.find((g) => g.id === groupId)
  }

  return (
    <QuestContext.Provider value={{ state, dispatch, selectedQuest, getQuestsByGroup, getGroupById }}>
      {children}
    </QuestContext.Provider>
  )
}

export function useQuests() {
  const context = useContext(QuestContext)
  if (!context) {
    throw new Error('useQuests must be used within a QuestProvider')
  }
  return context
}
