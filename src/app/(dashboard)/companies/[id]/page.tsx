"use client"

import { useState, useEffect } from "react"
import { Building2, MapPin, Users, Briefcase, Shield, DollarSign, MessageSquare, ArrowLeft, Edit, Save, X, RefreshCw, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { cn, getQualityBg, formatDate, formatCurrency } from "@/lib/utils"
import { createClient } from "@/lib/supabase"
import { use } from "react"

interface Contact {
  id: string; nom: string; prenom: string | null; fonction: string | null
  type: string; telephone: string | null; email: string | null; isPrincipal: boolean
}

interface Alert {
  id: string; type: string; message: string; oldValue: string | null; newValue: string | null
  isRead: boolean; createdAt: string
}

interface Company {
  id: string; raisonSociale: string; nomCommercial: string | null
  ice: string | null; rc: string | null; if_: string | null; cnss: string | null
  dateCreation: string | null; secteurActivite: string | null; activitePrincipale: string | null
  detailActivite: string | null; formeJuridique: string | null; tailleEntreprise: string | null
  chiffreAffaires: number | null; groupe: string | null; filiale: string | null
  status: string; adressePrincipale: string | null; ville: string | null
  region: string | null; telephonePrincipal: string | null; emailPrincipal: string | null
  siteWeb: string | null; qualityScore: number | null; contratsActifs: number | null
  primes: number | null; sinistresEnCours: number | null; sourceData: string | null
  statutVerification: string | null; derniereMiseAJour: string | null
  contacts: Contact[]; alerts: Alert[]
}

type UserRole = 'TELECONTACT' | 'ATLANTASANAD'

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [role, setRole] = useState<UserRole>('ATLANTASANAD')
  const [edited, setEdited] = useState<Partial<Company>>({})

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.role) setRole(user.user_metadata.role as UserRole)
    })
  }, [])

  useEffect(() => {
    fetch(`/api/companies/${id}`)
      .then(r => r.json())
      .then(data => { setCompany(data); setEdited(data) })
      .catch(() => setError("Impossible de charger la fiche"))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edited),
      })
      if (!res.ok) throw new Error("Erreur serveur")
      const updated = await res.json()
      setCompany(updated)
      setEdited(updated)
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError("Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  const Field = ({ label, field, editable = false }: { label: string; field: keyof Company; editable?: boolean }) => {
    const value = editing && editable ? (edited[field] as string) : (company?.[field] as string)
    const canEdit = editing && editable
    return (
      <div className="flex items-start py-2.5 border-b border-gray-50 last:border-0">
        <span className="text-xs text-gray-500 w-40 flex-shrink-0 mt-1.5">{label}</span>
        {canEdit ? (
          <input
            className="input-base py-1 text-sm flex-1"
            value={String(value || "")}
            onChange={e => setEdited(prev => ({ ...prev, [field]: e.target.value }))}
          />
        ) : (
          <span className={cn("text-sm flex-1", !value && "text-gray-400 italic")}>
            {String(value || "Non renseigné")}
          </span>
        )}
      </div>
    )
  }

  const NumField = ({ label, field, editable = false, prefix = "" }: { label: string; field: keyof Company; editable?: boolean; prefix?: string }) => {
    const value = editing && editable ? (edited[field] as number) : (company?.[field] as number)
    const canEdit = editing && editable
    return (
      <div className="flex items-start py-2.5 border-b border-gray-50 last:border-0">
        <span className="text-xs text-gray-500 w-40 flex-shrink-0 mt-1.5">{label}</span>
        {canEdit ? (
          <input type="number" className="input-base py-1 text-sm flex-1" value={value ?? ""}
            onChange={e => setEdited(prev => ({ ...prev, [field]: parseFloat(e.target.value) || null }))}
          />
        ) : (
          <span className={cn("text-sm flex-1", value == null && "text-gray-400 italic")}>
            {value != null ? `${prefix}${value.toLocaleString("fr-MA")}` : "Non renseigné"}
          </span>
        )}
      </div>
    )
  }

  const scoreSegments = [
    { label: "Signalétique", score: company?.ice && company?.rc && company?.formeJuridique ? 92 : 40, color: "text-blue-600" },
    { label: "Coordonnées", score: company?.adressePrincipale && company?.telephonePrincipal ? 85 : 30, color: "text-green-600" },
    { label: "Contacts", score: (company?.contacts?.length || 0) > 0 ? 78 : 0, color: "text-purple-600" },
    { label: "Portefeuille", score: company?.contratsActifs ? 65 : 0, color: "text-orange-600" },
    { label: "Sinistres", score: company?.sinistresEnCours != null ? 50 : 0, color: "text-red-600" },
    { label: "Financier", score: company?.primes ? 40 : 0, color: "text-emerald-600" },
    { label: "Interactions", score: 30, color: "text-gray-600" },
  ]

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /></div>
  if (!company) return <div className="text-center py-16 text-gray-500">Entreprise introuvable</div>

  const telecontactEditable = role === 'TELECONTACT'
  const atlantaEditable = role === 'ATLANTASANAD'

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/companies" className="btn-ghost p-2 mt-0.5"><ArrowLeft className="w-4 h-4" /></Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-700">
              {company.raisonSociale.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{company.raisonSociale}</h2>
              <p className="text-sm text-gray-500">ICE: {company.ice || "—"} · {company.formeJuridique || "—"} · {company.ville || "—"}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle className="w-3.5 h-3.5" />Sauvegardé</span>}
          <span className={cn("badge border px-3 py-1", getQualityBg(company.qualityScore || 0))}>Qualité {company.qualityScore || 0}%</span>
          {editing ? (
            <>
              <button onClick={() => { setEditing(false); setEdited(company) }} className="btn-secondary"><X className="w-4 h-4" />Annuler</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Sauvegarder
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-primary"><Edit className="w-4 h-4" />Modifier</button>
          )}
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2 rounded-lg">{error}</div>}

      {/* Quality bar */}
      <div className="card p-4">
        <div className="grid grid-cols-7 gap-2">
          {scoreSegments.map((seg) => (
            <div key={seg.label} className="text-center">
              <div className={cn("h-1.5 rounded-full mb-1.5", seg.score >= 70 ? "bg-blue-500" : seg.score >= 50 ? "bg-amber-400" : seg.score > 0 ? "bg-red-400" : "bg-gray-200")} />
              <p className="text-[10px] text-gray-500 leading-tight">{seg.label}</p>
              <p className={cn("text-[10px] font-semibold", seg.score > 0 ? "text-gray-700" : "text-gray-300")}>{seg.score > 0 ? `${seg.score}%` : "—"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">

          {/* 1. Signalétique */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">Signalétique Entreprise</h3>
              <span className="badge bg-blue-50 text-blue-600 border-0 ml-auto text-[10px]">Telecontact</span>
              {!telecontactEditable && editing && <span className="text-[10px] text-gray-400">Lecture seule</span>}
            </div>
            <Field label="Raison sociale" field="raisonSociale" editable={telecontactEditable} />
            <Field label="Nom commercial" field="nomCommercial" editable={telecontactEditable} />
            <Field label="ICE" field="ice" editable={telecontactEditable} />
            <Field label="RC" field="rc" editable={telecontactEditable} />
            <Field label="IF" field="if_" editable={telecontactEditable} />
            <Field label="CNSS" field="cnss" editable={telecontactEditable} />
            <Field label="Forme juridique" field="formeJuridique" editable={telecontactEditable} />
            <Field label="Secteur d'activité" field="secteurActivite" editable={telecontactEditable} />
            <Field label="Activité principale" field="activitePrincipale" editable={telecontactEditable} />
            <Field label="Taille entreprise" field="tailleEntreprise" editable={telecontactEditable} />
            <Field label="Groupe" field="groupe" editable={telecontactEditable} />
          </div>

          {/* 2. Coordonnées */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-green-600" />
              <h3 className="text-sm font-semibold text-gray-900">Coordonnées & Localisation</h3>
              <span className="badge bg-blue-50 text-blue-600 border-0 ml-auto text-[10px]">Telecontact</span>
            </div>
            <Field label="Adresse principale" field="adressePrincipale" editable={telecontactEditable} />
            <Field label="Ville" field="ville" editable={telecontactEditable} />
            <Field label="Région" field="region" editable={telecontactEditable} />
            <Field label="Téléphone principal" field="telephonePrincipal" editable={telecontactEditable} />
            <Field label="Email principal" field="emailPrincipal" editable={telecontactEditable} />
            <Field label="Site web" field="siteWeb" editable={telecontactEditable} />
          </div>

          {/* 4. Vision Portefeuille */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-semibold text-gray-900">Vision Portefeuille</h3>
              <span className="badge bg-orange-50 text-orange-600 border-0 ml-auto text-[10px]">AtlantaSanad</span>
            </div>
            <NumField label="Contrats actifs" field="contratsActifs" editable={atlantaEditable} />
            <NumField label="Primes (MAD)" field="primes" editable={atlantaEditable} prefix="MAD " />
          </div>

          {/* 5. Vision Sinistres */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-semibold text-gray-900">Vision Sinistres</h3>
              <span className="badge bg-orange-50 text-orange-600 border-0 ml-auto text-[10px]">AtlantaSanad</span>
            </div>
            <NumField label="Sinistres en cours" field="sinistresEnCours" editable={atlantaEditable} />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* 3. Contacts */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-gray-900">Contacts & Dirigeants</h3>
            </div>
            <div className="space-y-3">
              {company.contacts.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Aucun contact renseigné</p>
              ) : company.contacts.map(contact => (
                <div key={contact.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700 flex-shrink-0">
                      {contact.nom.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">{contact.nom}</p>
                      <p className="text-xs text-gray-500">{contact.fonction || "—"}</p>
                      {contact.telephone && <p className="text-xs text-gray-400 mt-1">{contact.telephone}</p>}
                      {contact.email && <p className="text-xs text-blue-600 truncate">{contact.email}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Governance */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">Gouvernance DATA</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500">Source</span>
                <span className="text-xs font-medium text-gray-900">{company.sourceData || "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500">Statut</span>
                <span className={cn("text-xs font-medium", company.statutVerification === "Vérifié" ? "text-emerald-600" : "text-amber-600")}>{company.statutVerification || "—"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-xs text-gray-500">Dernière MAJ</span>
                <span className="text-xs text-gray-900">{formatDate(company.derniereMiseAJour)}</span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-900">Alertes</h3>
              {company.alerts.filter(a => !a.isRead).length > 0 && (
                <span className="badge bg-amber-100 text-amber-700 border-0 ml-auto">{company.alerts.filter(a => !a.isRead).length}</span>
              )}
            </div>
            {company.alerts.length === 0 ? (
              <div className="flex flex-col items-center py-4 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-300 mb-2" />
                <p className="text-xs text-gray-500">Aucune alerte active</p>
              </div>
            ) : company.alerts.map(alert => (
              <div key={alert.id} className={cn("p-2.5 rounded-lg mb-2 text-xs", !alert.isRead ? "bg-amber-50 border border-amber-100" : "bg-gray-50")}>
                <p className="font-medium text-gray-900">{alert.message}</p>
                {alert.newValue && <p className="text-gray-500 mt-1">→ {alert.newValue}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
