import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalCompanies,
      companies,
      alertsCount,
      mergesCount,
    ] = await Promise.all([
      prisma.company.count(),
      prisma.company.findMany({ select: { qualityScore: true } }),
      prisma.alert.count({ where: { isRead: false } }),
      prisma.mergeSuggestion.count({ where: { status: 'PENDING' } }),
    ])

    const avgQuality = companies.length > 0
      ? Math.round(companies.reduce((sum, c) => sum + (c.qualityScore || 0), 0) / companies.length)
      : 0

    const distribution = {
      excellent: companies.filter(c => (c.qualityScore || 0) >= 90).length,
      good: companies.filter(c => (c.qualityScore || 0) >= 70 && (c.qualityScore || 0) < 90).length,
      fair: companies.filter(c => (c.qualityScore || 0) >= 50 && (c.qualityScore || 0) < 70).length,
      poor: companies.filter(c => (c.qualityScore || 0) < 50).length,
    }

    return NextResponse.json({ totalCompanies, avgQuality, alertsCount, mergesCount, distribution })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
