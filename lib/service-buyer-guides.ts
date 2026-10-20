type BuyerQuestion = { question: string; answer: string }

// Practical buying guidance; no search-volume or ranking claims.
export const serviceBuyerGuides: Record<string, BuyerQuestion[]> = {
  "cctv-surveillance": [
    {
      "question": "How should I plan an IP camera installation?",
      "answer": "For an IP camera installation, check camera placement, PoE switch capacity, cable routes and NVR compatibility together. Share your Lucknow locality, property type and approximate camera count so the quotation matches the site."
    },
    {
      "question": "What matters when choosing CCTV recording storage?",
      "answer": "CCTV recording storage depends on camera count, resolution, frame rate, recording schedule and retention needs. Ask for a storage estimate and test playback and export before handover; a fixed number of recording days should not be assumed."
    },
    {
      "question": "Can I discuss CCTV remote viewing setup?",
      "answer": "A CCTV remote viewing setup needs compatible equipment, a suitable internet connection and secure user access. Confirm account ownership and permissions, and keep passwords and recordings out of the enquiry form."
    }
  ],
  "biometric-attendance": [
    {
      "question": "What should I check for a fingerprint attendance system?",
      "answer": "Choose a fingerprint attendance system around staff count, work conditions, enrolment needs and device placement. Discuss shifts and report requirements before selecting a device for your Lucknow office or institution."
    },
    {
      "question": "Is a face recognition attendance system suitable for our staff?",
      "answer": "A face recognition attendance system should be assessed for lighting, placement, enrolment and employee data handling. Confirm the supported recognition method and operational requirements rather than assuming every device works the same way."
    },
    {
      "question": "How do I assess attendance software integration?",
      "answer": "For attendance software integration, provide the software name, version and required report formats. Device compatibility, licence costs and payroll export requirements must be confirmed before ordering; payroll integration is not assumed."
    }
  ],
  "networking-solutions": [
    {
      "question": "What is included in a LAN cabling installation?",
      "answer": "A LAN cabling installation can include planned cable routes, network points, termination and labelling as agreed in the quotation. Share your Lucknow site layout, number of desks and existing equipment so the scope can be assessed."
    },
    {
      "question": "How should I plan office network setup?",
      "answer": "For an office network setup, count wired devices, printers, access points and uplink requirements. Plan switching, router configuration and user access together. WiFi coverage and server migration should have an explicit scope."
    },
    {
      "question": "What checks should structured cabling testing include?",
      "answer": "Agree structured cabling testing requirements before work starts: point identification, termination checks and connectivity checks should be documented. If formal cable certification is required, confirm the test method, equipment and report separately."
    }
  ],
  "it-support-amc": [
    {
      "question": "What should a CCTV maintenance contract cover?",
      "answer": "A CCTV maintenance contract should identify supported cameras and recorders, preventive checks, recording and playback checks, and fault-reporting arrangements. State existing faults before cover starts and confirm replacement parts and visits in writing."
    },
    {
      "question": "How do I scope an IT AMC service?",
      "answer": "An IT AMC service should list supported computers and network equipment, maintenance tasks and access responsibilities. For a Lucknow site, agree whether support is remote or onsite; software licences, backups and data recovery need explicit inclusion."
    },
    {
      "question": "Can I request network troubleshooting?",
      "answer": "For network troubleshooting, describe affected devices, symptoms and when the issue started. Share the locality and system type without passwords or private data. An inspection can establish whether the fault belongs to cabling, equipment, configuration or an external provider."
    }
  ]
}
