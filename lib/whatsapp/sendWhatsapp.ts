import { IInquiryInput } from "@/types/inquiry";

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;

export async function sendAdminWhatsappNotification(adminPhone: string, inquiryData: IInquiryInput) {
  if (!META_ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    console.warn("⚠️ Meta WhatsApp credentials missing. Skipping WhatsApp.");
    return;
  }

  try {
    const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    
    // Yahan hum Meta ka standard utility template or custom parameters use kar rahe hain.
    // Make sure aapka template components parameters ko match kare.
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: adminPhone, // Format: 91XXXXXXXXXX (with country code)
        type: "template",
        template: {
          name: "new_inquiry_alert", // Apne Meta dashboard wale template ka naam likhein
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: inquiryData.name },
                { type: "text", text: inquiryData.phone },
                { type: "text", text: inquiryData.message.substring(0, 100) } // Message short limit ke liye
              ]
            }
          ]
        }
      })
    });

    const result = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(result));

    console.log("✅ WhatsApp notification sent successfully");
  } catch (error) {
    console.error("❌ Failed to send WhatsApp notification:", error);
  }
}