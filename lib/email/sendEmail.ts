import { resend } from './resend';
import { getAdminInquiryEmailTemplate } from './templates';
import { IInquiryInput } from '@/types/inquiry';

export async function sendAdminEmailNotification(to: string, inquiryData: IInquiryInput) {
  try {
    const htmlContent = getAdminInquiryEmailTemplate(inquiryData);
    
    // 🟢 Testing ke liye standard onboarding address use karein
    const response = await resend.emails.send({
       from: process.env.MAIL_FROM!,
      // from: 'VisionSecure Smart Technologies <info@visionsecuretech.in>',
      to: [to], // Ye email wahi honi chahiye jisse aapne Resend pe signup kiya hai
      subject: `📢 New Website Inquiry from ${inquiryData.name}`,
      html: htmlContent,
    });

    if ('error' in response && response.error) {
      throw new Error(JSON.stringify(response.error));
    }

    console.log("✅ Email sent successfully. ID:", response);
    return response;
  } catch (error: any) {
    console.error("❌ Resend Email Error:", error?.message || error);
    throw error;
  }
}