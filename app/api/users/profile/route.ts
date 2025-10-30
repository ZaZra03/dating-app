import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const PUBLIC_USER_FIELDS = {
  id: true,
  email: true,
  name: true,
  age: true,
  bio: true,
  photoUrl: true,
  hobbies: true,
  personality: true,
  goal: true,
  idealDate: true
};

function getUserIdFromAuthHeader(req: NextRequest): number | null {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  try {
    // jwt payload: { userId: number, iat, exp }
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
  const user = await prisma.user.findUnique({ where: { id: userId }, select: PUBLIC_USER_FIELDS });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const userId = getUserIdFromAuthHeader(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  // Only allow certain fields to be updated
  const updateData: any = {};
  if (typeof data.name === "string") updateData.name = data.name;
  if (typeof data.age === "number") updateData.age = data.age;
  if (typeof data.bio === "string") updateData.bio = data.bio;
  if (typeof data.photoUrl === "string") updateData.photoUrl = data.photoUrl;
  if (Array.isArray(data.hobbies)) updateData.hobbies = data.hobbies;
  if (Array.isArray(data.personality)) updateData.personality = data.personality;
  if (typeof data.goal === "string") updateData.goal = data.goal;
  if (typeof data.idealDate === "string") updateData.idealDate = data.idealDate;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: PUBLIC_USER_FIELDS
    });
    return NextResponse.json(user);
  } catch (err: any) {
    if (err.code === 'P2025') {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
