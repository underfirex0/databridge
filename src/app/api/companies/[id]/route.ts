import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        contacts: true,
        alerts: { orderBy: { createdAt: 'desc' }, take: 5 },
        merges: { where: { status: 'PENDING' }, take: 3 },
      }
    })
    if (!company) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(company)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Remove non-updatable fields
    const { id: _, createdAt, contacts, alerts, merges, _count, importBatch, ...updateData } = body

    const company = await prisma.company.update({
      where: { id },
      data: {
        ...updateData,
        derniereMiseAJour: new Date(),
        derniereModification: new Date(),
      }
    })
    return NextResponse.json(company)
  } catch (error) {
    console.error('PUT /api/companies/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.company.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 })
  }
}
