import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const grantCode = searchParams.get("code");
    if (!grantCode) {
      return NextResponse.json(
        { error: "Grant code is missing" },
        { status: 400 }
      );
    }

    // Prepare Zoho OAuth request
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { error: "Missing CLIENT_ID, CLIENT_SECRET or REDIRECT_URI in env" },
        { status: 500 }
      );
    }

    // Exchange grant code for tokens
    const response = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code: grantCode,
        },
      }
    );

    console.log("Token response:", response.data);

    const { access_token, refresh_token, api_domain } = response.data;

    // You can store tokens in DB or return them
    return NextResponse.json({
      access_token,
      refresh_token,
      api_domain,
    });
  } catch (err: any) {
    console.error("Callback error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: 500 }
    );
  }
}
