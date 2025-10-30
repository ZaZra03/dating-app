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

export async function POST(req: NextRequest) {
  const fromId = getUserIdFromAuthHeader(req);
  if (!fromId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { toUserId, direction } = await req.json();
  if (typeof toUserId !== "number" || !["like","skip"].includes(direction)) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  // Record the swipe (overwrite previous swipe if exists)
  await prisma.swipe.upsert({
    where: { fromId_toId: { fromId, toId: toUserId } },
    update: { direction },
    create: { fromId, toId: toUserId, direction },
  });

  // If it's a like, check for mutual like
  let match = false;
  let matchRecord = null;
  if (direction === "like") {
    const reciprocal = await prisma.swipe.findUnique({
      where: { fromId_toId: { fromId: toUserId, toId: fromId } },
    });
    if (reciprocal?.direction === "like") {
      // Create match if not already exists (always userAId < userBId for uniqueness)
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
