import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { token } = await request.json();
    const SECRET_KEY = "0x4AAAAAAA1uE5CK29jy4QyENxrj9y3JrRg";

    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${SECRET_KEY}&response=${token}`,
    });

    const verifyResult = await verifyResponse.json();

    if (verifyResult.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}