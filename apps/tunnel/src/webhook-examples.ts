import HTTPTunnel, { TunnelConfig } from "./index";

// Webhook receiver example - demonstrates receiving data from external services
const webhookConfig: TunnelConfig = {
  name: "Webhook Receiver Tunnel",
  port: 3001,
  cors: {
    origins: ["*"], // Allow all origins for webhooks
  },
  liveTunnel: {
    enabled: true,
    subdomain: "webhook-receiver", // Try to get webhook-receiver.loca.lt
    showQR: true,
  },
  routes: [
    {
      path: "/webhooks",
      target: "http://localhost:8000", // Your webhook handler
      changeOrigin: true,
      headers: {
        "X-Forwarded-Proto": "https",
        "X-Tunnel-Source": "live-tunnel",
      },
    },
    {
      path: "/api/webhooks",
      target: "http://localhost:8000",
      changeOrigin: true,
      pathRewrite: {
        "^/api/webhooks": "/webhooks", // Rewrite path
      },
    },
  ],
};

// Payment webhook example (Stripe, PayPal, etc.)
const paymentWebhookConfig: TunnelConfig = {
  name: "Payment Webhook Tunnel",
  port: 3002,
  liveTunnel: {
    enabled: true,
    subdomain: "payments",
    showQR: false,
  },
  routes: [
    {
      path: "/stripe/webhook",
      target: "http://localhost:8000",
      changeOrigin: true,
      headers: {
        "X-Webhook-Provider": "stripe",
      },
    },
    {
      path: "/paypal/webhook",
      target: "http://localhost:8000",
      changeOrigin: true,
      headers: {
        "X-Webhook-Provider": "paypal",
      },
    },
  ],
};

// API development with external access
const apiDevelopmentConfig: TunnelConfig = {
  name: "API Development Tunnel",
  port: 3003,
  liveTunnel: {
    enabled: true,
    subdomain: "api-dev",
    showQR: true,
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
        "X-API-Version": "v1",
        "X-Environment": "development",
      },
    },
  ],
};

// Function to start a specific tunnel configuration
async function startTunnel(config: TunnelConfig): Promise<HTTPTunnel> {
  const tunnel = new HTTPTunnel(config);
  await tunnel.start();
  return tunnel;
}

// Example: Start webhook receiver
async function startWebhookReceiver(): Promise<void> {
  console.log("🎣 Starting webhook receiver tunnel...");
  const tunnel = await startTunnel(webhookConfig);

  const publicUrl = tunnel.getPublicUrl();
  if (publicUrl) {
    console.log("\n📨 Webhook URLs:");
    console.log(`   General webhooks: ${publicUrl}/webhooks`);
    console.log(`   API webhooks: ${publicUrl}/api/webhooks`);
    console.log("\n💡 Use these URLs in your webhook configuration");
  }
}

// Example: Start payment webhook receiver
async function startPaymentWebhooks(): Promise<void> {
  console.log("💳 Starting payment webhook tunnel...");
  const tunnel = await startTunnel(paymentWebhookConfig);

  const publicUrl = tunnel.getPublicUrl();
  if (publicUrl) {
    console.log("\n💰 Payment Webhook URLs:");
    console.log(`   Stripe: ${publicUrl}/stripe/webhook`);
    console.log(`   PayPal: ${publicUrl}/paypal/webhook`);
    console.log("\n💡 Configure these URLs in your payment provider dashboard");
  }
}

// Example: Start API development tunnel
async function startApiDevelopment(): Promise<void> {
  console.log("🔧 Starting API development tunnel...");
  const tunnel = await startTunnel(apiDevelopmentConfig);

  const publicUrl = tunnel.getPublicUrl();
  if (publicUrl) {
    console.log("\n🌐 API Development URL:");
    console.log(`   API endpoint: ${publicUrl}/api/v1`);
    console.log(
      "\n💡 Share this URL with team members or external integrators",
    );
  }
}

// Export configurations and functions
export {
  apiDevelopmentConfig,
  paymentWebhookConfig,
  startApiDevelopment,
  startPaymentWebhooks,
  startTunnel,
  startWebhookReceiver,
  webhookConfig,
};

// CLI usage examples
if (require.main === module) {
  const mode = process.argv[2] || "webhook";

  switch (mode) {
    case "webhook":
      startWebhookReceiver();
      break;
    case "payment":
      startPaymentWebhooks();
      break;
    case "api":
      startApiDevelopment();
      break;
    default:
      console.log("Usage: npm run dev webhook|payment|api");
      console.log("Default: webhook");
      startWebhookReceiver();
  }
}
