/**
 * Welcome Email Template
 * Sent to newly registered users after email verification
 */

interface WelcomeEmailProps {
  name: string
  email: string
  companyName?: string
  loginUrl?: string
}

export function WelcomeEmail({
  name,
  email,
  companyName = "VisionSecure Smart Technologies",
  loginUrl = "https://app.visionsecuretech.in/admin/login",
}: WelcomeEmailProps) {
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
          <h2 style={{ color: "#2d3748", marginTop: "0" }}>Welcome to {companyName}!</h2>

          <p style={{ color: "#4a5568", lineHeight: "1.6" }}>
            Hi <strong>{name}</strong>,
          </p>

          <p style={{ color: "#4a5568", lineHeight: "1.6" }}>
            Welcome to {companyName}! Your account has been successfully created and verified. You're now ready to manage your CCTV, Biometric, Access Control, and other security solutions.
          </p>

          {/* Quick Start */}
          <div
            style={{
              backgroundColor: "#edf2f7",
              borderLeft: "4px solid #3182ce",
              padding: "15px",
              margin: "20px 0",
              borderRadius: "4px",
            }}
          >
            <h3 style={{ color: "#2d3748", marginTop: "0" }}>Quick Start</h3>
            <ul style={{ color: "#4a5568", margin: "10px 0" }}>
              <li>Access your dashboard</li>
              <li>View and manage leads</li>
              <li>Track service tickets</li>
              <li>Generate quotations</li>
              <li>Monitor activity logs</li>
            </ul>
          </div>

          {/* CTA Button */}
          <div style={{ textAlign: "center", margin: "30px 0" }}>
            <a
              href={loginUrl}
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
              Go to Dashboard
            </a>
          </div>

          {/* Account Info */}
          <div style={{ backgroundColor: "#f7fafc", padding: "15px", borderRadius: "6px", margin: "20px 0" }}>
            <p style={{ margin: "0 0 10px 0", color: "#2d3748", fontWeight: "bold" }}>Account Information</p>
            <table style={{ width: "100%", color: "#4a5568" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "5px 0", fontWeight: "bold" }}>Email:</td>
                  <td style={{ padding: "5px 0" }}>{email}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ color: "#4a5568", lineHeight: "1.6" }}>
            If you have any questions or need assistance, feel free to contact our support team.
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

export default WelcomeEmail
