import { NextResponse } from "next/server";
import { InquiryService } from "@/models/services/inquiry.service";
import { NotificationService } from "@/lib/notification/notification.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    // 1. Basic Validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Database me save karein
    const savedInquiry = await InquiryService.createInquiry({ name, email, phone, subject, message });

    // 3. Admin credentials (.env se uthayein)
    const ADMIN_EMAIL = process.env.ADMIN_RECEIVER_EMAIL || "admin@visionsecuretech.in";
    const ADMIN_PHONE = process.env.ADMIN_RECEIVER_PHONE || "919999999999"; // With Country Code

    // 4. Background me Notification triggers (Bina await kiye for fast response)
    NotificationService.triggerAdminNotifications({
      inquiry: { name, email, phone, subject, message },
      adminEmail: ADMIN_EMAIL,
      adminPhone: ADMIN_PHONE
    }).catch(err => console.error("Background Notification Error:", err));

    // 5. Instantly user ko success return karein
    return NextResponse.json({ 
      success: true, 
      message: "Inquiry submitted successfully!", 
      data: savedInquiry 
    }, { status: 201 });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}