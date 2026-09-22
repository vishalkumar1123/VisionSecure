import { integrationAPI } from "@/lib/google/integration-api"
export const runtime = "nodejs"
export function POST(request: Request) { return integrationAPI(request, "configure") }
