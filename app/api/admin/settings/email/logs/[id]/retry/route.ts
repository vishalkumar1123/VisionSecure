import { emailAPI } from "@/lib/email-config/api"
export const runtime = "nodejs"
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) { return emailAPI(request, "retry", (await context.params).id) }
