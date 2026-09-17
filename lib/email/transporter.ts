import "server-only"
// Transporters are created only from encrypted database configuration.
export { createSMTP } from "@/lib/email-config/transport"
