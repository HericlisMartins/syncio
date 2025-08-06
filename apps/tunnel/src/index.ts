import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import localtunnel from "localtunnel";
import * as qrcode from "qrcode-terminal";

import { LiveTunnelConfig, TunnelConfig, TunnelRoute } from "./types";
import { Logger } from "./utils/logger";

// Load environment variables
dotenv.config();

class HTTPTunnel {
  private app: express.Application;
  private config: TunnelConfig;
  private logger: Logger;
  private publicUrl?: string;
  private tunnel?: any;

  constructor(config: TunnelConfig) {
    this.app = express();
    this.config = config;
    this.logger = new Logger();

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // Enable CORS
    this.app.use(
      cors({
        origin: this.config.cors?.origins || "*",
        credentials: true,
      }),
    );

    // Parse JSON bodies
    this.app.use(express.json({ limit: "10mb" }));

    // Parse URL-encoded bodies
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req, res, next) => {
      this.logger.info(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        tunnel: this.config.name,
        publicUrl: this.publicUrl,
      });
    });

    // Setup tunnel routes
    this.config.routes.forEach((route: TunnelRoute) => {
      this.setupTunnelRoute(route);
    });

    // Catch-all route for debugging
    this.app.use("*", (req, res) => {
      this.logger.warn(`No route found for ${req.method} ${req.originalUrl}`);
      res.status(404).json({
        error: "Route not found",
        path: req.originalUrl,
        availableRoutes: this.config.routes.map((r: TunnelRoute) => r.path),
      });
    });
  }

  private setupTunnelRoute(route: TunnelRoute): void {
    const proxyOptions = {
      target: route.target,
      changeOrigin: route.changeOrigin || true,
      pathRewrite: route.pathRewrite || {},
      onError: (err: Error, req: express.Request, res: express.Response) => {
        this.logger.error(`Proxy error for ${req.path}: ${err.message}`);
        res.status(502).json({
          error: "Bad Gateway",
          message: "Target server is unreachable",
          target: route.target,
        });
      },
      onProxyReq: (proxyReq: any, req: express.Request) => {
        this.logger.debug(
          `Proxying ${req.method} ${req.path} to ${route.target}`,
        );

        // Add custom headers if specified
        if (route.headers) {
          Object.entries(route.headers).forEach(([key, value]) => {
            proxyReq.setHeader(key, value);
          });
        }
      },
      onProxyRes: (proxyRes: any, req: express.Request) => {
        this.logger.debug(
          `Response from ${route.target}: ${proxyRes.statusCode}`,
        );
      },
    };

    const proxy = createProxyMiddleware(proxyOptions);

    // Apply the proxy to the specified path
    this.app.use(route.path, proxy);

    this.logger.info(
      `Tunnel route configured: ${route.path} -> ${route.target}`,
    );
  }

  private async setupLiveTunnel(): Promise<void> {
    if (!this.config.liveTunnel?.enabled) {
      return;
    }

    try {
      const tunnelOptions: any = {
        port: this.config.port,
      };

      if (this.config.liveTunnel.subdomain) {
        tunnelOptions.subdomain = this.config.liveTunnel.subdomain;
      }

      if (this.config.liveTunnel.host) {
        tunnelOptions.host = this.config.liveTunnel.host;
      }

      if (this.config.liveTunnel.local_host) {
        tunnelOptions.local_host = this.config.liveTunnel.local_host;
      }

      this.logger.info("🌐 Setting up live tunnel...");
      this.tunnel = await localtunnel(tunnelOptions);
      this.publicUrl = this.tunnel.url;

      this.logger.info(`🚀 Live tunnel created: ${this.publicUrl}`);

      if (this.config.liveTunnel.showQR && this.publicUrl) {
        this.logger.info("📱 QR Code for easy mobile access:");
        qrcode.generate(this.publicUrl, { small: true });
      }

      // Handle tunnel close
      this.tunnel.on("close", () => {
        this.logger.warn("🔌 Live tunnel closed");
        this.publicUrl = undefined;
      });

      // Handle tunnel errors
      this.tunnel.on("error", (err: Error) => {
        this.logger.error(`🚨 Live tunnel error: ${err.message}`);
      });
    } catch (error) {
      this.logger.error(`❌ Failed to create live tunnel: ${error}`);
    }
  }

  public async start(): Promise<void> {
    const port = this.config.port || 3000;

    return new Promise((resolve) => {
      this.app.listen(port, async () => {
        this.logger.info(
          `🚇 HTTP Tunnel "${this.config.name}" started on port ${port}`,
        );
        this.logger.info(`📋 Available routes:`);
        this.config.routes.forEach((route: TunnelRoute) => {
          this.logger.info(`   ${route.path} -> ${route.target}`);
        });
        this.logger.info(`🏥 Health check: http://localhost:${port}/health`);

        // Setup live tunnel if enabled
        if (this.config.liveTunnel?.enabled) {
          await this.setupLiveTunnel();
          if (this.publicUrl) {
            this.logger.info(`🌍 Public URL: ${this.publicUrl}`);
            this.logger.info(
              `🏥 Public health check: ${this.publicUrl}/health`,
            );
          }
        }

        resolve();
      });
    });
  }

  public stop(): void {
    if (this.tunnel) {
      this.tunnel.close();
      this.logger.info("🔌 Live tunnel stopped");
    }
  }

  public getPublicUrl(): string | undefined {
    return this.publicUrl;
  }

  public getApp(): express.Application {
    return this.app;
  }
}

// Default configuration
const defaultConfig: TunnelConfig = {
  name: process.env.TUNNEL_NAME || "HTTP Tunnel",
  port: parseInt(process.env.PORT || "3000"),
  cors: {
    origins: process.env.CORS_ORIGINS?.split(",") || ["*"],
  },
  liveTunnel: {
    enabled: process.env.LIVE_TUNNEL_ENABLED === "true",
    subdomain: process.env.LIVE_TUNNEL_SUBDOMAIN,
    host: process.env.LIVE_TUNNEL_HOST,
    local_host: process.env.LIVE_TUNNEL_LOCAL_HOST,
    showQR: process.env.LIVE_TUNNEL_SHOW_QR === "true",
  },
  routes: [
    {
      path: "/api",
      target: process.env.API_TARGET || "http://localhost:8000",
      changeOrigin: true,
    },
    {
      path: "/backend",
      target: process.env.BACKEND_TARGET || "http://localhost:8000",
      changeOrigin: true,
    },
  ],
};

// Start the tunnel if this file is run directly
if (require.main === module) {
  const tunnel = new HTTPTunnel(defaultConfig);
  tunnel.start().then(() => {
    // Handle graceful shutdown
    process.on("SIGTERM", () => {
      console.log("Received SIGTERM, shutting down gracefully");
      tunnel.stop();
      process.exit(0);
    });

    process.on("SIGINT", () => {
      console.log("Received SIGINT, shutting down gracefully");
      tunnel.stop();
      process.exit(0);
    });
  });
}

export { HTTPTunnel, LiveTunnelConfig, TunnelConfig, TunnelRoute };
export default HTTPTunnel;
