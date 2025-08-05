# 🚀 Syncio Technical Assessment

A modern **Vue.js + Laravel** application that demonstrates JSON payload comparison with a focus on frontend excellence. This monorepo showcases enterprise-level development practices with TypeScript, modern tooling, and clean architecture.

## 🏗️ Architecture

### **Tech Stack**

- **Frontend**: Vue 3 + TypeScript + Vite + TailwindCSS + Pinia
- **Backend**: Laravel 11 + PHP 8.4 + SQLite + Redis (optional)
- **Monorepo**: Turborepo + PNPM + Docker
- **UI**: Headless UI + Heroicons + TailwindCSS
- **Testing**: Vitest + Pest PHP

### **Project Structure**

```
syncio/
├── apps/
│   ├── frontend/          # Vue.js SPA
│   └── backend/           # Laravel API
├── packages/
│   └── shared-types/      # Shared TypeScript definitions
├── tools/
│   └── docker/           # Docker configurations
├── package.json          # Root workspace config
├── turbo.json            # Turborepo pipeline
└── docker-compose.yml    # Multi-service orchestration
```

## 🎯 Features

### **Frontend (Vue.js)**

- ✅ **Modern Vue 3** with Composition API + `<script setup>`
- ✅ **TypeScript** for type safety
- ✅ **Pinia** for state management
- ✅ **TailwindCSS** + Headless UI for professional styling
- ✅ **Real-time countdown** for automatic payload sending
- ✅ **Beautiful diff visualization** with syntax highlighting
- ✅ **Error handling** with graceful UX
- ✅ **Responsive design** mobile-first approach
- ✅ **Loading states** and progress indicators

### **Backend (Laravel)**

- ✅ **RESTful API** with structured responses
- ✅ **Smart caching** for payload storage (minimal database usage)
- ✅ **Sophisticated diff algorithm** with recursive comparison
- ✅ **CORS configured** for frontend integration
- ✅ **Service-oriented architecture** with dependency injection
- ✅ **Comprehensive error handling**
- ✅ **API documentation** ready routes

### **DevOps & Tooling**

- ✅ **Turborepo** for efficient monorepo builds
- ✅ **Docker Compose** for easy local development
- ✅ **Hot reload** for both frontend and backend
- ✅ **Type checking** across the entire workspace
- ✅ **ESLint + Prettier** for code quality
- ✅ **PNPM** for fast package management

## 🚦 Quick Start

### **Prerequisites**

- Node.js 18+
- PHP 8.4+
- Composer
- PNPM (`npm install -g pnpm`)

### **Option 1: Local Development**

```bash
# Clone and setup
git clone <repository-url>
cd syncio

# Install all dependencies
pnpm install

# Build shared packages
pnpm run build

# Setup Laravel backend
cd apps/backend
composer install
php artisan key:generate
php artisan migrate

# Start development servers (in separate terminals)
cd apps/backend && php artisan serve
cd apps/frontend && pnpm dev
```

### **Option 2: Docker (Recommended)**

```bash
# Start all services
docker-compose up -d

# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

## 🧪 How It Works

### **Workflow**

1. **Send Payload 1** → User clicks button → Payload stored in Laravel cache
2. **30-second countdown** → Automatic timer with visual feedback
3. **Send Payload 2** → Automatically triggered → Payload stored and comparison starts
4. **Diff Visualization** → Beautiful frontend display of all differences

### **API Endpoints**

```
POST /api/payloads/1     # Store first payload
POST /api/payloads/2     # Store second payload
POST /api/compare        # Compare two payloads
GET  /api/payloads/{id}  # Retrieve stored payload
GET  /api/health         # Health check
```

### **Comparison Algorithm**

- **Recursive deep comparison** of nested JSON structures
- **Special handling** for arrays vs objects
- **E-commerce aware** messages for prices, SKUs, inventory
- **Path tracking** for precise change location
- **Type-safe** results with comprehensive diff metadata

## 🎨 Screenshots & Demo

### **Payload Sender Interface**

- Clean, step-by-step UI
- Real-time countdown visualization
- Success states with timestamps
- Loading indicators

### **Comparison Results**

- Summary statistics (Added/Removed/Modified)
- Detailed diff list with syntax highlighting
- Before/after value comparison
- Intuitive color coding (🟢 Added, 🔴 Removed, 🟡 Modified)

## 🧪 Testing

```bash
# Frontend tests
cd apps/frontend && pnpm test

# Backend tests
cd apps/backend && php artisan test

# Run all tests
pnpm test
```

## 🔧 Development Commands

```bash
# Development
pnpm dev                 # Start all development servers
pnpm build              # Build all packages
pnpm lint               # Lint all code
pnpm type-check         # TypeScript type checking

# Individual apps
cd apps/frontend && pnpm dev    # Frontend only
cd apps/backend && php artisan serve    # Backend only
```

## 🚀 Production Deployment

### **Build for Production**

```bash
pnpm build
```

### **Environment Variables**

```bash
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:8000/api

# Backend (.env)
APP_ENV=local
APP_DEBUG=false
APP_URL=http://localhost:5173/
```

## 🎯 Assessment Highlights

### **Frontend Excellence**

- **Modern Stack**: Vue 3 + TypeScript + Vite
- **Professional UI**: TailwindCSS + Headless UI components
- **State Management**: Pinia with typed stores
- **Real-time Features**: Countdown timer and live updates
- **Error Boundaries**: Graceful error handling
- **Performance**: Code splitting and lazy loading ready

### **Backend Quality**

- **Clean Architecture**: Service-oriented design
- **Smart Caching**: Minimal database usage as requested
- **Robust API**: Structured responses with proper HTTP codes
- **Sophisticated Logic**: Recursive diff algorithm
- **Documentation**: Well-commented code explaining logic
- **Testing Ready**: PHPUnit test structure in place

### **Enterprise Practices**

- **Monorepo**: Scalable workspace management
- **Type Safety**: End-to-end TypeScript
- **DevOps**: Docker + CI/CD ready
- **Code Quality**: ESLint + Prettier + PHP-CS-Fixer
- **Performance**: Turborepo caching and parallel builds

## 📝 Notes

- **No Database Bloat**: Payloads stored in cache (Redis/File) as requested
- **Simple UI**: Clean, functional design focusing on clarity
- **Well Commented**: All complex logic explained
- **Production Ready**: Environment configs and build optimization
- **Extensible**: Easy to add WebSockets, more diff types, etc.

## 🤝 Live Demo Readiness

This application is ready for the live walkthrough session:

- ✅ **Modular code** easy to explain and modify
- ✅ **Clear separation** of concerns
- ✅ **Well-documented** logic and decisions
- ✅ **Extensible architecture** for feature additions
- ✅ **Modern practices** demonstrating frontend expertise

---

**🎯 Built for the Syncio Technical Assessment - Showcasing modern fullstack development with frontend focus**
