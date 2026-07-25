# EduFlow - AI-Powered Attendance Management System

## 🚀 Overview

EduFlow is a production-ready, cloud-based multi-tenant SaaS platform for educational institutions. Its first product is an AI-assisted attendance management system that combines face recognition, liveness detection, and keyword-based verification for secure and efficient attendance tracking.

### Supported Institutions
- 🏫 Schools
- 🏛️ Colleges
- 🎓 Universities
- 📚 Training Institutes

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   React     │ ──▶ │   Laravel    │ ──▶ │   FastAPI   │
│   Frontend  │     │   REST API   │     │  AI Service │
│  (Vite + TS)│ ◀── │  (Sanctum)   │ ◀── │  (OpenCV)   │
└─────────────┘     └──────┬───────┘     └──────┬──────┘
                           │                     │
                           ▼                     ▼
                    ┌──────────┐          ┌──────────┐
                    │PostgreSQL│          │  Redis   │
                    └──────────┘          └──────────┘
```

## ✨ Key Features

### 🔐 Security
- Role-Based Access Control (RBAC)
- Multi-tenant data isolation
- Encrypted face embeddings
- Audit logging for all actions
- Rate limiting & CSRF protection
- HTTPS enforced

### 🤖 AI-Powered
- **Face Recognition**: Using InsightFace for high-accuracy face matching
- **Liveness Detection**: Anti-spoofing with blink, smile, and head movement detection
- **Confidence Scoring**: Automated attendance decisions based on confidence levels

### 📊 Attendance Management
- **Keyword-based Verification**: Teachers generate session keywords announced verbally
- **Multi-factor Authentication**: Face + Liveness + Keyword
- **Manual Review Queue**: Teacher reviews for medium-confidence matches
- **Real-time Updates**: WebSocket-based live attendance tracking

### 📈 Analytics & Reports
- Daily/Weekly/Monthly attendance reports
- Department, teacher, and student-level analytics
- PDF and Excel export
- Interactive dashboards

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| React Router | Routing |
| TanStack Query | Data Fetching |
| Axios | HTTP Client |
| React Hook Form | Form Management |
| Zod | Validation |

### Backend
| Technology | Purpose |
|-----------|---------|
| Laravel 12 | PHP Framework |
| PHP 8.4+ | Runtime |
| Sanctum | API Authentication |
| PostgreSQL | Database |
| Redis | Cache & Queue |
| Repository Pattern | Data Access |
| Service Layer | Business Logic |

### AI Service
| Technology | Purpose |
|-----------|---------|
| FastAPI | Python Web Framework |
| OpenCV | Image Processing |
| InsightFace | Face Recognition |
| ONNX Runtime | Model Inference |

### DevOps
| Technology | Purpose |
|-----------|---------|
| Docker | Containerization |
| Docker Compose | Orchestration |
| Nginx | Reverse Proxy |
| Supervisor | Process Management |

## 📋 Prerequisites

- PHP 8.4+
- Composer 2.x
- Node.js 22+
- Python 3.14+
- Docker & Docker Compose (optional)
- PostgreSQL 16+
- Redis 7+

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/eduflow.git
cd eduflow
```

### 2. Environment Setup
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Install Dependencies
```bash
# Backend
cd backend
composer install
php artisan key:generate

# Frontend
cd ../frontend
npm install

# AI Service
cd ../ai-service
pip install -r requirements.txt
```

### 4. Database Setup
```bash
cd backend
php artisan migrate
php artisan db:seed
```

### 5. Run Development Servers
```bash
# Backend
cd backend
php artisan serve

# Frontend
cd frontend
npm run dev

# AI Service
cd ai-service
uvicorn app.main:app --reload
```

### 6. Using Docker (Production-like)
```bash
docker-compose up -d
```

## 🏗️ Project Structure

```
eduflow/
├── backend/                    # Laravel 12 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/    # API Controllers
│   │   │   ├── Middleware/     # Auth, Tenant, Role
│   │   │   ├── Requests/      # Form Requests
│   │   │   └── Resources/     # API Resources
│   │   ├── Models/            # Eloquent Models
│   │   ├── Repositories/     # Data Access Layer
│   │   ├── Services/         # Business Logic
│   │   ├── Policies/         # Authorization
│   │   └── Jobs/             # Queue Jobs
│   ├── database/
│   │   └── migrations/       # Database Migrations
│   ├── routes/
│   │   └── api.php           # API Routes
│   └── tests/                # PHPUnit Tests
├── frontend/                   # React TypeScript
│   ├── src/
│   │   ├── components/       # Reusable Components
│   │   ├── pages/            # Page Components
│   │   │   ├── auth/         # Login, Register
│   │   │   ├── platform/     # Platform Admin
│   │   │   ├── institution/  # Institution Admin
│   │   │   ├── teacher/      # Teacher Dashboard
│   │   │   └── student/      # Student Dashboard
│   │   ├── hooks/            # Custom Hooks
│   │   ├── services/         # API Services
│   │   ├── types/            # TypeScript Types
│   │   └── lib/              # Utilities
│   └── Dockerfile
├── ai-service/                 # FastAPI Python
│   ├── app/
│   │   ├── main.py           # FastAPI Application
│   │   ├── models/           # AI Models
│   │   ├── services/         # Business Logic
│   │   └── routes/           # API Endpoints
│   └── requirements.txt
├── nginx/                      # Nginx Configuration
├── docker-compose.yml          # Docker Orchestration
└── README.md
```

## 👥 User Roles

### Platform Admin
- Approve/Reject/Suspend institutions
- Manage subscription plans
- Platform-wide analytics
- Support management

### Institution Admin
- Institution profile management
- Department/Program/Course management
- Teacher management
- Student approval workflow
- Attendance reports

### Teacher
- View schedule & create sessions
- Generate attendance keywords
- Manual review of attendance
- View attendance reports

### Student
- Register with face enrollment
- View active sessions
- Mark attendance (Face + Keyword)
- View attendance history

## 🔒 Security Features

1. **Multi-Tenant Isolation**: Every query respects tenant boundaries
2. **Role-Based Access**: Granular permissions for each role
3. **Encrypted Storage**: Face embeddings encrypted at rest
4. **Audit Trail**: Every action logged for compliance
5. **Rate Limiting**: API rate limiting per user/IP
6. **Input Validation**: Strict validation on all inputs
7. **SQL Injection Prevention**: Parameterized queries
8. **XSS Protection**: Content Security Policy headers

## 📝 API Documentation

Full API documentation is available at `/api/documentation` when the server is running.

### Key Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - Logout
- `GET /api/auth/user` - Get current user

#### Institutions
- `GET /api/institutions` - List institutions
- `POST /api/institutions/register` - Register institution
- `POST /api/institutions/{id}/approve` - Approve institution (Admin)
- `POST /api/institutions/{id}/reject` - Reject institution (Admin)

#### Attendance
- `POST /api/attendance/sessions` - Create session (Teacher)
- `GET /api/attendance/sessions/active` - Get active sessions
- `POST /api/attendance/mark` - Mark attendance (Student)
- `GET /api/attendance/reviews/pending` - Get pending reviews (Teacher)

#### Face Recognition
- `POST /api/face/enroll` - Enroll face images
- `POST /api/face/verify` - Verify face

## 🧪 Testing

```bash
# Backend Tests
cd backend
php artisan test

# Frontend Tests
cd frontend
npm test
```

## 🚢 Deployment

### Docker Deployment
```bash
docker-compose up -d
```

### Manual Deployment
1. Set up PostgreSQL and Redis
2. Configure Nginx with SSL
3. Run Laravel migrations
4. Build frontend assets
5. Start queue worker
6. Start AI service

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support, email support@eduflow.com or create an issue in the repository.

