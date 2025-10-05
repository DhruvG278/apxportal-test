import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out",
    });
    response.cookies.delete("auth_token");
    return response;
  } catch (err: any) {
    console.error(err);
    return new NextResponse("Server error", { status: 500 });
  }
}
