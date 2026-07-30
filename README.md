# 📋 Campus Grievance Redressal and Maintenance Tracker

> An end-to-end ticket management system for hostels, mess, and academic blocks.
> **One ticket ID, one accountable owner, one visible timeline** — no complaints get lost.

---

## 🎯 About the Project

The **Campus Grievance Redressal and Maintenance Tracker** replaces scattered registers, WhatsApp groups, and email chains with a unified, auditable ticketing system. Every complaint — whether a broken fan in a hostel room, a leaking pipe in the mess, or a faulty projector in an academic block — gets:

- A **unique ticket ID**
- An **assigned owner**
- A **visible SLA timeline**

Students can report issues via QR codes placed across 500+ campus points, a dedicated PWA app, or even WhatsApp. The system auto-routes tickets to the correct department, starts an SLA clock, and escalates automatically if resolution is delayed. The closed-loop workflow ensures that only the reporting student can confirm a fix, preventing false closures.

All status changes are cryptographically timestamped in a **hash-chained Escalation Ledger**, making the system independently auditable — a first for campus grievance management.

---

## 🔗 Live Demo

🔜 **Pilot deployment in progress** — the live URL will be added here once available.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **QR-tag Reporting** | Scan QR codes at 500+ campus locations to file a complaint instantly. |
| **Photo/Video Attachment** | Upload media with automatic severity tagging via AI/ML classifiers. |
| **Auto-Routing & SLA** | Location + category matrix routes tickets; SLA clock starts immediately. |
| **Escalation Ladder** | Technician → Warden → Dean; auto-escalates if SLA is breached. |
| **Tamper-Evident Ledger** | Blockchain-based hash chain timestamps every status change. |
| **Student Confirmation** | Ticket cannot be closed without the student's verification. |
| **Multi-Channel Reporting** | PWA, WhatsApp Business API, SMS fallback for low-connectivity areas. |
| **Analytics Dashboard** | Real-time insights for wardens and the Estate Office. |

---

## 🔄 Workflow

```
Report → Auto-route → Resolve → Escalate (if needed) → Confirm → Close & Log
```

1. **Report** — QR scan, app, or WhatsApp
2. **Auto-Route** — Category + location matrix; SLA clock starts
3. **Resolve** — Assigned staff attends & updates status
4. **Escalate** — Auto-escalates to next tier if SLA breached
5. **Confirm** — Student verifies fix & rates the resolution
6. **Close & Log** — Ticket closed; entry sealed in the Escalation Ledger

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Languages** | TypeScript, Python |
| **Frontend** | React.js + Tailwind CSS (Admin Web Portal), Flutter (PWA for hostel Android phones) |
| **Backend** | Node.js + Express (ticket & routing), Django REST Framework (analytics) |
| **AI/ML** | Text classifier + image severity scoring |
| **Database** | PostgreSQL (tickets), Redis (SLA queue) |
| **Blockchain** | Hash-chained Escalation Ledger |
| **Integrations** | QR generation/scanning, Firebase Cloud Messaging, WhatsApp Business API, Twilio |

---

## 📂 Project Structure

Current layout in the repository:

```
TechTinkerers-Swastik/
├── client/                 # Frontend application
├── server/                 # Backend application
└── README.md
```

Planned expansion as the project grows:

```
campus-grievance-tracker/
├── frontend/
│   ├── admin-web/          # React + Tailwind dashboard
│   └── pwa/                # Flutter PWA
├── backend/
│   ├── ticket-engine/      # Node.js + Express
│   └── analytics/          # Django REST
├── ai-ml/                  # Classifiers & severity models
├── blockchain/             # Escalation Ledger (hash chain)
├── infrastructure/         # Redis, Postgres configs
└── docs/                   # SOPs, wireframes, pilot data
```

---

## 🚀 Getting Started

### Clone & Install

```bash
git clone https://github.com/swastiksinha1/TechTinkerers-Swastik.git
cd TechTinkerers-Swastik
```

### Server

```bash
cd server
npm install
cp .env.example .env          # configure DB, Redis, API keys
npm run dev
```

### Client

```bash
cd client
npm install
npm start
```

> As additional services (analytics, mobile PWA, blockchain ledger, etc.) are added, their setup steps will be documented here.

---

## 📱 Usage

- **Students** — Scan QR codes or open the PWA to file complaints, attach media, track status, and confirm resolution.
- **Staff** — Receive tickets via WhatsApp or the admin dashboard; update status and communicate with students.
- **Wardens/Admins** — Monitor SLAs, view analytics, and escalate issues when needed.
- **Estate Office** — Access the Escalation Ledger for audit trails and generate reports for NAAC/NBA compliance.

---

## 👥 Team — Tech Tinkerers
<div align="center">
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/RishiRaj1495">
        <img src="https://avatars.githubusercontent.com/RishiRaj1495" width="80px" style="border-radius:50%; border: 2px solid #c8f135;" alt="Rishi Raj"/><br/>
        <sub><b>Rishi Raj</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/swastiksinha1">
        <img src="https://avatars.githubusercontent.com/swastiksinha1" width="80px" style="border-radius:50%; border: 2px solid #c8f135;" alt="Swastik Sinha"/><br/>
        <sub><b>Swastik Sinha</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Abhilash-2210">
        <img src="https://avatars.githubusercontent.com/Abhilash-2210" width="80px" style="border-radius:50%; border: 2px solid #c8f135;" alt="Abhilash Singh"/><br/>
        <sub><b>Abhilash Singh</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ari9516">
        <img src="https://avatars.githubusercontent.com/ari9516" width="80px" style="border-radius:50%; border: 2px solid #c8f135;" alt="ari9516"/><br/>
        <sub><b>ari9516</b></sub>
      </a>
    </td>
  </tr>
</table>
</div>
---


## ⚠️ Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Departments ignore SLA timers | Leadership enforcement; dashboard transparency; Escalation Ledger makes breaches visible. |
| Students prefer direct messaging over QR/app | Orientation-week push; hostel-committee buy-in; WhatsApp fallback reduces friction. |
| Poor network connectivity | SMS/WhatsApp fallback; lightweight PWA designed for slow Wi-Fi. |
| AI severity misclassifies urgent issues | Allow students to manually flag "urgent," overriding the model's score. |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.





