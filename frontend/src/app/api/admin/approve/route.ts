import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
  }

  try {
    // Call the backend /verify endpoint
    const response = await fetch(`http://localhost:8000/verify?email=${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      throw new Error('Failed to verify user on backend');
    }

    // Redirect to a confirmation page on the frontend
    return NextResponse.redirect(new URL('/admin/approval-success', request.url));
  } catch (error) {
    console.error('Error approving user:', error);
    return NextResponse.json({ error: 'Failed to approve user' }, { status: 500 });
  }
}
