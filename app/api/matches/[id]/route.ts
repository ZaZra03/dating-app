import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

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

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  const userId = getUserIdFromAuthHeader(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const p = ("params" in context && typeof (context as any).params?.then === "function")
    ? await (context as { params: Promise<{ id: string }> }).params
    : (context as { params: { id: string } }).params;

  const matchId = Number(p.id);
  if (!Number.isFinite(matchId)) {
    return NextResponse.json({ message: "Invalid match id" }, { status: 400 });
  }

  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      OR: [{ userAId: userId }, { userBId: userId }],
    },
  });

  if (!match) {
    return NextResponse.json({ message: "Match not found" }, { status: 404 });
  }

  const session = await prisma.chatSession.findUnique({ where: { matchId } });

  if (session) {
    await prisma.$transaction([
      prisma.chatMessage.deleteMany({ where: { chatId: session.id } }),
      prisma.chatSession.delete({ where: { id: session.id } }),
      prisma.swipe.deleteMany({
        where: {
          OR: [
            { fromId: match.userAId, toId: match.userBId },
            { fromId: match.userBId, toId: match.userAId },
          ],
        },
      }),
      prisma.unmatch.upsert({
        where: { userAId_userBId: { userAId: match.userAId, userBId: match.userBId } },
        update: {},
        create: { userAId: match.userAId, userBId: match.userBId },
      }),
      prisma.unmatch.upsert({
        where: { userAId_userBId: { userAId: match.userBId, userBId: match.userAId } },
        update: {},
        create: { userAId: match.userBId, userBId: match.userAId },
      }),
      prisma.match.delete({ where: { id: matchId } }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.swipe.deleteMany({
        where: {
          OR: [
            { fromId: match.userAId, toId: match.userBId },
            { fromId: match.userBId, toId: match.userAId },
          ],
        },
      }),
      prisma.unmatch.upsert({
        where: { userAId_userBId: { userAId: match.userAId, userBId: match.userBId } },
        update: {},
        create: { userAId: match.userAId, userBId: match.userBId },
      }),
      prisma.unmatch.upsert({
        where: { userAId_userBId: { userAId: match.userBId, userBId: match.userAId } },
        update: {},
        create: { userAId: match.userBId, userBId: match.userAId },
      }),
      prisma.match.delete({ where: { id: matchId } }),
    ]);
  }

  return NextResponse.json({ success: true });
}
