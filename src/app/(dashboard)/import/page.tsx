"use client"

import { useState, useCallback } from "react"
import { Upload, FileSpreadsheet, CheckCircle, ArrowRight, Download, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Step = "upload" | "processing" | "done"

interface ImportResult {
  total: number; imported: number; updated: number; errors: number
  errorDetails?: { row: number; error: string }[]
}

const TEMPLATE_CSV = `RAISON_SOCIALE,ICE,RC,IF_FISCAL,CNSS,VILLE,REGION,ADRESSE,TELEPHONE,EMAIL,SITE_WEB,SECTEUR_ACTIVITE,ACTIVITE_PRINCIPALE,FORME_JURIDIQUE,TAILLE_ENTREPRISE
"EXEMPLE SARL","002345678000001","12345","98765432","5555555","Casablanca","Casablanca-Settat","123 Rue Mohammed V, Casablanca","+212 5 22 00 00 00","contact@exemple.ma","www.exemple.ma","Commerce","Vente de matériaux","SARL","PME"
"AUTRE SA","002345678000002","23456","87654321","6666666","Rabat","Rabat-Salé-Kénitra","45 Avenue Hassan II, Rabat","+212 5 37 00 00 00","info@autre.ma","www.autre.ma","Industrie","Fabrication","SA","Grande"`

export default function ImportPage() {
  const [step, setStep] = useState<Step>("upload")
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState("")

  const handleFile = (f: File) => {
    if (f.name.endsWith(".csv") || f.name.endsWith(".xlsx") || f.name.endsWith(".xls")) {
      setFile(f); setError("")
    } else {
      setError("Format non supporté. Utilisez CSV ou Excel.")
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  const handleImport = async () => {
    if (!file) return
    setStep("processing")
    setProgress(0)
    setError("")

    // Fake progress animation
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 85) { clearInterval(interval); return 85 } return p + Math.random() * 15 })
    }, 200)

    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/import", { method: "POST", body: formData })
      const data = await res.json()
      clearInterval(interval)
      setProgress(100)

      if (!res.ok) throw new Error(data.error || "Import failed")

      setTimeout(() => { setResult(data); setStep("done") }, 500)
    } catch (err) {
      clearInterval(interval)
      setError(String(err))
      setStep("upload")
    }
  }

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "template-import-databridge.csv"
    a.click(); URL.revokeObjectURL(url)
  }

  const reset = () => { setStep("upload"); setFile(null); setResult(null); setProgress(0); setError("") }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Importer des données</h2>
        <p className="text-sm text-gray-500 mt-0.5">Importez votre fichier CSV ou Excel — enrichissement automatique via Telecontact</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {(["upload", "processing", "done"] as Step[]).map((s, i) => {
          const labels = ["Fichier", "Traitement", "Résultats"]
          const done = ["upload", "processing", "done"].indexOf(step) > i
          const active = step === s
          return (
            <div key={s} className="flex items-center gap-2">
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold", done ? "bg-blue-700 text-white" : active ? "bg-blue-100 text-blue-700 ring-2 ring-blue-200" : "bg-gray-100 text-gray-400")}>
                {done ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={cn("text-xs font-medium", active ? "text-gray-900" : "text-gray-400")}>{labels[i]}</span>
              {i < 2 && <div className="w-8 h-px bg-gray-200 mx-1" />}
            </div>
          )
        })}
      </div>

      {/* Upload step */}
      {step === "upload" && (
        <div className="card p-5 space-y-4">
          <div onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}
            className={cn("border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer",
              dragging ? "border-blue-400 bg-blue-50" : file ? "border-emerald-300 bg-emerald-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            )}>
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileSpreadsheet className="w-10 h-10 text-emerald-500" />
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} Ko · Prêt à importer</p>
                <button onClick={() => setFile(null)} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mt-1">
                  <X className="w-3 h-3" />Supprimer
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Glissez votre fichier ici</p>
                  <p className="text-xs text-gray-400 mt-0.5">CSV ou Excel · Max 50 MB</p>
                </div>
                <label className="btn-secondary text-xs cursor-pointer">
                  <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  Parcourir les fichiers
                </label>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs font-medium text-blue-900">Modèle de fichier</p>
                <p className="text-xs text-blue-600">Template CSV avec toutes les colonnes attendues</p>
              </div>
            </div>
            <button onClick={downloadTemplate} className="btn-secondary text-xs py-1.5">
              <Download className="w-3.5 h-3.5" />Template
            </button>
          </div>

          <button disabled={!file} onClick={handleImport} className="btn-primary w-full disabled:opacity-40">
            Lancer l'import<ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Processing step */}
      {step === "processing" && (
        <div className="card p-10 text-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Import en cours...</p>
            <p className="text-xs text-gray-500 mt-1">Analyse · Enrichissement · Dédoublonnage</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-400">{Math.round(progress)}% · Traitement en cours</p>
        </div>
      )}

      {/* Done step */}
      {step === "done" && result && (
        <div className="card p-8 space-y-5">
          <div className="text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-emerald-500" />
            </div>
            <p className="text-base font-semibold text-gray-900">Import terminé !</p>
            <p className="text-sm text-gray-500 mt-1">Vos données ont été importées et enrichies</p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Total", value: result.total, color: "bg-gray-50 text-gray-700" },
              { label: "Créées", value: result.imported, color: "bg-blue-50 text-blue-700" },
              { label: "Mises à jour", value: result.updated, color: "bg-emerald-50 text-emerald-700" },
              { label: "Erreurs", value: result.errors, color: result.errors > 0 ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-400" },
            ].map(s => (
              <div key={s.label} className={cn("rounded-xl p-3 text-center", s.color)}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs opacity-80 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {result.errorDetails && result.errorDetails.length > 0 && (
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-700 mb-2">Erreurs détectées :</p>
              {result.errorDetails.slice(0, 5).map((e, i) => (
                <p key={i} className="text-xs text-red-600">Ligne {e.row}: {e.error}</p>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={reset} className="btn-secondary flex-1 text-sm">Nouvel import</button>
            <a href="/companies" className="btn-primary flex-1 text-sm text-center">
              Voir les entreprises<ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Format info */}
      {step === "upload" && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Colonnes reconnues automatiquement</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["RAISON_SOCIALE / NOM_ENTREPRISE", "Raison sociale"],
              ["ICE / ICE_NUM", "Identifiant fiscal unique"],
              ["RC / RC_NUMBER", "Registre du commerce"],
              ["IF / IF_FISCAL", "Identifiant fiscal"],
              ["CNSS / NUM_CNSS", "Numéro CNSS"],
              ["VILLE / CITY", "Ville"],
              ["TELEPHONE / PHONE / TEL", "Téléphone principal"],
              ["EMAIL / EMAIL_CONTACT", "Email principal"],
              ["SECTEUR / SECTEUR_ACTIVITE", "Secteur d'activité"],
              ["FORME_JURIDIQUE", "Forme juridique"],
            ].map(([csv, desc]) => (
              <div key={csv} className="flex items-center gap-2">
                <code className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono">{csv}</code>
                <span className="text-xs text-gray-500">→ {desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
