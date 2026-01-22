import { useState, useRef, useCallback, type ReactNode } from 'react'
import { useTheme } from '../../context/ThemeContext'
import './AppLayout.css'

interface AppLayoutProps {
  leftPanel: ReactNode
  middlePanel: ReactNode
  rightPanel: ReactNode
}

export default function AppLayout({ leftPanel, middlePanel, rightPanel }: AppLayoutProps) {
  const { theme, toggleTheme } = useTheme()
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const [leftWidth, setLeftWidth] = useState<number | null>(null) // null = flex equal
  const [rightWidth, setRightWidth] = useState<number | null>(null) // null = flex equal
  
  const isResizingLeft = useRef(false)
  const isResizingRight = useRef(false)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizingLeft.current) {
      const newWidth = Math.max(250, Math.min(500, e.clientX - 24))
      setLeftWidth(newWidth)
    }
    if (isResizingRight.current) {
      const newWidth = Math.max(250, Math.min(500, window.innerWidth - e.clientX - 24))
      setRightWidth(newWidth)
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    isResizingLeft.current = false
    isResizingRight.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove])

  const startResizeLeft = useCallback(() => {
    isResizingLeft.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove, handleMouseUp])

  const startResizeRight = useCallback(() => {
    isResizingRight.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove, handleMouseUp])

  return (
    <div className="app-layout">
      {/* Background */}
      <div className="app-layout__bg" />
      
      {/* Header */}
      <header className="app-header">
        <div className="app-header__nav">
          <button className="nav-arrow" aria-label="Previous page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="nav-label">WORLD MAP</span>
        </div>
        
        <h1 className="app-header__title">QUESTS</h1>
        
        <div className="app-header__nav">
          <span className="nav-label">CHARACTER</span>
          <button className="nav-arrow" aria-label="Next page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Theme Toggle */}
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            // Sun icon for switching to light
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            // Moon icon for switching to dark
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>
        
        <div className="app-header__level">
          <span className="level-label">LEVEL</span>
          <span className="level-value">95</span>
          <div className="level-bar">
            <div className="level-bar__fill" style={{ width: '42%' }} />
          </div>
          <span className="level-xp">851/2000</span>
        </div>
      </header>

      {/* Page dots indicator */}
      <div className="page-dots">
        {[...Array(7)].map((_, i) => (
          <span key={i} className={`page-dot ${i === 3 ? 'page-dot--active' : ''}`} />
        ))}
      </div>

      {/* Main content */}
      <main className="app-main">
        {/* Left Panel */}
        <section 
          className={`panel panel--left ${leftCollapsed ? 'panel--collapsed' : ''}`}
          style={{ 
            width: leftCollapsed ? 48 : (leftWidth || undefined),
            flex: leftCollapsed ? 'none' : (leftWidth ? 'none' : 1)
          }}
        >
          {/* Collapse toggle */}
          <button 
            className="panel__collapse-btn panel__collapse-btn--left"
            onClick={() => setLeftCollapsed(!leftCollapsed)}
            aria-label={leftCollapsed ? 'Expand left panel' : 'Collapse left panel'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={leftCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </button>
          
          {!leftCollapsed && (
            <>
              <div className="panel__content">
                {leftPanel}
              </div>
              {/* Resize handle */}
              <div 
                className="panel__resize-handle panel__resize-handle--right"
                onMouseDown={startResizeLeft}
              >
                <div className="resize-handle__line" />
              </div>
            </>
          )}
          
          {leftCollapsed && (
            <div className="panel__collapsed-label">
              <span>Q</span>
              <span>U</span>
              <span>E</span>
              <span>S</span>
              <span>T</span>
              <span>S</span>
            </div>
          )}
        </section>
        
        {/* Middle Panel */}
        <section className="panel panel--middle" style={{ flex: 1 }}>
          <div className="panel__content">
            {middlePanel}
          </div>
        </section>
        
        {/* Right Panel */}
        <section 
          className={`panel panel--right ${rightCollapsed ? 'panel--collapsed' : ''}`}
          style={{ 
            width: rightCollapsed ? 48 : (rightWidth || undefined),
            flex: rightCollapsed ? 'none' : (rightWidth ? 'none' : 1)
          }}
        >
          {/* Collapse toggle */}
          <button 
            className="panel__collapse-btn panel__collapse-btn--right"
            onClick={() => setRightCollapsed(!rightCollapsed)}
            aria-label={rightCollapsed ? 'Expand right panel' : 'Collapse right panel'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={rightCollapsed ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>
          </button>
          
          {!rightCollapsed && (
            <>
              {/* Resize handle */}
              <div 
                className="panel__resize-handle panel__resize-handle--left"
                onMouseDown={startResizeRight}
              >
                <div className="resize-handle__line" />
              </div>
              <div className="panel__content">
                {rightPanel}
              </div>
            </>
          )}
          
          {rightCollapsed && (
            <div className="panel__collapsed-label">
              <span>J</span>
              <span>O</span>
              <span>U</span>
              <span>R</span>
              <span>N</span>
              <span>A</span>
              <span>L</span>
            </div>
          )}
        </section>
      </main>

      {/* Vignette overlay */}
      <div className="app-layout__vignette" />
    </div>
  )
}
