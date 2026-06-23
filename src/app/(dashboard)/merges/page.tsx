"use client"

import { useState, useEffect } from "react"
import { GitMerge, Check, X, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface MergeSuggestion {
  id: string; confidenceScore: number; matchedFields: { fields: string[] }
  status: string
  sourceCompany: { id: string; raisonSociale: string; ice: string | null; ville: string | null }
  targetCompany: { id: string; raisonSociale: string; ice: string | null; ville: string | null }
}

export default function MergesPage() {
  const [merges, setMerges] = useState<MergeSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [resolving, setResolving] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/merges").then(r => r.json()).then(data => {
      setMerges(Array.isArray(data) ? data : [])
      if (data.length > 0) setExpanded(data[0].id)
    }).finally(() => setLoading(false))
  }, [])

  const resolve = async (id: string, action: "approve" | "reject") => {
    setResolving(id)
    try {
      await fetch("/api/merges", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action }) })
      setMerges(prev => prev.filter(m => m.id !== id))
    } finally {
      setResolving(null)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /></div>

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Fusions IA</h2>
          <p className="text-sm text-gray-500 mt-0.5">{merges.length} doublons potentiels détectés · Validation requise</p>
        </div>
        <span className="badge bg-purple-50 text-purple-700 border border-purple-100">IA Smart Matching</span>
      </div>

      {merges.length === 0 ? (
        <div className="card p-12 text-center">
          <GitMerge className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-900">Aucun doublon détecté</p>
          <p className="text-xs text-gray-500 mt-1">L'IA Smart Matching analyse automatiquement vos données</p>
        </div>
      ) : (
        <div className="space-y-2">
          {merges.map(merge => {
            const isExpanded = expanded === merge.id
            const pct = Math.round(merge.confidenceScore * 100)
            const fields = merge.matchedFields?.fields || []
            return (
              <div key={merge.id} className="card border hover:border-gray-200 transition-all">
                <button onClick={() => setExpanded(isExpanded ? null : merge.id)} className="w-full flex items-center gap-4 p-4 text-left">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <GitMerge className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {merge.sourceCompany.raisonSociale}
                      <span className="text-gray-400 mx-2">↔</span>
                      {merge.targetCompany.raisonSociale}
                    </p>
                    <p className="text-xs text-gray-500">{fields.length} champs correspondants · ICE: {merge.sourceCompany.ice || "—"}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn("text-sm font-bold", pct >= 95 ? "text-emerald-600" : pct >= 85 ? "text-blue-600" : "text-amber-600")}>{pct}%</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-50 pt-3">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {[merge.sourceCompany, merge.targetCompany].map((c, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">{i === 0 ? "Source" : "Cible"}</p>
                          <p className="text-sm font-medium text-gray-900">{c.raisonSociale}</p>
                          <p className="text-xs text-gray-500">ICE: {c.ice || "—"}</p>
                          <p className="text-xs text-gray-500">{c.ville || "—"}</p>
                        </div>
                      ))}
                    </div>
                    {fields.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {fields.map(f => (
                          <span key={f} className="badge bg-purple-50 text-purple-700 border border-purple-100 text-xs">✓ {f}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => resolve(merge.id, "reject")} disabled={resolving === merge.id} className="btn-secondary flex-1 text-xs py-2">
                        <X className="w-3.5 h-3.5" />Rejeter
                      </button>
                      <button onClick={() => resolve(merge.id, "approve")} disabled={resolving === merge.id} className="btn-primary flex-1 text-xs py-2">
                        {resolving === merge.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Approuver la fusion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
