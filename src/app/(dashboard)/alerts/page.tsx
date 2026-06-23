"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Building2, CheckCircle, Clock, ArrowRight, Loader2, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Alert {
  id: string; type: string; message: string; detail?: string
  oldValue: string | null; newValue: string | null; isRead: boolean; createdAt: string
  company: { id: string; raisonSociale: string }
}

const severityMap: Record<string, { color: string; bg: string; label: string; borderColor: string }> = {
  LEGAL_STATUS_CHANGE: { color: "text-red-600", bg: "bg-red-50 border-red-100", label: "Critique", borderColor: "border-l-red-500" },
  DIRECTOR_CHANGE: { color: "text-amber-600", bg: "bg-amber-50 border-amber-100", label: "Élevé", borderColor: "border-l-amber-500" },
  ADDRESS_CHANGE: { color: "text-blue-600", bg: "bg-blue-50 border-blue-100", label: "Info", borderColor: "border-l-blue-500" },
  ACTIVITY_CHANGE: { color: "text-blue-600", bg: "bg-blue-50 border-blue-100", label: "Info", borderColor: "border-l-blue-400" },
  DUPLICATE_DETECTED: { color: "text-purple-600", bg: "bg-purple-50 border-purple-100", label: "Doublon", borderColor: "border-l-purple-500" },
  DATA_INCONSISTENCY: { color: "text-orange-600", bg: "bg-orange-50 border-orange-100", label: "Anomalie", borderColor: "border-l-orange-400" },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `Il y a ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Il y a ${hours}h`
  return `Il y a ${Math.floor(hours / 24)} jour(s)`
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAlerts = () => {
    fetch("/api/alerts").then(r => r.json()).then(setAlerts).finally(() => setLoading(false))
  }

  useEffect(() => { fetchAlerts() }, [])

  const markAllRead = async () => {
    await fetch("/api/alerts", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ markAll: true }) })
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })))
  }

  const unread = alerts.filter(a => !a.isRead).length

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /></div>

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Alertes</h2>
          <p className="text-sm text-gray-500 mt-0.5">{unread > 0 ? `${unread} alertes non lues` : "Tout est lu"} · Veille entreprise active</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-secondary text-xs">
            <CheckCircle className="w-3.5 h-3.5" />Tout marquer lu
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-900">Aucune alerte</p>
          <p className="text-xs text-gray-500 mt-1">La veille entreprise surveille automatiquement vos fiches</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map(alert => {
            const config = severityMap[alert.type] || severityMap.DATA_INCONSISTENCY
            return (
              <div key={alert.id} className={cn("card border transition-all", !alert.isRead && `border-l-4 ${config.borderColor}`, alert.isRead && "opacity-60")}>
                <div className="flex items-start gap-3 p-4">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border", config.bg)}>
                    <AlertTriangle className={cn("w-4 h-4", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{alert.message}</p>
                        <Link href={`/companies/${alert.company.id}`} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-0.5">
                          <Building2 className="w-3 h-3" />{alert.company.raisonSociale}
                        </Link>
                      </div>
                      <span className={cn("badge border text-[10px] flex-shrink-0", config.bg, config.color)}>{config.label}</span>
                    </div>
                    {(alert.oldValue || alert.newValue) && (
                      <div className="bg-gray-50 rounded-lg p-2 mt-2 text-xs text-gray-600">
                        {alert.oldValue && <span className="line-through text-gray-400 mr-2">{alert.oldValue}</span>}
                        {alert.newValue && <span className="font-medium text-gray-800">→ {alert.newValue}</span>}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />{timeAgo(alert.createdAt)}
                      </div>
                      <Link href={`/companies/${alert.company.id}`} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        Voir la fiche<ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
