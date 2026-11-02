type Card = { title: string; description: string }
type ServiceContent = { components: [Card, Card, Card, Card]; benefits: [string, string, string, string] }

// Explanations describe selection and agreed scope, not guaranteed outcomes.
export const serviceContent: Record<string, ServiceContent> = {
  "cctv-surveillance": {
    "components": [
      {
        "title": "Cameras and lenses",
        "description": "Choose views and lenses around the detail needed at each entrance, distance and lighting condition."
      },
      {
        "title": "Recorder and storage",
        "description": "Check camera compatibility, channel capacity, recording settings and required retention together."
      },
      {
        "title": "Power and cable routes",
        "description": "Assess the selected cameras, PoE or separate supplies and practical routes before installation."
      },
      {
        "title": "Accounts and playback",
        "description": "Agree user permissions, secure access ownership and playback/export checks at handover."
      }
    ],
    "benefits": [
      "Check that the recorded scene contains the detail needed for the intended task.",
      "Place cameras around actual coverage needs rather than a fixed count for a property size.",
      "Use only the remote functions supported by the recorder, app and connection.",
      "Agree mounting, configuration and recording checks in the installation scope."
    ]
  },
  "biometric-attendance": {
    "components": [
      {
        "title": "Attendance terminal",
        "description": "Choose supported enrolment methods around staff numbers, placement and work conditions."
      },
      {
        "title": "Reporting software",
        "description": "Check shifts, export formats, licences and software compatibility using test data."
      },
      {
        "title": "Network and power",
        "description": "Confirm terminal connections, power requirements and the selected model's offline behaviour."
      },
      {
        "title": "Staff data administration",
        "description": "Assign responsibility for enrolment, corrections, access permissions and retained attendance records."
      }
    ],
    "benefits": [
      "Review missed punches and corrections as part of the attendance workflow.",
      "Test report exports against the format the office actually uses.",
      "Door entry is a separate function requiring compatible access-control equipment.",
      "Confirm capacity and licensing before adding more staff or locations."
    ]
  },
  "access-control-system": {
    "components": [
      {
        "title": "Readers and credentials",
        "description": "Match card, tag or biometric methods to the controller, user groups and enrolment requirements."
      },
      {
        "title": "Door and locking hardware",
        "description": "Assess door condition, lock compatibility, door monitoring and the required opening arrangement together."
      },
      {
        "title": "Controller and power",
        "description": "Check reader interfaces, lock power and supported operation during power or connection loss."
      },
      {
        "title": "Permissions, logs and exit",
        "description": "Agree credential revocation, reporting and data access; have exit arrangements assessed for the premises."
      }
    ],
    "benefits": [
      "Define who can enter each controlled door and when their permission applies.",
      "Confirm which events the selected controller/software records and how authorised users retrieve them.",
      "Document how to issue, replace and revoke the credentials supported by the system.",
      "Test entry, authorised exit and the assessed failure behaviour before handover."
    ]
  },
  "networking-solutions": {
    "components": [
      {
        "title": "Points and cable routes",
        "description": "Count desks, printers and other wired devices, then agree routes and labelled termination points."
      },
      {
        "title": "Router and uplinks",
        "description": "Select routing and uplink capacity for the existing connection and business requirements."
      },
      {
        "title": "Switching and PoE",
        "description": "Check port counts, link speeds and total/per-port power limits for selected powered devices."
      },
      {
        "title": "Tests and port records",
        "description": "Agree the required test level and hand over point labels, port maps and the specified results."
      }
    ],
    "benefits": [
      "Organised routing and labelling make the installed links easier to identify.",
      "Plan the points, uplinks and room for expansion before choosing equipment.",
      "Assess wired links separately from wireless coverage; neither guarantees uninterrupted service.",
      "State troubleshooting, testing and any ongoing maintenance as explicit quotation items."
    ]
  },
  "wifi-mesh-networking": {
    "components": [
      {
        "title": "Access points or mesh nodes",
        "description": "Select compatible devices for the property layout, walls and expected users."
      },
      {
        "title": "Placement and coverage",
        "description": "Assess weak areas and interference, then test the rooms where connectivity matters."
      },
      {
        "title": "Backhaul and power",
        "description": "Check support for wired backhaul and the power/cabling needed by each selected node."
      },
      {
        "title": "Network administration",
        "description": "Agree WiFi settings, guest access, account ownership and any device or licence restrictions."
      }
    ],
    "benefits": [
      "Review coverage in the intended rooms rather than relying on the internet-plan speed alone.",
      "Use the property layout and actual usage to guide access-point locations.",
      "Identify weak areas and test changes; coverage depends on the building and equipment.",
      "Check node compatibility and capacity before extending the selected system."
    ]
  },
  "it-support-amc": {
    "components": [
      {
        "title": "Supported asset list",
        "description": "Record the equipment, condition and existing faults before maintenance cover starts."
      },
      {
        "title": "Preventive checks",
        "description": "Agree the applicable inspections, functional checks and maintenance visit arrangements."
      },
      {
        "title": "Fault reporting and access",
        "description": "Define the contact process, permissions and remote/onsite responsibilities in writing."
      },
      {
        "title": "Records and exclusions",
        "description": "Keep service findings and agreed actions; confirm spares, labour, licences and excluded work."
      }
    ],
    "benefits": [
      "Preventive checks can help identify issues; downtime and response outcomes are not guaranteed.",
      "Agree visit frequency and covered tasks for the actual installed systems.",
      "Technical access and diagnosis depend on the equipment, fault and permissions provided.",
      "Review the supported asset list and contract terms before renewing or expanding cover."
    ]
  },
  "server-networking-infrastructure": {
    "components": [
      {
        "title": "Equipment and rack layout",
        "description": "List equipment dimensions, weight, rack units and maintenance access before selecting a rack."
      },
      {
        "title": "Cabling and uplinks",
        "description": "Plan terminations, port labels and connectivity between servers, switches and existing services."
      },
      {
        "title": "Power and ventilation",
        "description": "Assess connected load, backup requirements and manufacturer operating/clearance instructions."
      },
      {
        "title": "Configuration and handover",
        "description": "Agree change windows, ownership, records and any explicitly included migration or restore checks."
      }
    ],
    "benefits": [
      "A documented layout makes equipment and connections easier to locate.",
      "Provide the access and records needed for the agreed maintenance tasks.",
      "Coordinate installation around equipment requirements and an agreed change window.",
      "Record configuration ownership, test results and the boundaries of ongoing support."
    ]
  },
  "video-door-phone": {
    "components": [
      {
        "title": "Entrance unit",
        "description": "Check visitor view, mounting and the chosen unit's exposure and power requirements."
      },
      {
        "title": "Indoor display",
        "description": "Plan screen count and positions around user needs, the building layout and cable distance."
      },
      {
        "title": "Communication wiring",
        "description": "Verify the selected system against existing cables and any shared building equipment."
      },
      {
        "title": "Visitor access controls",
        "description": "Test supported audio/video functions and any separately agreed door-release interface."
      }
    ],
    "benefits": [
      "Check that the entrance view lets intended users assess visitors.",
      "Verify the supported two-way audio at the entrance and indoor display.",
      "A visitor communication system complements an assessed entrance arrangement.",
      "Agree wiring, mounting and selected-device checks before installation."
    ]
  },
  "smart-door-locks": {
    "components": [
      {
        "title": "Door and lock fit",
        "description": "Check material, thickness, cut-outs and lock dimensions before making alterations."
      },
      {
        "title": "Supported credentials",
        "description": "Choose only the key, code, card or biometric methods the selected lock supports."
      },
      {
        "title": "Power and backup entry",
        "description": "Confirm battery warnings, charging needs and the manufacturer's backup access method."
      },
      {
        "title": "User administration",
        "description": "Agree who can add/remove users and how access is revoked when occupants change."
      }
    ],
    "benefits": [
      "Select entry methods around the people using the door and their access needs.",
      "Revoke or change supported credentials when a user no longer requires access.",
      "Electronic entry also needs power planning and a workable backup access method.",
      "Choose a model after door-fit and operational checks, not appearance alone."
    ]
  },
  "home-automation": {
    "components": [
      {
        "title": "Controls and devices",
        "description": "Start with the lighting or device-control tasks the household actually needs."
      },
      {
        "title": "Wiring and interfaces",
        "description": "Check switch boxes, supply arrangements and supported interfaces before selecting controls."
      },
      {
        "title": "Connectivity and hubs",
        "description": "Confirm protocols, hub requirements and which functions need an internet connection."
      },
      {
        "title": "Accounts and manual use",
        "description": "Agree device ownership, user permissions and supported operation when connectivity is unavailable."
      }
    ],
    "benefits": [
      "Plan controls around useful everyday tasks rather than adding devices without a purpose.",
      "Check specific integrations before expecting different security or control products to interact.",
      "Confirm compatibility before expanding a room or adding another device type.",
      "Test the selected controls and hand over account and operating information."
    ]
  },
  "speaker-solutions": {
    "components": [
      {
        "title": "Speakers and listening areas",
        "description": "Choose coverage around room dimensions, background noise and intended speech or music use."
      },
      {
        "title": "Amplification and zones",
        "description": "Check the selected speaker ratings, amplifier capacity and required announcement zones."
      },
      {
        "title": "Wiring and mounting",
        "description": "Agree cable routes and suitable mounting locations for the actual system."
      },
      {
        "title": "Operation and checks",
        "description": "Define who controls announcements and test audibility in the intended listening areas."
      }
    ],
    "benefits": [
      "Check speech intelligibility where people need to hear announcements.",
      "Plan listening areas and zones before choosing speaker positions.",
      "Confirm component compatibility and the agreed operational checks.",
      "Assess amplifier and wiring capacity before adding more speakers or zones."
    ]
  },
  "glass-break-alarm-system": {
    "components": [
      {
        "title": "Glazing and detector",
        "description": "Check glass type, detector model and the manufacturer's mounting requirements."
      },
      {
        "title": "Panel connection",
        "description": "Confirm supported detector signalling, connections and power for the existing alarm panel."
      },
      {
        "title": "Alert handling",
        "description": "Agree how supported alarms are received, acknowledged and reset by authorised users."
      },
      {
        "title": "Approved testing",
        "description": "Use the selected manufacturer's functional test method and document faults or false-alarm concerns."
      }
    ],
    "benefits": [
      "Glass-break detection addresses a different event from a door/window entry contact.",
      "Check the configured alert path; no detection or notification outcome is guaranteed.",
      "Verify panel compatibility before adding a detector to an existing installation.",
      "Agree placement and approved testing instead of using unsafe breakage tests."
    ]
  },
  "emergency-alarm-system": {
    "components": [
      {
        "title": "Alert initiation",
        "description": "Identify the intended scenario and who is authorised to raise an alert."
      },
      {
        "title": "Notification devices",
        "description": "Determine the areas and users that need supported audible or visible notification."
      },
      {
        "title": "Controller and power",
        "description": "Check interfaces, power arrangements and supported integration with existing equipment."
      },
      {
        "title": "Tests and responsibilities",
        "description": "Agree authorised test procedures, fault reporting and the maintenance owner for each device."
      }
    ],
    "benefits": [
      "Notification can support the agreed response process but does not guarantee a safety outcome.",
      "Check where alerts are needed and how responsible users acknowledge them.",
      "Plan devices and responsibilities around the actual premises and intended scenario.",
      "Agree testing and maintenance scope; a generic alert system is not fire-compliance certification."
    ]
  }
}
