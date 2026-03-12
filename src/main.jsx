import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// function that mounts chatbot
function renderDialBot(element) {
  const root = createRoot(element)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
// function for WordPress
window.DialBot = {
  init: function (elementId = "dialbot-root") {
    const container = document.getElementById(elementId)
    if (container) {
      renderDialBot(container)
    }
  }
}

//  React development support
const defaultRoot = document.getElementById("root")
if (defaultRoot) {
  renderDialBot(defaultRoot)
}