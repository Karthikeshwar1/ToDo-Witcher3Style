import { useEffect, useRef, type ReactNode } from 'react'
import './Modal.css'

interface ModalProps {
  title: string
  children: ReactNode
  onClose: () => void
}

export default function Modal({ title, children, onClose }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Focus trap
    const modal = modalRef.current
    if (modal) {
      const focusableElements = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      firstElement?.focus()

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }

      modal.addEventListener('keydown', handleKeyDown)
      return () => modal.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal__header">
          <h2 id="modal-title" className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>
        
        <div className="modal__content">
          {children}
        </div>

        {/* Decorative corners */}
        <div className="modal__corner modal__corner--tl" />
        <div className="modal__corner modal__corner--tr" />
        <div className="modal__corner modal__corner--bl" />
        <div className="modal__corner modal__corner--br" />
      </div>
    </div>
  )
}

