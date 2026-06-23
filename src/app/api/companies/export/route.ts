import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { raisonSociale: 'asc' },
      include: { contacts: { where: { isPrincipal: true }, take: 1 } }
    })

    const headers = [
      'Raison Sociale','Nom Commercial','ICE','RC','IF','CNSS','Forme Juridique',
      'Secteur','Activité Principale','Taille','CA','Ville','Région','Adresse',
      'Téléphone','Email','Site Web','Score Qualité','Contrats Actifs','Statut'
    ]

    const rows = companies.map(c => [
      c.raisonSociale, c.nomCommercial || '', c.ice || '', c.rc || '',
      c.if_ || '', c.cnss || '', c.formeJuridique || '', c.secteurActivite || '',
      c.activitePrincipale || '', c.tailleEntreprise || '',
      c.chiffreAffaires?.toString() || '', c.ville || '', c.region || '',
      c.adressePrincipale || '', c.telephonePrincipal || '', c.emailPrincipal || '',
      c.siteWeb || '', c.qualityScore?.toString() || '', 
      c.contratsActifs?.toString() || '', c.status
    ])

    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="databridge-export.csv"',
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
