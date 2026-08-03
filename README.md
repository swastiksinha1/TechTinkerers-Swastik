<div align="center">

<img src="assets/image.png" alt="CampusTriage Banner" width="100%" />

<br/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1200&color=C77DFF&center=true&vCenter=true&width=760&lines=One+ticket+ID.+One+accountable+owner.+One+visible+timeline.;No+complaint+gets+lost+in+a+register+again.;Report+%E2%86%92+AI+Triage+%E2%86%92+Resolve+%E2%86%92+Confirm+%E2%86%92+Closed.)](https://git.io/typing-svg)

<a href="https://tech-tinkerers-swastik.vercel.app/">
  <img src="https://img.shields.io/badge/🔗_LIVE_DEMO-tech--tinkerers--swastik.vercel.app-c77dff?style=for-the-badge&labelColor=10002b" />
</a>

</div>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:10002b,100:3c096c&height=3&width=100%" width="100%"/>

## 🎯 About the Project

**CampusTriage** replaces scattered registers and WhatsApp groups with a unified, transparent ticketing system for campus maintenance. Whether it's a broken fan, leaking pipe, or IT issue, the system provides:

- 🎫 A **unique ticket ID**
- 👤 An **assigned owner**
- ⏱️ A **visible SLA timeline**

Students can report issues by manually selecting locations through a dedicated web portal. The system auto-routes tickets to the correct department using AI triage, starts an SLA clock, and escalates automatically if resolution is delayed. The closed-loop workflow ensures that only the reporting student can confirm a fix, preventing false closures.

All status changes are cryptographically timestamped in a **hash-chained Escalation Ledger**, making the system independently auditable — a first for campus grievance management.

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=0:3c096c,100:10002b&height=3&width=100%" width="100%"/>
</div>

## 🔗 Live Demo

<div align="center">

### **[tech-tinkerers-swastik.vercel.app](https://tech-tinkerers-swastik.vercel.app/)**

</div>

## 🖥️ Preview

<div align="center">
<img src="assets/1.png" width="90%" />
<br/><br/>
<img src="assets/2.png" width="90%" />
<br/><br/>
<img src="assets/3.png" width="90%" />
<br/><br/>
<img src="assets/4.png" width="90%" />
</div>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:10002b,100:3c096c&height=3&width=100%" width="100%"/>

## ✨ Key Features

<div align="center">

| Feature | Description |
|---|---|
| 🏫 **Student Portal** | Students can manually select locations and instantly file complaints. Supports image uploads for visual context. |
| 🧠 **Smart AI Triage (Gemini)** | Automatically analyzes complaint text and images to assign the correct department and priority (LOW to CRITICAL). |
| 🛠️ **Technician Dashboard** | Dedicated view for maintenance staff to see assigned tickets and update resolution status. |
| 🗺️ **Campus Heatmap** | Interactive Leaflet-based map visualizing the density and locations of active complaints across campus. |
| 👍 **Public Feed & Upvoting** | A transparent, Reddit-style feed where students can view and upvote common issues. |
| 📊 **Live NOC (Admin Dashboard)** | Real-time monitoring of system SLAs, active tickets, and overall maintenance health. |
| 🔒 **Hash-Chained Audit Logs** | Every ticket update is cryptographically hashed to prevent tampering. |

</div>

## 🔄 Workflow

<div align="center">

```mermaid
graph LR
    A[📱 Report] -->|Student Portal| B[🧠 AI Triage & Route]
    B -->|SLA clock starts| C[🔧 Resolve]
    C -->|Fix applied| D[✅ Confirm]
    D -->|Student verifies| E[🔒 Close & Log]

    style A fill:#10002b,stroke:#c77dff,color:#e8e8e0
    style B fill:#10002b,stroke:#c77dff,color:#e8e8e0
    style C fill:#10002b,stroke:#c77dff,color:#e8e8e0
    style D fill:#10002b,stroke:#c77dff,color:#e8e8e0
    style E fill:#10002b,stroke:#c77dff,color:#e8e8e0
```

</div>

1. **Report** — Web portal with manual location tagging
2. **AI Triage** — Gemini analyzes issue severity and department
3. **Auto-Route** — Ticket is assigned; SLA clock starts
4. **Resolve** — Assigned staff attends & updates status
5. **Confirm** — Student verifies fix & rates the resolution
6. **Close & Log** — Ticket closed; entry sealed in the Escalation Ledger

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:3c096c,100:10002b&height=3&width=100%" width="100%"/>

## 🛠️ Tech Stack

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-10002b?style=for-the-badge&logo=typescript&logoColor=c77dff)
![React](https://img.shields.io/badge/React-10002b?style=for-the-badge&logo=react&logoColor=c77dff)
![Tailwind](https://img.shields.io/badge/TailwindCSS-10002b?style=for-the-badge&logo=tailwindcss&logoColor=c77dff)
![Vite](https://img.shields.io/badge/Vite-10002b?style=for-the-badge&logo=vite&logoColor=c77dff)
![Node.js](https://img.shields.io/badge/Node.js-10002b?style=for-the-badge&logo=nodedotjs&logoColor=c77dff)
![Express](https://img.shields.io/badge/Express-10002b?style=for-the-badge&logo=express&logoColor=c77dff)
![Prisma](https://img.shields.io/badge/Prisma-10002b?style=for-the-badge&logo=prisma&logoColor=c77dff)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-10002b?style=for-the-badge&logo=postgresql&logoColor=c77dff)
![Gemini](https://img.shields.io/badge/Google_Gemini-10002b?style=for-the-badge&logo=google&logoColor=c77dff)

</div>

<div align="center">

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion, React Leaflet |
| **Backend** | Node.js, Express, Prisma ORM |
| **Database** | PostgreSQL |
| **AI/ML** | Google GenAI SDK (Gemini 2.5 Flash) |

</div>

## 📂 Project Structure

<details open>
<summary><b>Current layout in the repository</b></summary>

```
TechTinkerers-Swastik/
├── client/                 # React frontend application
│   ├── src/pages/          # Student Portal, Tech Dashboard, Heatmap, etc.
│   └── src/components/     # UI components
├── server/                 # Node.js backend application
│   ├── src/controllers/    # aiController, etc.
│   ├── src/routes/         # API routes
│   └── prisma/             # Database schema & migrations
└── README.md
```

</details>


<img src="https://capsule-render.vercel.app/api?type=rect&color=0:10002b,100:3c096c&height=3&width=100%" width="100%"/>

## 🚀 Getting Started

### Clone & Install

```bash
git clone https://github.com/swastiksinha1/TechTinkerers-Swastik.git
cd TechTinkerers-Swastik
```

<details open>
<summary><b>⚙️ Server</b></summary>

```bash
cd server
npm install
cp .env.example .env          # configure DATABASE_URL, GEMINI_API_KEY
npx prisma generate
npx prisma db push
npm run dev
```

</details>

<details open>
<summary><b>🖥️ Client</b></summary>

```bash
cd client
npm install
npm run dev
```

</details>

## 📱 Usage

<div align="center">

| Role | What they can do |
|---|---|
| 🎓 **Students** | File complaints, attach media, track status on portal, upvote public feed issues, and confirm resolution to earn Karma. |
| 🛠️ **Technicians** | View assigned tickets in the technician dashboard; update status for resolution. |
| 🏢 **Admins / Wardens**| View the Live NOC dashboard for SLAs and the Campus Heatmap. |

</div>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:3c096c,100:10002b&height=3&width=100%" width="100%"/>

## 👥 Team — Tech Tinkerers

<div align="center">
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/RishiRaj1495">
        <img src="https://avatars.githubusercontent.com/RishiRaj1495" width="80px" style="border-radius:50%; border: 2px solid #c77dff;" alt="Rishi Raj"/><br/>
        <sub><b>Rishi Raj</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/swastiksinha1">
        <img src="https://avatars.githubusercontent.com/swastiksinha1" width="80px" style="border-radius:50%; border: 2px solid #c77dff;" alt="Swastik Sinha"/><br/>
        <sub><b>Swastik Sinha</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Abhilash-2210">
        <img src="https://avatars.githubusercontent.com/Abhilash-2210" width="80px" style="border-radius:50%; border: 2px solid #c77dff;" alt="Abhilash Singh"/><br/>
        <sub><b>Abhilash Singh</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ari9516">
        <img src="https://avatars.githubusercontent.com/ari9516" width="80px" style="border-radius:50%; border: 2px solid #c77dff;" alt="ari9516"/><br/>
        <sub><b>ari9516</b></sub>
      </a>
    </td>
  </tr>
</table>
</div>

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:10002b,100:3c096c&height=120&section=footer" width="100%" />
</div>
