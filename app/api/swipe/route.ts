/**
 * Swipe API route.
 * Handles user swipes (likes/skips) and creates matches when there's a mutual like.
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
 * Handles POST requests to record a swipe action (like or skip).
 * If both users have liked each other, automatically creates a match.
 * 
 * @param req - The incoming request with authorization header and swipe data
 * @returns JSON response with match status and match record if created
 * 
 * Request body: { toUserId: number, direction: "like" | "skip" }
 * Response (200): { match: boolean, matchRecord: Match | null }
 * Response (400): { message: "Invalid input" }
 * Response (401): { message: "Unauthorized" }
 */
export async function POST(req: NextRequest) {
  const fromId = getUserIdFromAuthHeader(req);
  if (!fromId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { toUserId, direction } = await req.json();
  if (typeof toUserId !== "number" || !["like","skip"].includes(direction)) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  await prisma.swipe.upsert({
    where: { fromId_toId: { fromId, toId: toUserId } },
    update: { direction },
    create: { fromId, toId: toUserId, direction },
  });

  let match = false;
  let matchRecord = null;
  if (direction === "like") {
    const reciprocal = await prisma.swipe.findUnique({
      where: { fromId_toId: { fromId: toUserId, toId: fromId } },
    });
    if (reciprocal?.direction === "like") {
      const [userAId, userBId] = fromId < toUserId ? [fromId, toUserId] : [toUserId, fromId];
      matchRecord = await prisma.match.upsert({
        where: { userAId_userBId: { userAId, userBId } },
        update: {},
        create: { userAId, userBId },
      });
      match = true;
    }
  }

  return NextResponse.json({ match, matchRecord });
}
