"use client"

import { useState, useEffect, useCallback } from "react"
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender, type ColumnDef, type SortingState } from "@tanstack/react-table"
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Search, SlidersHorizontal, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import { cn, getQualityBg } from "@/lib/utils"

interface Company {
  id: string; raisonSociale: string; nomCommercial: string | null
  ice: string | null; ville: string | null; secteurActivite: string | null
  formeJuridique: string | null; tailleEntreprise: string | null
  contratsActifs: number | null; qualityScore: number | null; status: string
}

interface ApiResponse {
  companies: Company[]; total: number; pages: number; page: number
}

export default function CompaniesTable() {
  const [data, setData] = useState<Company[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: "12", search: debouncedSearch })
      const res = await fetch(`/api/companies?${params}`)
      const json: ApiResponse = await res.json()
      setData(json.companies || [])
      setTotal(json.total || 0)
      setPages(json.pages || 1)
    } catch (error) {
      console.error("Failed to fetch companies:", error)
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch])

  useEffect(() => { fetchCompanies() }, [fetchCompanies])
  useEffect(() => { setPage(1) }, [debouncedSearch])

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: "raisonSociale",
      header: "Raison sociale",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
            {row.original.raisonSociale.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <Link href={`/companies/${row.original.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-700 transition-colors truncate block">
              {row.original.raisonSociale}
            </Link>
            <p className="text-xs text-gray-400 truncate">ICE: {row.original.ice || "—"}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "ville", header: "Ville", cell: ({ getValue }) => <span className="text-sm text-gray-700">{String(getValue() || "—")}</span> },
    {
      accessorKey: "secteurActivite", header: "Secteur",
      cell: ({ getValue }) => getValue() ? <span className="badge bg-gray-100 text-gray-600 border-0">{String(getValue())}</span> : <span className="text-gray-400">—</span>
    },
    { accessorKey: "formeJuridique", header: "Forme", cell: ({ getValue }) => <span className="text-sm text-gray-600">{String(getValue() || "—")}</span> },
    { accessorKey: "tailleEntreprise", header: "Taille", cell: ({ getValue }) => <span className="text-sm text-gray-600">{String(getValue() || "—")}</span> },
    {
      accessorKey: "contratsActifs", header: "Contrats",
      cell: ({ getValue }) => { const v = getValue() as number | null; return <span className={cn("text-sm font-medium", v ? "text-gray-900" : "text-gray-400")}>{v ?? "—"}</span> }
    },
    {
      accessorKey: "qualityScore", header: "Qualité",
      cell: ({ getValue }) => {
        const score = (getValue() as number | null) ?? 0
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full", score >= 90 ? "bg-emerald-500" : score >= 70 ? "bg-blue-500" : score >= 50 ? "bg-amber-400" : "bg-red-400")} style={{ width: `${score}%` }} />
            </div>
            <span className={cn("badge border text-xs", getQualityBg(score))}>{score}%</span>
          </div>
        )
      }
    },
    {
      id: "actions", header: "",
      cell: ({ row }) => (
        <Link href={`/companies/${row.original.id}`} className="btn-ghost p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      )
    },
  ]

  const table = useReactTable({ data, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), manualPagination: true, pageCount: pages })

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une entreprise..." className="input-base pl-8 py-1.5 text-xs" />
        </div>
        <button className="btn-secondary py-1.5 text-xs"><SlidersHorizontal className="w-3.5 h-3.5" />Filtres</button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-gray-500">Aucune entreprise trouvée</p>
            <Link href="/import" className="text-xs text-blue-600 hover:text-blue-700 mt-2 block">Importer des données →</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {table.getHeaderGroups().map(hg => hg.headers.map(header => (
                  <th key={header.id} onClick={header.column.getToggleSortingHandler()} className={cn("text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-2.5 whitespace-nowrap", header.column.getCanSort() && "cursor-pointer hover:text-gray-700 select-none")}>
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && <span className="text-gray-300">{header.column.getIsSorted() === "asc" ? <ChevronUp className="w-3 h-3" /> : header.column.getIsSorted() === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronsUpDown className="w-3 h-3" />}</span>}
                    </div>
                  </th>
                )))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="group border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">{total} résultats · Page {page} sur {pages}</p>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost p-1.5 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="btn-ghost p-1.5 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  )
}
