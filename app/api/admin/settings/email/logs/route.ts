import { emailAPI } from "@/lib/email-config/api"
export const runtime = "nodejs"
export async function GET(request: Request) { return emailAPI(request, "logs") }
