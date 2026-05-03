import Sidebar from '../ui/Sidebar'
import FloatingPetals from '../ui/FloatingPetals'

export default function DashboardLayout({ children }) {
  return (
    <div className="bg-floral min-h-screen flex">
      <FloatingPetals count={14} />
      <Sidebar />
      <main className="ml-64 flex-1 p-8 relative z-10">
        {children}
      </main>
    </div>
  )
}
