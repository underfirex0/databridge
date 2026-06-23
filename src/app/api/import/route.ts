import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import Papa from 'papaparse'

// Column mapping: CSV header → DB field
const COLUMN_MAP: Record<string, string> = {
  'RAISON_SOCIALE': 'raisonSociale', 'NOM_ENTREPRISE': 'raisonSociale',
  'NOM ENTREPRISE': 'raisonSociale', 'RAISON SOCIALE': 'raisonSociale',
  'NOM_COMMERCIAL': 'nomCommercial', 'NOM COMMERCIAL': 'nomCommercial',
  'ICE': 'ice', 'ICE_NUM': 'ice', 'NUM_ICE': 'ice',
  'RC': 'rc', 'RC_NUMBER': 'rc', 'NUM_RC': 'rc',
  'IF': 'if_', 'IF_FISCAL': 'if_', 'IDENTIFIANT_FISCAL': 'if_',
  'CNSS': 'cnss', 'NUM_CNSS': 'cnss',
  'VILLE': 'ville', 'CITY': 'ville',
  'REGION': 'region',
  'ADRESSE': 'adressePrincipale', 'ADDRESS': 'adressePrincipale',
  'TELEPHONE': 'telephonePrincipal', 'PHONE': 'telephonePrincipal', 'TEL': 'telephonePrincipal',
  'EMAIL': 'emailPrincipal', 'EMAIL_CONTACT': 'emailPrincipal',
  'SITE_WEB': 'siteWeb', 'WEBSITE': 'siteWeb',
  'SECTEUR': 'secteurActivite', 'SECTEUR_ACTIVITE': 'secteurActivite',
  'ACTIVITE': 'activitePrincipale', 'ACTIVITE_PRINCIPALE': 'activitePrincipale',
  'FORME_JURIDIQUE': 'formeJuridique', 'FORME JURIDIQUE': 'formeJuridique',
  'TAILLE': 'tailleEntreprise', 'TAILLE_ENTREPRISE': 'tailleEntreprise',
  'CA': 'chiffreAffaires', 'CHIFFRE_AFFAIRES': 'chiffreAffaires',
  'DATE_CREATION': 'dateCreation', 'DATE CREATION': 'dateCreation',
}

function calcQualityScore(data: Record<string, unknown>): number {
  const fields = ['raisonSociale','ice','rc','if_','cnss','ville','adressePrincipale',
    'telephonePrincipal','emailPrincipal','secteurActivite','formeJuridique']
  const filled = fields.filter(f => data[f] && String(data[f]).trim() !== '').length
  return Math.round((filled / fields.length) * 100)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const text = await file.text()
    const { data: rows, errors } = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toUpperCase(),
    })

    if (errors.length > 0 && rows.length === 0) {
      return NextResponse.json({ error: 'Invalid CSV file' }, { status: 400 })
    }

    // Create import batch record
    const batch = await prisma.importBatch.create({
      data: { filename: file.name, totalRows: rows.length, status: 'processing' }
    })

    let imported = 0
    let updated = 0
    const importErrors: { row: number; error: string }[] = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      try {
        // Map columns to DB fields
        const mapped: Record<string, unknown> = {}
        for (const [csvCol, value] of Object.entries(row)) {
          const dbField = COLUMN_MAP[csvCol.trim().toUpperCase()]
          if (dbField && value?.trim()) {
            if (dbField === 'chiffreAffaires') {
              mapped[dbField] = parseFloat(value.replace(/[^0-9.]/g, '')) || null
            } else if (dbField === 'dateCreation') {
              mapped[dbField] = new Date(value) || null
            } else {
              mapped[dbField] = value.trim()
            }
          }
        }

        if (!mapped.raisonSociale) {
          importErrors.push({ row: i + 2, error: 'Missing raison sociale' })
          continue
        }

        mapped.qualityScore = calcQualityScore(mapped)
        mapped.sourceData = 'Import CSV'
        mapped.statutVerification = 'À vérifier'
        mapped.derniereMiseAJour = new Date()
        mapped.importBatchId = batch.id

        // Upsert by ICE if available
        if (mapped.ice) {
          const existing = await prisma.company.findUnique({ where: { ice: String(mapped.ice) } })
          if (existing) {
            await prisma.company.update({ where: { id: existing.id }, data: mapped })
            updated++
            continue
          }
        }

        await prisma.company.create({ data: mapped as Parameters<typeof prisma.company.create>[0]['data'] })
        imported++
      } catch (err) {
        importErrors.push({ row: i + 2, error: String(err) })
      }
    }

    await prisma.importBatch.update({
      where: { id: batch.id },
      data: {
        importedRows: imported + updated,
        errorRows: importErrors.length,
        status: 'completed',
        completedAt: new Date(),
        errorsJson: importErrors,
      }
    })

    return NextResponse.json({
      batchId: batch.id,
      total: rows.length,
      imported,
      updated,
      errors: importErrors.length,
      errorDetails: importErrors.slice(0, 10),
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Import failed: ' + String(error) }, { status: 500 })
  }
}
