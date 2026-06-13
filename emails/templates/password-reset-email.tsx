/**
 * Password Reset Email Template
 * Sent when user requests password reset
 */

interface PasswordResetEmailProps {
  name: string
  resetLink: string
  companyName?: string
}

export function PasswordResetEmail({
  name,
  resetLink,
  companyName = "VisionSecure Smart Technologies",
}: PasswordResetEmailProps) {
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
          <h2 style={{ color: "#2d3748", marginTop: "0" }}>Reset Your Password</h2>

          <p style={{ color: "#4a5568", lineHeight: "1.6" }}>
            Hi <strong>{name}</strong>,
          </p>

          <p style={{ color: "#4a5568", lineHeight: "1.6" }}>
            We received a request to reset the password for your {companyName} account. Click the link below to set a new password:
          </p>

          {/* CTA Button */}
          <div style={{ textAlign: "center", margin: "30px 0" }}>
            <a
              href={resetLink}
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
              Reset Password
            </a>
          </div>

          <p style={{ color: "#718096", fontSize: "14px" }}>
            Or copy and paste this link in your browser:
          </p>
          <p style={{ color: "#3182ce", fontSize: "12px", wordBreak: "break-all" }}>
            {resetLink}
          </p>

          <div
            style={{
              backgroundColor: "#fed7d7",
              border: "1px solid #fc8181",
              borderRadius: "6px",
              padding: "15px",
              marginTop: "20px",
              color: "#c53030",
            }}
          >
            <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>⚠️ Security Notice</p>
            <ul style={{ margin: "0", paddingLeft: "20px" }}>
              <li>This link will expire in 1 hour for security reasons</li>
              <li>Never share this link with anyone</li>
              <li>If you didn't request this, ignore this email</li>
            </ul>
          </div>

          <p style={{ color: "#4a5568", lineHeight: "1.6", marginTop: "20px" }}>
            If you have any trouble resetting your password, contact our support team.
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

export default PasswordResetEmail
