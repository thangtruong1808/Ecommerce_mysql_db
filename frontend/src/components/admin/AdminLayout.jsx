/**
 * Admin Layout Component
 * Layout wrapper for admin pages with sidebar navigation
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

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
  /* Admin layout with sidebar */
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarNavigation />
      <div className="flex-1 ml-64 pt-16">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout

