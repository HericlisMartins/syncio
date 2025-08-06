import HTTPTunnel, { TunnelConfig } from "./index";

// Example configuration for a development setup
const devConfig: TunnelConfig = {
  name: "Development Tunnel",
  port: 3001,
  cors: {
    origins: ["http://localhost:3000", "http://localhost:5173"],
  },
  routes: [
    {
      path: "/api/v1",
      target: "http://localhost:8000",
      changeOrigin: true,
      pathRewrite: {
        "^/api/v1": "/api",
      },
      headers: {
        "X-Forwarded-Proto": "http",
        "X-Tunnel": "dev-tunnel",
      },
    },
    {
      path: "/auth",
      target: "http://localhost:8001",
      changeOrigin: true,
    },
    {
      path: "/files",
      target: "http://localhost:8002",
      changeOrigin: true,
    },
  ],
};

// Example configuration for production
const prodConfig: TunnelConfig = {
  name: "Production Tunnel",
  port: 3000,
  cors: {
    origins: ["https://myapp.com", "https://admin.myapp.com"],
  },
  routes: [
    {
      path: "/api",
      target: "https://api.myapp.com",
      changeOrigin: true,
      headers: {
        "X-Forwarded-Proto": "https",
        "X-Tunnel": "prod-tunnel",
      },
    },
  ],
};

// Start tunnel based on environment
const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;
const tunnel = new HTTPTunnel(config);

tunnel.start();

export { devConfig, prodConfig };
