import { zohoApiRequest } from "@/utils/zohoRequest";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const schoolId = req.headers.get("x-school-id");
    if (!schoolId) {
      return new NextResponse("Missing school ID", { status: 400 });
    }
    const { data: schoolData } = await zohoApiRequest(
      "GET",
      `Schools1/${schoolId}`,
      null
    );
    return NextResponse.json({ data: schoolData?.data?.[0] });
  } catch (err) {
    console.error("Error fetching school info:", err);
    return new NextResponse("Error fetching school info", { status: 500 });
  }
};
