import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext'
import { QuestProvider } from './context/QuestContext'
import App from './App'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QuestProvider>
        <App />
      </QuestProvider>
    </ThemeProvider>
  </StrictMode>,
)
