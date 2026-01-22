import { useState, useEffect, useCallback } from 'react'
import { useQuests } from './context/QuestContext'
import AppLayout from './components/Layout/AppLayout'
import QuestGroupList from './components/LeftPanel/QuestGroupList'
import QuestDetails from './components/MiddlePanel/QuestDetails'
import QuestDescription from './components/RightPanel/QuestDescription'
import AddEditQuestModal from './components/Modals/AddEditQuestModal'
import AddEditGroupModal from './components/Modals/AddEditGroupModal'
import type { Quest, QuestGroup } from './types/quest.types'
import './App.css'

function App() {
  const { state, dispatch, selectedQuest } = useQuests()
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false)
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null)
  const [editingGroup, setEditingGroup] = useState<QuestGroup | null>(null)
  const [defaultGroupId, setDefaultGroupId] = useState<string | null>(null)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const allQuests = state.quests.filter((q) => 
        !state.groups.find((g) => g.id === q.groupId)?.isCollapsed
      )
      const currentIndex = allQuests.findIndex((q) => q.id === state.selectedQuestId)

      switch (e.key) {
        case 'j':
        case 'ArrowDown':
          e.preventDefault()
          if (currentIndex < allQuests.length - 1) {
            dispatch({ type: 'SELECT_QUEST', payload: allQuests[currentIndex + 1].id })
          }
          break
        case 'k':
        case 'ArrowUp':
          e.preventDefault()
          if (currentIndex > 0) {
            dispatch({ type: 'SELECT_QUEST', payload: allQuests[currentIndex - 1].id })
          }
          break
        case 'n':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            handleAddQuest()
          }
          break
        case 't':
          if (selectedQuest && !e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            dispatch({ type: 'TRACK_QUEST', payload: selectedQuest.id })
          }
          break
        case 'Escape':
          setIsQuestModalOpen(false)
          setIsGroupModalOpen(false)
          setEditingQuest(null)
          setEditingGroup(null)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.quests, state.selectedQuestId, state.groups, selectedQuest, dispatch])

  const handleAddQuest = useCallback((groupId?: string) => {
    setEditingQuest(null)
    setDefaultGroupId(groupId || 'secondary')
    setIsQuestModalOpen(true)
  }, [])

  const handleEditQuest = useCallback((quest: Quest) => {
    setEditingQuest(quest)
    setDefaultGroupId(null)
    setIsQuestModalOpen(true)
  }, [])

  const handleAddGroup = useCallback(() => {
    setEditingGroup(null)
    setIsGroupModalOpen(true)
  }, [])

  const handleEditGroup = useCallback((group: QuestGroup) => {
    setEditingGroup(group)
    setIsGroupModalOpen(true)
  }, [])

  const handleSaveQuest = useCallback((quest: Quest) => {
    if (editingQuest) {
      dispatch({ type: 'UPDATE_QUEST', payload: quest })
    } else {
      dispatch({ type: 'ADD_QUEST', payload: quest })
      dispatch({ type: 'SELECT_QUEST', payload: quest.id })
    }
    setIsQuestModalOpen(false)
    setEditingQuest(null)
  }, [editingQuest, dispatch])

  const handleSaveGroup = useCallback((group: QuestGroup) => {
    if (editingGroup) {
      dispatch({ type: 'UPDATE_GROUP', payload: group })
    } else {
      dispatch({ type: 'ADD_GROUP', payload: group })
    }
    setIsGroupModalOpen(false)
    setEditingGroup(null)
  }, [editingGroup, dispatch])

  const handleDeleteQuest = useCallback((questId: string) => {
    dispatch({ type: 'DELETE_QUEST', payload: questId })
    setIsQuestModalOpen(false)
    setEditingQuest(null)
  }, [dispatch])

  const handleDeleteGroup = useCallback((groupId: string) => {
    dispatch({ type: 'DELETE_GROUP', payload: groupId })
    setIsGroupModalOpen(false)
    setEditingGroup(null)
  }, [dispatch])

  return (
    <>
      <AppLayout
        leftPanel={
          <QuestGroupList
            onAddQuest={handleAddQuest}
            onEditQuest={handleEditQuest}
            onAddGroup={handleAddGroup}
            onEditGroup={handleEditGroup}
          />
        }
        middlePanel={
          <QuestDetails
            quest={selectedQuest}
            onEdit={handleEditQuest}
          />
        }
        rightPanel={
          <QuestDescription
            quest={selectedQuest}
            onEdit={handleEditQuest}
          />
        }
      />
      
      {isQuestModalOpen && (
        <AddEditQuestModal
          quest={editingQuest}
          defaultGroupId={defaultGroupId}
          onSave={handleSaveQuest}
          onDelete={editingQuest ? () => handleDeleteQuest(editingQuest.id) : undefined}
          onClose={() => {
            setIsQuestModalOpen(false)
            setEditingQuest(null)
          }}
        />
      )}
      
      {isGroupModalOpen && (
        <AddEditGroupModal
          group={editingGroup}
          onSave={handleSaveGroup}
          onDelete={editingGroup && !editingGroup.isDefault ? () => handleDeleteGroup(editingGroup.id) : undefined}
          onClose={() => {
            setIsGroupModalOpen(false)
            setEditingGroup(null)
          }}
        />
      )}
    </>
  )
}

export default App

