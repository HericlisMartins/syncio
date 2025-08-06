# HTTP Tunnel

A simple TypeScript HTTP tunnel application that proxies requests to different backend services with **live tunnel support** for public access.

## Features

- 🚇 HTTP request tunneling/proxying
- 🌐 **Live tunnel support** (public URLs via localtunnel)
- 🔀 Multiple route configuration
- 🛡️ CORS support
- 📝 Request logging
- 🏥 Health check endpoint
- 📱 QR code generation for mobile access
- ⚙️ Environment-based configuration
- 🎣 Perfect for webhooks and external integrations

## Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env
```

## Configuration

Edit the `.env` file to configure your tunnel:

```env
# Basic Configuration
TUNNEL_NAME=My HTTP Tunnel
PORT=3000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Backend Targets
API_TARGET=http://localhost:8000
BACKEND_TARGET=http://localhost:8000

# Live Tunnel (Public Access)
LIVE_TUNNEL_ENABLED=true
LIVE_TUNNEL_SUBDOMAIN=my-app
LIVE_TUNNEL_SHOW_QR=true
```

## Usage

### Development

```bash
# Start in development mode with hot reload
pnpm run dev

# Start with live tunnel enabled
LIVE_TUNNEL_ENABLED=true pnpm run dev
```

### Production

```bash
# Build the application
pnpm run build

# Start the production server
pnpm run start
```

### Webhook Examples

```bash
# Start webhook receiver
npx tsx src/webhook-examples.ts webhook

# Start payment webhook receiver
npx tsx src/webhook-examples.ts payment

# Start API development tunnel
npx tsx src/webhook-examples.ts api
```

## Live Tunnel

When `LIVE_TUNNEL_ENABLED=true`, your local server becomes publicly accessible:

- 🌍 **Public URL**: `https://your-subdomain.loca.lt`
- 🔒 **HTTPS enabled** by default
- 📱 **QR Code** for easy mobile testing
- 🎣 **Perfect for webhooks** from external services

### Webhook Use Cases

1. **Payment Webhooks**: Stripe, PayPal, Square notifications
2. **Social Media**: GitHub, Discord, Slack webhooks
3. **API Testing**: Share your development API with team members
4. **Mobile Testing**: Test your API from mobile devices
5. **External Integrations**: Third-party services calling your endpoints

## API Endpoints

### Health Check

- **GET** `/health` - Returns tunnel status and information

### Tunnel Routes

- **ALL** `/api/*` - Proxies to `API_TARGET` (strips `/api` prefix)
- **ALL** `/backend/*` - Proxies to `BACKEND_TARGET`

## Examples

### Basic Usage

```typescript
import HTTPTunnel, { TunnelConfig } from "./src/index";

const config: TunnelConfig = {
  name: "My Tunnel",
  port: 3000,
  routes: [
    {
      path: "/api",
      target: "http://localhost:8000",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
  ],
};

const tunnel = new HTTPTunnel(config);
tunnel.start();
```

### Custom Headers

```typescript
const config: TunnelConfig = {
  name: "Authenticated Tunnel",
  port: 3000,
  routes: [
    {
      path: "/secure",
      target: "http://api.example.com",
      headers: {
        Authorization: "Bearer your-token",
        "X-Custom-Header": "custom-value",
      },
    },
  ],
};
```

## Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build TypeScript to JavaScript
- `pnpm run start` - Start production server
- `pnpm run clean` - Clean build artifacts
- `pnpm run type-check` - Run TypeScript type checking
- `pnpm run lint` - Run ESLint

## License

MIT
