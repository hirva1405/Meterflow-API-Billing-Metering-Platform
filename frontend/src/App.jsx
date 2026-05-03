import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import ApisPage from './pages/ApisPage'
import KeysPage from './pages/KeysPage'
import UsagePage from './pages/UsagePage'
import BillingPage from './pages/BillingPage'
import ToastContainer from './components/ui/Toast'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="bg-floral min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4" style={{animation:'float 3s ease-in-out infinite'}}>🌸</div>
          <div style={{fontFamily:'serif', fontSize:'1.2rem', color:'#4a2035'}}>Loading MeterFlow...</div>
        </div>
      </div>
    )
  }
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/apis" element={<ProtectedRoute><ApisPage /></ProtectedRoute>} />
          <Route path="/keys" element={<ProtectedRoute><KeysPage /></ProtectedRoute>} />
          <Route path="/usage" element={<ProtectedRoute><UsagePage /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  )
}
