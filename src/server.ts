import type { Server } from "http";
import config from "./app/config/config";
import app from "./app";
import seedSuperAdmin from "./app/helper/seed";

async function main() {
  let server: Server | undefined;

  try {
    // Seed super admin if configured
    await seedSuperAdmin();

    const port = Number(config.port) || 3000;

    server = app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });

    const gracefulShutdown = (code = 0) => {
      if (server) {
        server.close(() => {
          console.log("Server closed gracefully.");
          process.exit(code);
        });
      } else {
        process.exit(code);
      }
    };

    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down...");
      gracefulShutdown(0);
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down...");
      gracefulShutdown(0);
    });

    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled Rejection detected:", reason);
      gracefulShutdown(1);
    });

    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception detected:", err);
      gracefulShutdown(1);
    });
  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1);
  }
}

main();