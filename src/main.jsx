import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Global.css' // Am schimbat index.css cu Global.css
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)