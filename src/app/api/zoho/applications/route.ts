import { NextRequest, NextResponse } from "next/server";
import { zohoApiRequest } from "@/utils/zohoRequest"; // or use fetch directly

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const schoolId = req.headers.get("x-school-id");
    const page = body?.page ?? 1;
    const perPage = body?.perPage ?? 50;
    const filters = body?.filters || {};
    const search = body?.search?.trim();

    if (!schoolId) {
      return new Response("Missing schoolId", { status: 400 });
    }

    // ---- Build Criteria ----
    const criteriaParts: string[] = [`(School:equals:${schoolId})`];

    // if (search) criteriaParts.push(`(Full_Name:starts_with:${search})`);
    // if (filters.program)
    //   criteriaParts.push(`(Programs_Interested_In:equals:${filters.program})`);
    // if (filters.status)
    //   criteriaParts.push(`(Contact_Status:equals:${filters.status})`);
    // if (filters.matchingStatus)
    //   criteriaParts.push(`(Matching_Status:equals:${filters.matchingStatus})`);

    // // URL-encode the criteria
    const criteria = `criteria=${encodeURIComponent(
      criteriaParts.join("and")
    )}`;
    console.log("criteria", criteria);
    // ---- Fetch from Zoho ----
    const { data } = await zohoApiRequest(
      "GET",
      `Contacts/search?${criteria}&page=${page}&per_page=${perPage}`,
      null
    );

    const totalPages = Math.ceil(data?.info?.count / perPage) || 1;

    return NextResponse.json({
      data: data?.data || [],
      pagination: {
        currentPage: page,
        perPage,
        totalPages,
        moreRecords: data?.info?.more_records ?? false,
        count: data?.info?.count ?? data.data?.length,
      },
    });
  } catch (err) {
    console.error("Error fetching Applications:", err);
    return new NextResponse(
      JSON.stringify({
        message: "Error fetching Applications",
        error: (err as any) ?? err,
      }),
      { status: 500 }
    );
  }
};
