import { zohoApiRequest } from "@/utils/zohoRequest";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { config } from "@/config/env";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const email = body?.email ?? null;
    const password = body?.password ?? null;

    if (!email || !password) {
      return new NextResponse("Missing email or password", { status: 400 });
    }

    if (password !== "Zoho@1234") {
      return new NextResponse("Invalid credentials", { status: 401 });
    }
    // 🔹 1. Fetch user by email
    const { data } = await zohoApiRequest(
      "GET",
      `School_Contacts/search?criteria=(Email:equals:${encodeURIComponent(
        email
      )})`,
      null
    );

    const schoolId = data?.data?.[0]?.School_Name?.id;

    if (!schoolId) {
      return new NextResponse("School not found", { status: 404 });
    }

    // 🔹 2. Fetch school details
    const { data: schoolData } = await zohoApiRequest(
      "GET",
      `Schools1/${schoolId}`,
      null
    );

    // 🔹 3. Create JWT token
    const token = jwt.sign(
      {
        email,
        schoolId,
        schoolData: { name: schoolData?.data?.[0]?.name ?? "" },
      },
      config.JWT_SECRET,
      { expiresIn: "1d" } // 1 day
    );

    // 🔹 4. Set token in HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      data: data?.data || [],
      schoolId,
      schoolData: schoolData?.data || {},
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error(err);
    return new NextResponse("Server error", { status: 500 });
  }
};
