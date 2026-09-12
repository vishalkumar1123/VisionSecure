import { POST as createLead } from "@/app/api/leads/route"

export async function POST(request: Request) {
  const body = await request.json()
  return createLead(new Request(request.url, {
    method: "POST",
    headers: request.headers,
    body: JSON.stringify({ name: body.name, email: body.email, phone: body.phone, service: body.service || body.requirement || body.subject || "General Inquiry", message: body.message, source: "Website" }),
  }))
}
