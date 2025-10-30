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
  // Find all matches involving this user
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
  // Format to always return the "other" user's info
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
