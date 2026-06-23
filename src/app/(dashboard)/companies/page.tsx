import { Download, Upload } from "lucide-react"
import Link from "next/link"
import CompaniesTable from "@/components/companies/CompaniesTable"

export const dynamic = 'force-dynamic'

export default function CompaniesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Entreprises</h2>
          <p className="text-sm text-gray-500 mt-0.5">Référentiel clients Entreprises — Telecontact × AtlantaSanad</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/api/companies/export" className="btn-secondary">
            <Download className="w-4 h-4" />
            Exporter CSV
          </a>
          <Link href="/import" className="btn-primary">
            <Upload className="w-4 h-4" />
            Importer
          </Link>
        </div>
      </div>
      <CompaniesTable />
    </div>
  )
}
