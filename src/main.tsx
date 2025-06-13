
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure React is available globally for Radix UI components
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

const container = document.getElementById("root")!
const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
