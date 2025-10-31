/**
 * Swipe discovery API route.
 * Returns the next available user profile for the authenticated user to swipe on.
 * Supports optional age filtering via query parameters.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Extracts user ID from the Authorization Bearer token header.
 * 
 * @param req - The incoming request with authorization header
 * @returns User ID if token is valid, null otherwise
 */
function getUserIdFromAuthHeader(req: NextRequest): number | null {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  try {
    const token = auth.substring("Bearer ".length);
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    return payload.userId;
  } catch {
    return null;
  }
}

/**
 * Retrieves the next available user profile for swiping.
 * Excludes users already swiped on and supports optional age filtering.
 * 
 * @param req - The incoming request with authorization header and optional query parameters
 * @returns JSON response with next user profile or done status
 * 
 * Query parameters:
 *   - ageMin (optional): Minimum age for filtering
 *   - ageMax (optional): Maximum age for filtering
 * 
 * Response (200): { id, name, age, photoUrl, bio } or { done: true }
 * Response (401): { message: "Unauthorized" }
 */
export async function GET(req: NextRequest) {
  const userId = getUserIdFromAuthHeader(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const ageMinParam = searchParams.get('ageMin');
  const ageMaxParam = searchParams.get('ageMax');
  const ageMin = ageMinParam ? Number(ageMinParam) : undefined;
  const ageMax = ageMaxParam ? Number(ageMaxParam) : undefined;
  
  const swiped: Array<{ toId: number }> = await prisma.swipe.findMany({
    where: { fromId: userId },
    select: { toId: true }
  });
  // Users explicitly unmatched (both directions)
  const unmatches: Array<{ userAId: number; userBId: number }> = await prisma.unmatch.findMany({
    where: { OR: [ { userAId: userId }, { userBId: userId } ] },
    select: { userAId: true, userBId: true }
  });
  const unmatchIds = unmatches.map((u) => (u.userAId === userId ? u.userBId : u.userAId));
  const excludeIds = [userId, ...swiped.map((s) => s.toId), ...unmatchIds];

  const ageFilter: any = {};
  if (typeof ageMin === 'number' && Number.isFinite(ageMin)) {
    ageFilter.gte = ageMin;
  }
  if (typeof ageMax === 'number' && Number.isFinite(ageMax)) {
    ageFilter.lte = ageMax;
  }

  const whereClause: any = { id: { notIn: excludeIds } };
  if (ageFilter.gte !== undefined || ageFilter.lte !== undefined) {
    whereClause.AND = [
      { age: ageFilter },
    ];
  }

  const nextUser = await prisma.user.findFirst({
    where: whereClause,
    select: {
      id: true,
      name: true,
      age: true,
      photoUrl: true,
      bio: true
    }
  });
  if (!nextUser) {
    return NextResponse.json({ done: true });
  }
  return NextResponse.json(nextUser);
}
