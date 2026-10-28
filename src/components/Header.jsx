import Button from './Button.jsx'
import { PanelIcon } from './Icons.jsx'

export default function Header({ sidebarOpen, onToggleSidebar, onAuth }) {
  return (
    <header className="flex min-h-18 shrink-0 items-center justify-between gap-3 px-3 py-3 sm:px-5">
      <Button variant="icon" className="desktop-toggle" aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'} aria-controls="desktop-sidebar" aria-expanded={sidebarOpen} onClick={onToggleSidebar}>
        <PanelIcon />
      </Button>
      <Button variant="icon" className="mobile-toggle" aria-label="Open sidebar" aria-haspopup="dialog" aria-controls="sidebar-dialog" onClick={onToggleSidebar}>
        <PanelIcon />
      </Button>
      <div className="flex items-center gap-2">
        <Button onClick={() => onAuth('login')}>Log in</Button>
        <Button variant="secondary" onClick={() => onAuth('signup')}>Sign up</Button>
      </div>
    </header>
  )
}
