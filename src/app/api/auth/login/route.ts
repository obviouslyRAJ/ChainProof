import { NextResponse } from 'next/server';

const DEMO_EMAIL = 'demo@chainproof.com';
const DEMO_PASSWORD = 'chainproof123';

export async function POST(request: Request) {
    const { email, password } = await request.json();

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        const response = NextResponse.json({ success: true });
        response.cookies.set('auth-token', 'authenticated', {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
            sameSite: 'lax',
        });
        return response;
    }

    return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
    );
}
