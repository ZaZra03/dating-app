/**
 * Authentication API route for user login.
 * Handles email/password authentication and returns a JWT token.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Handles POST requests for user login.
 * 
 * @param req - The incoming request containing email and password in JSON body
 * @returns JSON response with access_token and user data, or error message
 * 
 * Request body: { email: string, password: string }
 * Response (200): { access_token: string, user: { id: number, email: string } }
 * Response (400): { message: 'Email and password required' }
 * Response (401): { message: 'Invalid credentials' }
 */
export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  return NextResponse.json({
    access_token: token,
    user: { id: user.id, email: user.email, name: user.name ?? undefined },
  });
}