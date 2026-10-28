import Button from './Button.jsx'
import { CloseIcon } from './Icons.jsx'

export default function Sidebar({ mobile = false, onClose, collapsed = false }) {
  return (
    <aside id={mobile ? 'mobile-sidebar' : 'desktop-sidebar'} className={`sidebar ${mobile ? 'sidebar--mobile' : 'sidebar--desktop'}`} inert={collapsed} aria-hidden={collapsed || undefined} aria-label="Sidebar">
      <div className="flex min-h-16 items-center justify-between gap-4 px-5">
        <span className="brand" translate="no">Your App</span>
        {mobile ? <Button variant="icon" aria-label="Close sidebar" onClick={onClose}><CloseIcon /></Button> : null}
      </div>
    </aside>
  )
}
