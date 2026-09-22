import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/admin-auth"
import { appOrigin } from "@/lib/google/security"
import { Conversation } from "@/models/CustomerCenter"
import { sendReply } from "@/lib/customer-center/dispatch"
import { boundedBody, CenterError, limitRequest } from "@/lib/customer-center/security"
import { centerAudit } from "@/lib/customer-center/events"
export const runtime = "nodejs"
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } })
export async function POST(request: Request) {
  try {
    const { user, response } = await requireAdmin()
    if (response) return response
    if (user!.role !== "super_admin") return json({ error: "SUPER_ADMIN_REQUIRED" }, 403)
    if (request.headers.get("origin") !== appOrigin(request)) return json({ error: "INVALID_ORIGIN" }, 403)
    const input = z.object({ recipient: z.string().regex(/^[1-9]\d{7,14}$/), confirmed: z.literal(true), key: z.string().uuid() }).strict().parse(JSON.parse(await boundedBody(request, 1024)))
    await limitRequest(`explicit-whatsapp-test:${user!.id}`, 3, 60000)
    const conversation = await Conversation.findOne({ channel: "WHATSAPP", phone: input.recipient, mode: "HUMAN_ACTIVE", assignedTo: user!.id }).lean()
    if (!conversation) return json({ error: "START_TEST_CONVERSATION_AND_TAKE_OVER_FIRST" }, 409)
    const result = await sendReply({ conversationId: String(conversation._id), version: conversation.version, content: "VisionSecure connection test. This message was explicitly requested by our administrator.", key: input.key, sender: "ADMIN", actorId: user!.id })
    await centerAudit("WHATSAPP_EXPLICIT_TEST_SEND", String(conversation._id), user!.id)
    return json({ status: result.status })
  } catch (error) { return json({ error: error instanceof CenterError ? error.code : error instanceof z.ZodError || error instanceof SyntaxError ? "INVALID_TEST_REQUEST" : "TEST_SEND_UNAVAILABLE" }, error instanceof CenterError ? error.status : error instanceof z.ZodError || error instanceof SyntaxError ? 400 : 503) }
}
