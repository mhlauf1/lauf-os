// Prisma configuration for LAUF OS
// Database URLs are loaded from environment variables

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DIRECT_URL for migrations (non-pooled connection)
    // Use DATABASE_URL for application runtime (pooled connection)
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
