"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, LayoutDashboard, Upload, Bell, GitMerge, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [alertsCount, setAlertsCount] = useState(0)
  const [mergesCount, setMergesCount] = useState(0)

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(data => {
      setAlertsCount(data.alertsCount || 0)
      setMergesCount(data.mergesCount || 0)
    }).catch(() => {})
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const navItems = [
    { label: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
    { label: "Entreprises", href: "/companies", icon: Building2 },
    { label: "Alertes", href: "/alerts", icon: Bell, badge: alertsCount },
    { label: "Fusions IA", href: "/merges", icon: GitMerge, badge: mergesCount },
    { label: "Importer", href: "/import", icon: Upload },
  ]

  return (
    <aside className="w-[220px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-full">
      <div className="h-14 flex items-center px-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-none">DataBridge</p>
            <p className="text-[10px] text-gray-400 leading-none mt-0.5">v1.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group",
              isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}>
              <div className="flex items-center gap-2.5">
                <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600")} />
                {item.label}
              </div>
              {item.badge != null && item.badge > 0 && (
                <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none", isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500")}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-100 space-y-0.5">
        <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150">
          <Settings className="w-4 h-4 text-gray-400" />Paramètres
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-150">
          <LogOut className="w-4 h-4" />Déconnexion
        </button>
      </div>
    </aside>
  )
}
