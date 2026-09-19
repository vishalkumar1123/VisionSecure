import { analyticsAPI } from '@/lib/google/analytics-api'
export const runtime = 'nodejs'
export const maxDuration = 120
export async function GET(request: Request, context: { params: Promise<{ section: string }> }) { return analyticsAPI(request, (await context.params).section) }
export const POST = GET
