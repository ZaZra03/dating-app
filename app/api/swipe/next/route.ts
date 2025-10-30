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
  // Find already swiped user IDs
  const swiped = await prisma.swipe.findMany({
    where: { fromId: userId },
    select: { toId: true }
  });
  const excludeIds = [userId, ...swiped.map(s => s.toId)];

  // Fetch next available profile
  const nextUser = await prisma.user.findFirst({
    where: { id: { notIn: excludeIds } },
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
