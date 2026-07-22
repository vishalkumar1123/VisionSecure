import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  // Build ko fail karne ke bajay warning dega taaki runtime par error na aaye aur build pass ho jaye
  console.warn("⚠️ Warning: RESEND_API_KEY is missing in environment variables.");
}

// Agar key nahi milti toh temporary dummy key use karega taaki build na tute
export const resend = new Resend(apiKey || 're_mock_key_for_build');