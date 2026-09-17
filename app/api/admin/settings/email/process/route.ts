import { emailAPI } from "@/lib/email-config/api"
export const runtime = "nodejs"
export const maxDuration = 300
export async function POST(request: Request) { return emailAPI(request, "process") }
