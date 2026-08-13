import { NextResponse } from "next/server";
import { performIRDSync } from "@/lib/ird/sync";

export async function POST(req: Request) {
  try {
    let bodyData;
    try {
      bodyData = await req.json();
    } catch {
      // Optional JSON payload for testing with mock IRD API response
    }

    const result = await performIRDSync(bodyData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "IRD Sync completed successfully.",
      data: result,
    });
  } catch (err) {
    console.error("API IRD Sync error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const result = await performIRDSync();
  return NextResponse.json({
    message: "IRD Sync API endpoint",
    result,
  });
}
