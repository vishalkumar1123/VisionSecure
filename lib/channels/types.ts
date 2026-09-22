export type Channel = "WHATSAPP" | "INSTAGRAM" | "FACEBOOK" | "WEBSITE"
export type InboundMessage = { channel: Channel; externalMessageId: string; externalCustomerId: string; name: string; content: string; messageType: string; mediaId?: string; sentAt: Date }
