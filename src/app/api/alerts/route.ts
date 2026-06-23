import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread') === 'true'

    const alerts = await prisma.alert.findMany({
      where: unreadOnly ? { isRead: false } : {},
      include: { company: { select: { id: true, raisonSociale: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json(alerts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids, markAll } = body

    if (markAll) {
      await prisma.alert.updateMany({ where: { isRead: false }, data: { isRead: true } })
    } else if (ids?.length) {
      await prisma.alert.updateMany({ where: { id: { in: ids } }, data: { isRead: true } })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update alerts' }, { status: 500 })
  }
}
