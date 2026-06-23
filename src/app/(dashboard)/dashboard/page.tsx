"use client"

import { useState, useEffect } from "react"
import { Building2, TrendingUp, AlertTriangle, GitMerge, ArrowUpRight, Clock, Loader2 } from "lucide-react"
import { cn, getQualityBg } from "@/lib/utils"
import Link from "next/link"

interface Stats {
  totalCompanies: number; avgQuality: number; alertsCount: number; mergesCount: number
  distribution: { excellent: number; good: number; fair: number; poor: number }
}

interface RecentCompany {
  id: string; raisonSociale: string; qualityScore: number | null; updatedAt: string
  secteurActivite: string | null
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<RecentCompany[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then(r => r.json()),
      fetch("/api/companies?limit=5&page=1").then(r => r.json()),
    ]).then(([statsData, companiesData]) => {
      setStats(statsData)
      setRecent(companiesData.companies || [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
    </div>
  )

  const statCards = [
    { label: "Entreprises totales", value: stats?.totalCompanies?.toLocaleString("fr-MA") || "0", change: "Référentiel actif", icon: Building2, color: "text-blue-600", bg: "bg-blue-50", trend: "up" },
    { label: "Score qualité moyen", value: `${stats?.avgQuality || 0}%`, change: "Score DATA global", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", trend: "up" },
    { label: "Alertes actives", value: String(stats?.alertsCount || 0), change: "Veille entreprise", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", trend: "down" },
    { label: "Fusions en attente", value: String(stats?.mergesCount || 0), change: "IA Smart Matching", icon: GitMerge, color: "text-purple-600", bg: "bg-purple-50", trend: "neutral" },
  ]

  const total = stats?.totalCompanies || 1
  const distribution = [
    { label: "Excellent (90-100%)", count: stats?.distribution.excellent || 0, color: "bg-emerald-500", pct: Math.round((stats?.distribution.excellent || 0) / total * 100) },
    { label: "Bon (70-89%)", count: stats?.distribution.good || 0, color: "bg-blue-500", pct: Math.round((stats?.distribution.good || 0) / total * 100) },
    { label: "Moyen (50-69%)", count: stats?.distribution.fair || 0, color: "bg-amber-400", pct: Math.round((stats?.distribution.fair || 0) / total * 100) },
    { label: "Faible (<50%)", count: stats?.distribution.poor || 0, color: "bg-red-400", pct: Math.round((stats?.distribution.poor || 0) / total * 100) },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Vue d'ensemble</h2>
        <p className="text-sm text-gray-500 mt-0.5">Tableau de bord de la qualité DATA — Mis à jour maintenant</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.bg)}>
                  <Icon className={cn("w-4 h-4", stat.color)} />
                </div>
                {stat.trend === "up" && <ArrowUpRight className="w-4 h-4 text-emerald-500" />}
              </div>
              <p className="text-2xl font-bold text-gray-900 leading-none">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.change}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quality distribution */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Répartition qualité DATA</h3>
            <span className="badge bg-gray-100 text-gray-600">{stats?.totalCompanies || 0} fiches</span>
          </div>
          <div className="space-y-3">
            {distribution.map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">{item.label}</span>
                  <span className="text-xs font-semibold text-gray-900">{item.count.toLocaleString("fr-MA")}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", item.color)} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F3F4F6" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2563EB" strokeWidth="3"
                  strokeDasharray={`${stats?.avgQuality || 0} ${100 - (stats?.avgQuality || 0)}`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-700">{stats?.avgQuality || 0}%</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Score global</p>
              <p className="text-xs text-gray-500">Qualité DATA moyenne</p>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Entreprises récentes</h3>
            <Link href="/companies" className="text-xs text-blue-600 hover:text-blue-700 font-medium">Voir tout</Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">Aucune entreprise pour l'instant</p>
              <Link href="/import" className="text-xs text-blue-600 hover:text-blue-700 mt-2 block">Importer des données →</Link>
            </div>
          ) : recent.map((company, i) => (
            <div key={company.id} className={cn("flex items-center gap-4 py-3", i < recent.length - 1 && "border-b border-gray-50")}>
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 flex-shrink-0">
                {company.raisonSociale.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/companies/${company.id}`} className="text-sm font-medium text-gray-900 truncate hover:text-blue-600 block">{company.raisonSociale}</Link>
                <p className="text-xs text-gray-500">{company.secteurActivite || "Secteur non renseigné"}</p>
              </div>
              <span className={cn("badge border text-xs", getQualityBg(company.qualityScore || 0))}>{company.qualityScore || 0}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
