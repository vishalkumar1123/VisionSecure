import { IInquiryInput } from "@/types/inquiry";

export const getAdminInquiryEmailTemplate = (data: IInquiryInput) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; background-color: #f9fafb; color: #1f2937;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-top: 4px solid #0284c7; padding: 24px;">
        
        <h2 style="color: #0284c7; margin-top: 0; font-size: 22px;">🚨 New Inquiry Received</h2>
        <p style="font-size: 16px; color: #4b5563;">A visitor filled out the contact form on <strong>visionsecuretech.in</strong>.</p>
        
        <div style="margin-top: 24px; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; width: 30%;">Field</th>
              <th style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">Details</th>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; font-size: 14px;">Name</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; font-size: 14px;">Email</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px;"><a href="mailto:${data.email}" style="color: #0284c7; text-decoration: none;">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; font-size: 14px;">Phone</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px;"><a href="tel:${data.phone}" style="color: #0284c7; text-decoration: none;">${data.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; font-size: 14px;">Subject</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${data.subject || 'Not Provided'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; font-size: 14px; vertical-align: top;">Message</td>
              <td style="padding: 12px; font-size: 14px; white-space: pre-line;">${data.message}</td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 24px; font-size: 12px; color: #9ca3af; text-align: center;">
          This is an automated notification from Vision Secure Tech system.
        </div>
      </div>
    </div>
  `;
};