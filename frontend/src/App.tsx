import './App.css'
import { Chat } from './pages/chat/chat'
import Login from './pages/auth/login'
import  Register  from './pages/auth/register'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="w-full h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} /> 
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App;