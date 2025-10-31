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
  const { searchParams } = new URL(req.url);
  const ageMinParam = searchParams.get('ageMin');
  const ageMaxParam = searchParams.get('ageMax');
  const ageMin = ageMinParam ? Number(ageMinParam) : undefined;
  const ageMax = ageMaxParam ? Number(ageMaxParam) : undefined;
  // Find already swiped user IDs
  const swiped: Array<{ toId: number }> = await prisma.swipe.findMany({
    where: { fromId: userId },
    select: { toId: true }
  });
  const excludeIds = [userId, ...swiped.map((s) => s.toId)];

  // Build age filter
  const ageFilter: any = {};
  if (typeof ageMin === 'number' && Number.isFinite(ageMin)) {
    ageFilter.gte = ageMin;
  }
  if (typeof ageMax === 'number' && Number.isFinite(ageMax)) {
    ageFilter.lte = ageMax;
  }

  // Fetch next available profile with optional age filter
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
