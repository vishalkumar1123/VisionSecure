import { emailAPI } from "@/lib/email-config/api"
export const runtime = "nodejs"
export async function POST(request: Request) { return emailAPI(request, "disable") }
