import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Authorization from './components/Authorization.tsx'
import ChatSelection from './components/ChatSelection'
import Chat from './components/Chat'

const App: React.FC = () => {
    return (
        <Routes>
            <Route path='/authorization' element={<Authorization />} />
            <Route path='/chat-selection' element={<ChatSelection />} />
            <Route path='/chat' element={<Chat />} />
            <Route path='*' element={<Navigate to='/authorization' replace />} />
        </Routes>
    )
}

export default App
