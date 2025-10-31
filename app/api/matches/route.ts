/**
 * Matches API route.
 * Retrieves all matches for the authenticated user.
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
 * Retrieves all matches for the authenticated user.
 * Returns matches with the other user's profile information.
 * 
 * @param req - The incoming request with authorization header
 * @returns JSON response with array of match objects
 * 
 * Response (200): Array of match objects with other user's profile
 * Response (401): { message: "Unauthorized" }
 */
export async function GET(req: NextRequest) {
  const userId = getUserIdFromAuthHeader(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const matches: Array<{
    id: number;
    userAId: number;
    userBId: number;
    createdAt: Date;
    userA: { id: number; name: string | null; age: number | null; bio: string | null; photoUrl: string | null };
    userB: { id: number; name: string | null; age: number | null; bio: string | null; photoUrl: string | null };
  }> = await prisma.match.findMany({
    where: { OR: [{ userAId: userId }, { userBId: userId }] },
    orderBy: { createdAt: 'desc' },
    include: {
      userA: true,
      userB: true,
    },
  });
  
  const formatted = matches.map((match) => {
    const other = match.userAId === userId ? match.userB : match.userA;
    return {
      id: match.id,
      matchId: match.id,
      matchedAt: match.createdAt,
      name: other.name || '',
      age: other.age || null,
      bio: other.bio || '',
      photoUrl: other.photoUrl || '',
      userId: other.id
    };
  });
  return NextResponse.json(formatted);
}
