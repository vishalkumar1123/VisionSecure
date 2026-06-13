/**
 * Verification Email Template
 * Sent to users after registration
 */

interface VerificationEmailProps {
  name: string
  email: string
  verificationLink: string
  companyName?: string
}

export function VerificationEmail({
  name,
  verificationLink,
  companyName = "VisionSecure Smart Technologies",
}: VerificationEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#1a202c", margin: "0 0 10px 0" }}>{companyName}</h1>
          <p style={{ color: "#718096", margin: "0" }}>Secure Your Business</p>
        </div>

        {/* Main Content */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px" }}>
          <h2 style={{ color: "#2d3748", marginTop: "0" }}>Verify Your Email</h2>

          <p style={{ color: "#4a5568", lineHeight: "1.6" }}>
            Hi <strong>{name}</strong>,
          </p>

          <p style={{ color: "#4a5568", lineHeight: "1.6" }}>
            Thank you for registering with {companyName}. To complete your registration and access your account, please verify your email address by clicking the link below:
          </p>

          {/* CTA Button */}
          <div style={{ textAlign: "center", margin: "30px 0" }}>
            <a
              href={verificationLink}
              style={{
                display: "inline-block",
                backgroundColor: "#3182ce",
                color: "white",
                padding: "12px 30px",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Verify Email Address
            </a>
          </div>

          <p style={{ color: "#718096", fontSize: "14px" }}>
            Or copy and paste this link in your browser:
          </p>
          <p style={{ color: "#3182ce", fontSize: "12px", wordBreak: "break-all" }}>
            {verificationLink}
          </p>

          <p style={{ color: "#4a5568", lineHeight: "1.6" }}>
            This link will expire in 24 hours for security reasons.
          </p>

          <p style={{ color: "#4a5568", lineHeight: "1.6" }}>
            If you didn't create this account, you can safely ignore this email.
          </p>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "30px", color: "#718096", fontSize: "12px" }}>
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    </div>
  )
}

export default VerificationEmail
