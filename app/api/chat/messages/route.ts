/**
 * Chat messages API route.
 * Handles storing and retrieving chat messages for matches.
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
 * Incoming message format for storing chat messages.
 */
type IncomingMessage = {
  id?: string;
  content: string;
  createdAt?: string;
  user?: { name?: string };
};

/**
 * Stores chat messages for a match.
 * Automatically creates a chat session if one doesn't exist.
 * 
 * @param req - The incoming request with authorization header and message data
 * @returns JSON response with count of created messages
 * 
 * Request body: { matchId: number, messages: IncomingMessage[] }
 * Response (200): { created: number }
 * Response (400): { message: "matchId is required" } or { message: "messages array is required" } or { message: "Invalid JSON" }
 * Response (401): { message: "Unauthorized" }
 * Response (403): { message: "Forbidden" }
 * Response (404): { message: "Match not found" }
 */
export async function POST(req: NextRequest) {
  const authedUserId = getUserIdFromAuthHeader(req);
  if (!authedUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: { matchId?: number; messages?: IncomingMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const matchId = body.matchId;
  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (typeof matchId !== "number" || !Number.isFinite(matchId)) {
    return NextResponse.json({ message: "matchId is required" }, { status: 400 });
  }
  if (messages.length === 0) {
    return NextResponse.json({ message: "messages array is required" }, { status: 400 });
  }

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { userA: true, userB: true, chatSession: true },
  });
  if (!match) {
    return NextResponse.json({ message: "Match not found" }, { status: 404 });
  }
  if (match.userAId !== authedUserId && match.userBId !== authedUserId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const chatSession = match.chatSession
    ? match.chatSession
    : await prisma.chatSession.create({ data: { matchId } });

  const nameToUserId = new Map<string, number>();
  if (match.userA?.name) nameToUserId.set(match.userA.name, match.userAId);
  if (match.userB?.name) nameToUserId.set(match.userB.name, match.userBId);

  const seen = new Set<string>();
  const toCreate = messages
    .map((m) => {
      const key = `${m.content}::${m.createdAt ?? ""}`;
      if (seen.has(key)) return null;
      seen.add(key);

      let senderId: number | null = null;
      const incomingName = m.user?.name?.trim();
      if (incomingName && nameToUserId.has(incomingName)) {
        senderId = nameToUserId.get(incomingName)!;
      } else {
        senderId = authedUserId;
      }

      const sentAt = m.createdAt ? new Date(m.createdAt) : undefined;

      return {
        chatId: chatSession.id,
        senderId,
        content: m.content,
        ...(sentAt && !isNaN(sentAt.getTime()) ? { sentAt } : {}),
      };
    })
    .filter((x): x is { chatId: number; senderId: number; content: string; sentAt?: Date } => !!x);

  if (toCreate.length === 0) {
    return NextResponse.json({ created: 0 });
  }

  await prisma.chatMessage.createMany({ data: toCreate });

  return NextResponse.json({ created: toCreate.length });
}

/**
 * Retrieves chat messages for a match.
 * Automatically creates a chat session if one doesn't exist.
 * 
 * @param req - The incoming request with authorization header and query parameters
 * @returns JSON response with array of chat messages
 * 
 * Query parameters:
 *   - matchId (required): The match ID to retrieve messages for
 *   - limit (optional): Maximum number of messages to return (default: 200, max: 500)
 * 
 * Response (200): { messages: ChatMessage[] }
 * Response (400): { message: "matchId is required" }
 * Response (401): { message: "Unauthorized" }
 * Response (403): { message: "Forbidden" }
 * Response (404): { message: "Match not found" }
 */
export async function GET(req: NextRequest) {
  const authedUserId = getUserIdFromAuthHeader(req);
  if (!authedUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const matchIdParam = searchParams.get("matchId");
  const limitParam = searchParams.get("limit");
  const matchId = matchIdParam ? Number(matchIdParam) : NaN;
  const limit = limitParam ? Math.min(500, Math.max(1, Number(limitParam))) : 200;
  if (!Number.isFinite(matchId)) {
    return NextResponse.json({ message: "matchId is required" }, { status: 400 });
  }

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { userA: true, userB: true, chatSession: true },
  });
  if (!match) {
    return NextResponse.json({ message: "Match not found" }, { status: 404 });
  }
  if (match.userAId !== authedUserId && match.userBId !== authedUserId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const chatSession = match.chatSession
    ? match.chatSession
    : await prisma.chatSession.create({ data: { matchId } });

  const idToName = new Map<number, string>();
  if (match.userA?.name) idToName.set(match.userAId, match.userA.name);
  if (match.userB?.name) idToName.set(match.userBId, match.userB.name);

  const rows = await prisma.chatMessage.findMany({
    where: { chatId: chatSession.id },
    orderBy: { sentAt: "asc" },
    take: limit,
  });

  const messages = rows.map((m) => ({
    id: String(m.id),
    content: m.content,
    user: { name: idToName.get(m.senderId) || "Unknown" },
    createdAt: m.sentAt.toISOString(),
  }));

  return NextResponse.json({ messages });
}


