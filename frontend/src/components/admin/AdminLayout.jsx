/**
 * Admin Layout Component
 * Layout wrapper for admin pages with toggleable sidebar navigation
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState } from 'react'
import SidebarNavigation from './SidebarNavigation'

/**
 * AdminLayout component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @returns {JSX.Element} Admin layout component
 * @author Thang Truong
 * @date 2025-12-12
 */
const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  /**
   * Toggle sidebar
   * @author Thang Truong
   * @date 2025-12-12
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  /* Admin layout with toggleable sidebar */
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SidebarNavigation isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 overflow-y-auto ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <div className="p-3 pt-10">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout

