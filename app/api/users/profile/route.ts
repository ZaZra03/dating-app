/**
 * User profile API route.
 * Handles retrieval and updates of user profile information.
 */

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
 * Retrieves the authenticated user's profile information.
 * 
 * @param req - The incoming request with authorization header
 * @returns JSON response with user profile data, or error message
 * 
 * Response (200): User profile object with public fields
 * Response (401): { message: "Unauthorized" }
 * Response (404): { message: "User not found" }
 */
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

/**
 * Updates the authenticated user's profile information.
 * Only allowed fields can be updated (name, age, bio, photoUrl, hobbies, personality, goal, idealDate).
 * 
 * @param req - The incoming request with authorization header and update data in JSON body
 * @returns JSON response with updated user profile data, or error message
 * 
 * Request body: Partial profile fields to update
 * Response (200): Updated user profile object
 * Response (401): { message: "Unauthorized" }
 * Response (404): { message: "User not found" }
 * Response (500): { message: "Failed to update profile" }
 */
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
