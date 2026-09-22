import { customerCenterAPI } from "@/lib/customer-center/api"
export const runtime = "nodejs"
export const maxDuration = 120
export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) { return customerCenterAPI(request, (await context.params).path) }
export const POST = GET
export const PATCH = GET
