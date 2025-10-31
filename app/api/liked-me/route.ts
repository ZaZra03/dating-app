/**
 * Liked Me API route.
 * Retrieves users who have liked (swiped right on) the authenticated user.
 * Excludes users who are already matched.
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
 * Retrieves users who have liked the authenticated user but haven't matched yet.
 * 
 * @param req - The incoming request with authorization header
 * @returns JSON response with array of user profiles who liked the current user
 * 
 * Response (200): Array of user profile objects
 * Response (401): { message: "Unauthorized" }
 */
export async function GET(req: NextRequest) {
  const userId = getUserIdFromAuthHeader(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const swipes: Array<{ fromId: number }> = await prisma.swipe.findMany({
    where: {
      toId: userId,
      direction: 'like',
    },
    select: {
      fromId: true,
    },
  });
  const likedMeUserIds = swipes.map(s => s.fromId);
  
  const matches: Array<{ userAId: number; userBId: number }> = await prisma.match.findMany({
    where: {
      OR: [
        { userAId: userId, userBId: { in: likedMeUserIds } },
        { userBId: userId, userAId: { in: likedMeUserIds } },
      ]
    }
  });
  const matchedUserIds = matches.map(m => (m.userAId === userId ? m.userBId : m.userAId));
  const filteredIds = likedMeUserIds.filter(id => !matchedUserIds.includes(id));
  
  const users = await prisma.user.findMany({
    where: { id: { in: filteredIds } },
    select: {
      id: true,
      name: true,
      age: true,
      bio: true,
      photoUrl: true,
    }
  });
  return NextResponse.json(users);
}
