<div align="center">

# 🛡️ AuditPro

### Audit Management System

A full-stack platform for planning audits, logging findings, and tracking compliance — built with **Spring Boot** and **React**.

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.x-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens)
</div>

---

## 📖 Table of Contents

- [Why AuditPro](#-why-auditpro)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Roles & Permissions](#-roles--permissions)
- [API Reference](#-api-reference)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## ✨ Why AuditPro

Most small teams track audits in spreadsheets — scattered, unversioned, and hard to assign ownership on. AuditPro gives them a single, role-aware place to:

- Plan and assign **audits** to auditors with clear timelines
- Capture **findings** the moment they're discovered, tagged by severity
- Keep a running log of **compliance requirements** per audit
- See a live, at-a-glance **dashboard** of what's open, pending, or resolved

Everything is scoped by role, so an auditor only ever sees what's relevant to them, and admins get the full picture.

---

## 🚀 Features

| | |
|---|---|
| **Audit Planning** | Capture audit scope, objectives, inherent risk, ownership, status, and planned dates |
| **AI & Data Analytics** | Portfolio metrics, severity breakdowns, risk-ranked audits, and explainable local recommendations |
| **Compliance Tracking** | Monitor requirements and compliance rates across audit engagements |
| 🔐 **JWT Authentication** | Stateless login/register with BCrypt-hashed passwords |
| 👥 **Role-Based Access** | `ADMIN`, `AUDITOR`, `COMPLIANCE_OFFICER` — enforced on both frontend routes and backend endpoints |
| 📋 **Full CRUD everywhere** | Users, Audits, Findings, Compliance — create, edit, delete, all in polished modals |
| 📊 **Live Dashboard** | Animated stat cards for audits, pending audits, findings, and compliance counts |
| 🌗 **Dark Mode** | One-click theme toggle, preference persisted across sessions |
| 🔍 **Instant Search** | Client-side filtering on every data table, no extra round trips |
| 🎨 **Designed UI** | Gradient accents, hover/entrance micro-animations, fully responsive |
| ⚠️ **Clean Error Handling** | Centralized `@RestControllerAdvice` returns consistent, human-readable API errors |

---

## 🏗️ Architecture

```
┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│   React (Vite) SPA   │      │   Spring Boot API    │      │    MySQL Database    │
│    localhost:5173    │      │  localhost:8080/api  │      │                      │
└──────────┬───────────┘      └──────────┬───────────┘      └──────────┬───────────┘
           │                             │                             │
           │  ──── REST + JSON ────▶     │  ──── JPA / Hibernate ───▶  │
           │  ◀──── JWT + Data ─────     │  ◀───────── SQL ──────────  │
           │                             │                             │
```

- The frontend attaches the JWT to every request via an Axios interceptor.
- `JwtAuthenticationFilter` validates the token on each request before it reaches a controller.
- `SecurityConfig` maps each `/api/**` path group to the roles allowed to touch it.

---

## 🧰 Tech Stack

**Backend**
- Java 17 · Spring Boot 3
- Spring Security + JJWT
- Spring Data JPA / Hibernate
- MySQL

**Frontend**
- React 18 (Vite)
- React Router
- Axios
- Hand-written CSS design system (no UI framework dependency)

---

## 📁 Project Structure

```
backend/                                # Spring Boot backend
├── src/main/java/com/AcquantHR/AuditManagementSystem/
│   ├── Config/          # Security & CORS configuration
│   ├── Controller/      # REST controllers
│   ├── DTO/              # Request/response DTOs
│   ├── Entity/           # JPA entities (User, Role, Audit, Finding, Compliance)
│   ├── Exception/        # Custom exceptions + global handler
│   ├── Repo/             # Spring Data repositories
│   ├── Security/         # JWT filter, JWT service, UserDetailsService
│   ├── Service/          # Service interfaces
│   └── ServiceImpl/      # Service implementations
└── src/main/resources/application.properties

Frontend/                               # React (Vite) frontend
├── public/favicon.svg
├── src/
│   ├── components/       # Navbar, Sidebar, Layout
│   ├── hooks/             # useTheme, useCountUp
│   ├── pages/             # Login, Register, Dashboard, Users, Audits, Findings, Compliance
│   ├── routes/            # ProtectedRoute
│   ├── services/          # Axios instance (api.js)
│   ├── App.jsx
│   └── main.jsx
└── index.html
```

---

## ⚡ Getting Started

### Prerequisites

- Java 21+ and Maven
- Node.js 18+ and npm
- MySQL 8+ (or any JPA-compatible relational database)

### 1. Clone

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Backend

```bash
cd backend

# create the database
mysql -u root -p -e "CREATE DATABASE audit_management;"
```

The project ships with working local defaults in `src/main/resources/application.properties`:

```properties
spring.application.name=AuditManagementSystem

spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/audit_management}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:admin}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

If your MySQL username/password differ from the defaults (`root` / `admin`), either edit the file directly or override it with environment variables before running (see [Environment Variables](#-environment-variables)).

Seed the required roles (needed before anyone can register):

```sql
INSERT INTO roles (name) VALUES ('ADMIN'), ('AUDITOR'), ('COMPLIANCE_OFFICER');
```

Run it:

```bash
./mvnw spring-boot:run
```

API is now live at **`http://localhost:8080`**.

### 3. Frontend

```bash
cd Frontend
npm install
npm run dev
```

App is now live at **`http://localhost:5173`**.

### 4. First login

Register an account from `/register` (this defaults to `AUDITOR`/`COMPLIANCE_OFFICER`). To get an `ADMIN` account, either:
- update that user's `role_id` directly in the database, or
- have an existing admin create one from the **Users** page.

---

## 🔑 Environment Variables

The backend reads DB config from environment variables with sensible local defaults, so it runs out of the box — override only what you need.

| Variable | Default | Description |
|---|---|---|
| `DB_URL` | `jdbc:mysql://localhost:3306/audit_management` | JDBC URL of your MySQL database |
| `DB_USERNAME` | `root` | MySQL username |
| `DB_PASSWORD` | `admin` | MySQL password |

> The frontend's API base URL is currently fixed to `http://localhost:8080/api` in `src/services/api.js`. If your backend runs elsewhere, update that line directly.

To set one, e.g. on macOS/Linux:

```bash
export DB_PASSWORD=your_real_password
./mvnw spring-boot:run
```

Or on Windows (PowerShell):

```powershell
$env:DB_PASSWORD="your_real_password"
.\mvnw.cmd spring-boot:run
```

In an IDE, add these under your Run Configuration's **Environment Variables** field instead.

---

## 🧑‍🤝‍🧑 Roles & Permissions

| Feature | ADMIN | AUDITOR | COMPLIANCE_OFFICER |
|---|:---:|:---:|:---:|
| Dashboard | ✅ | ✅ | ✅ |
| Users | ✅ | ❌ | ❌ |
| Audits | ✅ | ✅ | ❌ |
| Findings | ✅ | ✅ *(own assigned audits only)* | ❌ |
| Compliance | ✅ | ❌ | ✅ |

> Findings can only be created by an `AUDITOR` for an audit assigned to them — this is enforced in `FindingServiceImpl`, not just hidden in the UI.

---

## 📡 API Reference

Base URL: `/api` · All protected routes require `Authorization: Bearer <token>`

<details>
<summary><strong>Analytics</strong></summary>

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/analytics/overview` | Portfolio counts, compliance rate, finding severity breakdown, risk-ranked audits, and local recommendations | ADMIN, AUDITOR, COMPLIANCE_OFFICER |

Risk analysis is deterministic and explainable: each audit is scored from inherent risk, unresolved findings, non-compliant requirements, schedule, auditor assignment, and plan completeness. Recommendations are generated from the same data; no external AI provider or API key is required.

</details>

<details>
<summary><strong>Auth</strong></summary>

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new account | Public |
| POST | `/auth/login` | Login, returns JWT + user info | Public |

</details>

<details>
<summary><strong>Users</strong></summary>

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/users` | List all users | ADMIN |
| GET | `/users/{id}` | Get a user by ID | ADMIN |
| POST | `/users` | Create a user | ADMIN |
| PUT | `/users/{id}` | Update a user | ADMIN |
| DELETE | `/users/{id}` | Delete a user | ADMIN |

</details>

<details>
<summary><strong>Audits</strong></summary>

Audit plans include `scope`, `objectives`, and `riskLevel` alongside their title, description, status, assigned auditor, and planned dates.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/audits` | List all audits | ADMIN, AUDITOR |
| GET | `/audits/{id}` | Get an audit by ID | ADMIN, AUDITOR |
| POST | `/audits` | Create an audit | ADMIN, AUDITOR |
| PUT | `/audits/{id}` | Update an audit | ADMIN, AUDITOR |
| DELETE | `/audits/{id}` | Delete an audit | ADMIN, AUDITOR |
| GET | `/audits/status/{status}` | Filter audits by status | ADMIN, AUDITOR |
| PUT | `/audits/{auditId}/assign/{auditorId}` | Assign an auditor to an audit | ADMIN, AUDITOR |
| GET | `/audits/auditor/{auditorId}` | List audits by auditor | ADMIN, AUDITOR |

</details>

<details>
<summary><strong>Findings</strong></summary>

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/findings` | List all findings | ADMIN, AUDITOR |
| GET | `/findings/{id}` | Get a finding by ID | ADMIN, AUDITOR |
| POST | `/findings` | Create a finding *(must be AUDITOR, and audit must be assigned to them)* | AUDITOR |
| PUT | `/findings/{id}` | Update a finding | ADMIN, AUDITOR |
| DELETE | `/findings/{id}` | Delete a finding | ADMIN, AUDITOR |
| GET | `/findings/status/{status}` | Filter by status | ADMIN, AUDITOR |
| GET | `/findings/severity/{severity}` | Filter by severity | ADMIN, AUDITOR |

</details>

<details>
<summary><strong>Compliance</strong></summary>

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/compliance` | List all compliance records | ADMIN, COMPLIANCE_OFFICER |
| GET | `/compliance/{id}` | Get a compliance record by ID | ADMIN, COMPLIANCE_OFFICER |
| POST | `/compliance` | Create a compliance record | ADMIN, COMPLIANCE_OFFICER |
| PUT | `/compliance/{id}` | Update a compliance record | ADMIN, COMPLIANCE_OFFICER |
| DELETE | `/compliance/{id}` | Delete a compliance record | ADMIN, COMPLIANCE_OFFICER |
| GET | `/compliance/status/{status}` | Filter by status | ADMIN, COMPLIANCE_OFFICER |

</details>

---

## 🛠️ Troubleshooting

<details>
<summary><strong>"Duplicate entry ... for key" on user creation</strong></summary>

The email already exists in the `users` table. `UserServiceImpl.saveUser()` checks this up front and returns a clean `409 Conflict` instead of a raw SQL error — make sure that check is in place.

</details>

<details>
<summary><strong>TransientPropertyValueException when updating a user's role</strong></summary>

This happens if a partial `Role` object (e.g. `{ "name": "ADMIN" }`) is saved directly without resolving it against the database first. `UserServiceImpl.updateUser()` should look up the managed `Role` entity via `roleRepository.findByName()` before assigning it.

</details>

<details>
<summary><strong>Audit/status fields show as N/A in Findings or Compliance tables</strong></summary>

Check that `Finding.audit` and `Compliance.audit` don't have an overly broad `@JsonIgnoreProperties` hiding fields like `title` and `status` from the JSON response.

</details>

<details>
<summary><strong>403 Forbidden on a request that should be allowed</strong></summary>

Confirm `CustomUserDetailsService` prefixes authorities with `ROLE_` (e.g. `ROLE_ADMIN`) — Spring Security's `hasRole("ADMIN")` expects that prefix internally.

</details>

---

## 🗺️ Roadmap

- [ ] Toast notifications for create/update/delete actions
- [ ] Custom styled delete-confirmation modal (replace `window.confirm`)
- [ ] Pagination for large datasets
- [ ] Convert `status` / `severity` fields to proper enums
- [ ] Refresh tokens for longer sessions

---

## 🤝 Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change, then submit a PR.

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push and open a PR

---

<div align="center">

Made with ☕ and a lot of debugging.

</div>
