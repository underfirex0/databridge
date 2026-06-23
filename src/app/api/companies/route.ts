import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const sector = searchParams.get('sector') || ''
    const ville = searchParams.get('ville') || ''
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    const conditions: Record<string, unknown>[] = []

    if (search) {
      conditions.push({
        OR: [
          { raisonSociale: { contains: search, mode: 'insensitive' } },
          { nomCommercial: { contains: search, mode: 'insensitive' } },
          { ice: { contains: search } },
          { ville: { contains: search, mode: 'insensitive' } },
        ]
      })
    }
    if (sector) conditions.push({ secteurActivite: { contains: sector, mode: 'insensitive' } })
    if (ville) conditions.push({ ville: { contains: ville, mode: 'insensitive' } })
    if (conditions.length > 0) where.AND = conditions

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          contacts: { where: { isPrincipal: true }, take: 1 },
          _count: { select: { alerts: { where: { isRead: false } } } }
        }
      }),
      prisma.company.count({ where })
    ])

    return NextResponse.json({ companies, total, pages: Math.ceil(total / limit), page })
  } catch (error) {
    console.error('GET /api/companies error:', error)
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const company = await prisma.company.create({ data: body })
    return NextResponse.json(company, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 })
  }
}
