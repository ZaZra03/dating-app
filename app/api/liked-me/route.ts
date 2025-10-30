import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

function getUserIdFromAuthHeader(req: NextRequest): number | null {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  try {
    const token = auth.substring("Bearer ".length);
    const payload = jwt.verify(token, JWT_SECRET) as any;
    return payload.userId;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const userId = getUserIdFromAuthHeader(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  // 1. Find all users who liked (swiped right on) current user
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
  // 2. Remove those where there is already a match (i.e., mutual like exists)
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
  // 3. Fetch their public profile data
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
