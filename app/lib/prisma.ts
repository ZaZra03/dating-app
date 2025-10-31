/**
 * Prisma client singleton instance.
 * Ensures a single PrismaClient instance across the application to prevent connection issues.
 */

import { PrismaClient } from '@/generated/prisma';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * Prisma client instance.
 * Uses a singleton pattern in development to prevent multiple instances during hot reload.
 * 
 * In development:
 * - Reuses the same instance across hot reloads
 * - Logs all database queries
 * 
 * In production:
 * - Creates a new instance on each serverless function invocation
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;