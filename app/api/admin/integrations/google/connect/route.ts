import { integrationAPI } from '@/lib/google/integration-api'
export const runtime = 'nodejs'
export const maxDuration = 60
export function POST(request: Request) { return integrationAPI(request, 'connect') }
