/**
 * Photo upload API route.
 * Handles file uploads to Supabase Storage using service role key for server-side uploads.
 * Returns the public URL for the uploaded photo.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "profile-photos";

/**
 * Creates a Supabase client with service role key for server-side operations.
 * This allows uploads without requiring user authentication in the API route.
 */
function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for server-side uploads");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

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
 * Handles POST requests for photo uploads.
 * 
 * @param req - The incoming request with authorization header and multipart/form-data
 * @returns JSON response with photo URL, or error message
 * 
 * Request: multipart/form-data with 'file' field
 * Response (200): { url: string } - Public URL of uploaded photo
 * Response (400): { message: "No file provided" } or { message: "Invalid file type" } or { message: "File too large" }
 * Response (401): { message: "Unauthorized" }
 * Response (500): { message: "Upload failed" }
 */
export async function POST(req: NextRequest) {
  const userId = getUserIdFromAuthHeader(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Create Supabase service client
    const supabase = createServiceClient();

    // Generate unique filename: userId_timestamp_originalname
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}_${timestamp}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { message: "Upload failed", error: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { message: "Failed to generate public URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Upload failed", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

