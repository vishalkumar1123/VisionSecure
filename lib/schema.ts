// lib/schema.ts

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",

  name: "VisionSecure Smart Technologies",

  url: "https://visionsecuretech.in",

  logo: "https://visionsecuretech.in/images/logo.png",

  image: "https://visionsecuretech.in/images/logo.png",

  description:
    "VisionSecure Smart Technologies provides CCTV Camera Installation, Biometric Attendance Systems, Access Control, Fire Alarm Systems, Networking, Smart Home Automation and Security Solutions across India.",

  email: "info@visionsecuretech.in",

  telephone: "+91-9872133840",

  sameAs: [
    "https://www.facebook.com/profile.php?id=61584897029759",
    "https://www.instagram.com/visionsecure_tech/",
    "https://www.youtube.com/@visionsecure_tech"
  ]
}

export const websiteSchema = {
  "@context": "https://schema.org",

  "@type": "WebSite",

  name: "VisionSecure Smart Technologies",

  url: "https://visionsecuretech.in",

  potentialAction: {
    "@type": "SearchAction",

    target:
      "https://visionsecuretech.in/blog?search={search_term_string}",

    "query-input": "required name=search_term_string"
  }
}