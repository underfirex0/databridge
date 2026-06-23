import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const merges = await prisma.mergeSuggestion.findMany({
      where: { status: 'PENDING' },
      include: {
        sourceCompany: { select: { id: true, raisonSociale: true, ice: true, ville: true } },
        targetCompany: { select: { id: true, raisonSociale: true, ice: true, ville: true } },
      },
      orderBy: { confidenceScore: 'desc' },
    })
    return NextResponse.json(merges)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch merges' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, action } = await request.json()
    if (!id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const merge = await prisma.mergeSuggestion.update({
      where: { id },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        resolvedAt: new Date(),
      }
    })

    // If approved, merge companies (keep target, update quality score)
    if (action === 'approve') {
      await prisma.company.update({
        where: { id: merge.targetCompanyId },
        data: { derniereMiseAJour: new Date() }
      })
    }

    return NextResponse.json(merge)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update merge' }, { status: 500 })
  }
}
