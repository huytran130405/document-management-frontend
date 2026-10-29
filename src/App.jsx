import { BrowserRouter } from 'react-router'
import AuthProvider from './features/auth/AuthProvider.jsx'
import AppRouter from './router/AppRouter.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  )
}
