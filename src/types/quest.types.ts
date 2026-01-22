export interface Subtask {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface Quest {
  id: string;
  groupId: string;
  title: string;
  location?: string;
  suggestedLevel?: number;
  icon?: string;
  description: string;
  subtasks: Subtask[];
  reminder?: string;
  createdAt: string;
  completedAt?: string;
  isFailed?: boolean;
  isTracked?: boolean;
}

export interface QuestGroup {
  id: string;
  name: string;
  icon?: string;
  order: number;
  isCollapsed: boolean;
  isDefault?: boolean;
  color?: string;
}

export interface QuestState {
  groups: QuestGroup[];
  quests: Quest[];
  selectedQuestId: string | null;
  searchQuery: string;
}

export type QuestAction =
  | { type: 'SET_GROUPS'; payload: QuestGroup[] }
  | { type: 'ADD_GROUP'; payload: QuestGroup }
  | { type: 'UPDATE_GROUP'; payload: QuestGroup }
  | { type: 'DELETE_GROUP'; payload: string }
  | { type: 'TOGGLE_GROUP_COLLAPSE'; payload: string }
  | { type: 'SET_QUESTS'; payload: Quest[] }
  | { type: 'ADD_QUEST'; payload: Quest }
  | { type: 'UPDATE_QUEST'; payload: Quest }
  | { type: 'DELETE_QUEST'; payload: string }
  | { type: 'SELECT_QUEST'; payload: string | null }
  | { type: 'TOGGLE_SUBTASK'; payload: { questId: string; subtaskId: string } }
  | { type: 'MOVE_QUEST_TO_GROUP'; payload: { questId: string; groupId: string } }
  | { type: 'TRACK_QUEST'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'LOAD_STATE'; payload: QuestState };

