import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${origin}/login?error=Google authentication failed`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin;
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/api/auth/google/demo", request.url));
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Google token exchange failed:", tokenData);
      return NextResponse.redirect(`${origin}/login?error=Failed to exchange code with Google`);
    }

    // 2. Fetch User Info from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userResponse.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${origin}/login?error=Google account has no verified email`);
    }

    const email = googleUser.email.toLowerCase();

    // 3. Find or Create user in database
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: googleUser.id }, { email: email }],
      },
    });

    if (user) {
      // Update googleId and avatar if missing
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: user.googleId || googleUser.id,
          avatarUrl: googleUser.picture || user.avatarUrl,
          name: user.name || googleUser.name,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          name: googleUser.name || email.split("@")[0],
          googleId: googleUser.id,
          avatarUrl: googleUser.picture,
        },
      });
    }

    // 4. Create Session
    await createSession(user.id, user.email);

    return NextResponse.redirect(`${origin}/dashboard?toast=logged_in`);
  } catch (err) {
    console.error("Google Callback Error:", err);
    return NextResponse.redirect(`${origin}/login?error=An unexpected error occurred during Google authentication`);
  }
}
