export interface TunnelRoute {
  path: string;
  target: string;
  changeOrigin?: boolean;
  pathRewrite?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface CorsConfig {
  origins?: string[];
}

export interface LiveTunnelConfig {
  enabled: boolean;
  subdomain?: string;
  host?: string;
  local_host?: string;
  showQR?: boolean;
}

export interface TunnelConfig {
  name: string;
  port: number;
  cors?: CorsConfig;
  routes: TunnelRoute[];
  liveTunnel?: LiveTunnelConfig;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  tunnel: string;
  publicUrl?: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  path?: string;
  target?: string;
  availableRoutes?: string[];
}
