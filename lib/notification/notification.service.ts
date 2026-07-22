import { sendAdminEmailNotification } from "../email/sendEmail";
import { sendAdminWhatsappNotification } from "../whatsapp/sendWhatsapp";
import { INotificationPayload } from "./notification.types";

export class NotificationService {
  static async triggerAdminNotifications({ inquiry, adminEmail, adminPhone }: INotificationPayload) {
    // Background me Email aur WhatsApp dono send karne ke liye
    await Promise.allSettled([
      sendAdminEmailNotification(adminEmail, inquiry),
      sendAdminWhatsappNotification(adminPhone, inquiry)
    ]);
  }
}