import { NextResponse } from "next/server";
import { InquiryService } from "@/models/services/inquiry.service"; // Apne service ka sahi import check karein
import { NotificationService } from "@/lib/notification/notification.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Database me inquiry save karein
    const savedInquiry = await InquiryService.createInquiry(body);
    
    // 2. Get credentials from environment
    const adminEmail = process.env.ADMIN_RECEIVER_EMAIL;
    const adminPhone = process.env.ADMIN_RECEIVER_PHONE;

    console.log("📩 Target Email:", adminEmail);
    console.log("📱 Target Phone:", adminPhone);

    if (adminEmail || adminPhone) {
      console.log("🚀 Triggering Notifications in background...");
      
      // Background me notifications trigger karein
      NotificationService.triggerAdminNotifications({
        inquiry: savedInquiry,
        adminEmail: adminEmail || "",
        adminPhone: adminPhone || "",
      }).then(() => {
        console.log("📢 Notifications process finished.");
      }).catch((err) => {
        console.error("❌ Notification Service Error in Background:", err);
      });
    } else {
      console.warn("⚠️ Warning: ADMIN_RECEIVER_EMAIL or ADMIN_RECEIVER_PHONE is missing in .env.local");
    }

    // Client ko bina delay ke success response bhej dein
    return NextResponse.json({ 
      success: true, 
      message: "Inquiry saved successfully", 
      data: savedInquiry 
    }, { status: 201 });

  } catch (error: any) {
    console.error("❌ API Route Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || "Internal Server Error" 
    }, { status: 500 });
  }
}