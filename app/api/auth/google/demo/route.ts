import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const demoEmail = "demo.google@prizetrack.dev";
  const demoGoogleId = "google-demo-100293847561029384756";

  try {
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: demoGoogleId }, { email: demoEmail }],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: demoEmail,
          name: "Google Demo User",
          googleId: demoGoogleId,
          avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        },
      });
    }

    await createSession(user.id, user.email);

    return NextResponse.redirect(`${origin}/dashboard`);
  } catch (err) {
    console.error("Google Demo Error:", err);
    return NextResponse.redirect(`${origin}/login?error=Failed to log in with Google demo account`);
  }
}
