import { config } from "@/config/env";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const clientId = config.CLIENT_ID;
    const redirectUri = config.REDIRECT_URI;
    console.log("process.env", process.env);
    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: "Missing CLIENT_ID or REDIRECT_URI in env" },
        { status: 500 }
      );
    }

    const oauthUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.variables.ALL,ZohoCRM.settings.ALL&client_id=${clientId}&response_type=code&access_type=offline&redirect_uri=${redirectUri}&prompt=consent`;

    return NextResponse.json({ redirect_url: oauthUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
