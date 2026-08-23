# Personal Finance Tracker

Full-stack finance management application with Spring Boot backend and React frontend.

## Project Structure

```
Personal-Finance-Tracker-Final/
├── backend/                    # Spring Boot 3.2 + Java 21
│   ├── src/main/java/com/finance/tracker/
│   │   ├── config/            # MVC config
│   │   ├── controller/        # REST controllers
│   │   ├── dto/               # Request/Response DTOs
│   │   ├── entity/            # JPA entities
│   │   ├── exception/         # Global exception handler
│   │   ├── repository/        # Spring Data JPA repos
│   │   ├── security/          # JWT + BCrypt security
│   │   ├── service/           # Business logic + scheduled tasks
│   │   └── util/              # Email, file upload, PDF export
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/                   # React 18 + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/        # Layout, notifications dropdown
│   │   ├── context/           # Auth context with token refresh
│   │   ├── pages/             # Dashboard, Expenses, Incomes, Budgets, etc.
│   │   └── utils/             # Axios API client
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── database/
    └── schema.sql             # MySQL schema export
```

## Prerequisites

- Java 21 JDK
- Maven 3.9+
- Node.js 18+
- MySQL 8.0
- Git

## Database Setup

1. Start MySQL service
2. Create database (auto-created by app) or import schema:
   ```powershell
   & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root < database\schema.sql
   ```

## Backend Setup

1. Configure `backend/src/main/resources/application.properties`:
   - Set MySQL password if needed
   - Configure Gmail SMTP for password reset emails

2. Run backend:
   ```powershell
   cd backend
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
   & "C:\Users\koush\Downloads\apache-maven-3.9.11-bin\apache-maven-3.9.11\bin\mvn.cmd" spring-boot:run
   ```
   Backend runs on `http://localhost:8082`

## Frontend Setup

1. Install dependencies:
   ```powershell
   cd frontend
   npm install
   ```

2. Run dev server:
   ```powershell
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh-token`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Protected Routes (JWT required)
- `GET/POST/PUT/DELETE /api/expenses`
- `GET/POST/PUT/DELETE /api/incomes`
- `GET/POST/PUT/DELETE /api/budgets`
- `GET/POST/PUT/DELETE /api/savings-goals`
- `POST /api/savings-goals/{id}/deposit`
- `GET /api/dashboard`
- `GET /api/reports/{period}` + `/pdf` + `/csv`
- `GET/PUT /api/notifications/{id}/read`
- `GET/PUT /api/profile`

## Tech Stack

**Backend:**
- Spring Boot 3.2.0 (Java 21)
- Spring Security + JWT (jjwt 0.12.3)
- Spring Data JPA + Hibernate
- MySQL 8.0
- Lombok + MapStruct
- Spring Mail (Gmail SMTP)
- Spring Actuator + Swagger/OpenAPI

**Frontend:**
- React 18 + React Router 6
- Vite 5
- TailwindCSS 3
- Recharts (analytics)
- React Hook Form
- Axios with interceptors
- Lucide React icons

## Features

- JWT authentication with auto token refresh
- Password reset via email
- Expense/Income tracking with search/filter
- Budget management with utilization tracking
- Savings goals with progress tracking
- Dashboard with advanced analytics (monthly trends, category breakdown, weekly charts)
- PDF/CSV report generation
- Notifications with unread alerts
- Dark mode toggle
- Responsive sidebar navigation
- Scheduled tasks: monthly reports, budget warnings, savings milestones, bill reminders
