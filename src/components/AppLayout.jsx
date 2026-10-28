import { useEffect, useRef, useState } from 'react'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'
import AuthModal from './AuthModal.jsx'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [authMode, setAuthMode] = useState('login')
  const [authOpen, setAuthOpen] = useState(false)
  const mobileSidebarRef = useRef(null)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    function closeMobileSidebar(event) {
      if (event.matches && mobileSidebarRef.current.open) mobileSidebarRef.current.close()
    }
    media.addEventListener('change', closeMobileSidebar)
    return () => media.removeEventListener('change', closeMobileSidebar)
  }, [])

  function toggleSidebar() {
    if (window.matchMedia('(max-width: 767px)').matches) mobileSidebarRef.current.showModal()
    else setSidebarOpen((open) => !open)
  }

  function openAuth(mode) {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="app-shell min-h-dvh" data-sidebar-open={sidebarOpen}>
        <Sidebar collapsed={!sidebarOpen} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} onAuth={openAuth} />
          <main id="main-content" className="min-h-0 flex-1" aria-label="Main content" tabIndex={-1} />
        </div>
      </div>
      <dialog id="sidebar-dialog" ref={mobileSidebarRef} className="sidebar-dialog" aria-label="Sidebar menu" onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}>
        <Sidebar mobile onClose={() => mobileSidebarRef.current.close()} />
      </dialog>
      <AuthModal open={authOpen} mode={authMode} onClose={() => setAuthOpen(false)} onSwitch={setAuthMode} />
    </>
  )
}
