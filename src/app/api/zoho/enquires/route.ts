import { zohoApiRequest } from "@/utils/zohoRequest";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const schoolId = req.headers.get("x-school-id");
    console.log("schoolId", schoolId);
    const page = body?.page ?? 1; // default to page 1
    const perPage = body?.perPage ?? 200; // default max per Zoho
    const filters = body?.filters || {};
    const search = body?.search?.trim();

    if (!schoolId) {
      return new Response("Missing schoolId", { status: 400 });
    }

    let criteriaParts: string[] = [`(School:equals:${schoolId})`];

    // Add optional filters
    if (filters.status) {
      criteriaParts.push(`(Lead_Status:equals:${filters.status})`);
    }
    if (filters.gender) {
      criteriaParts.push(`(Gender:equals:${filters.gender})`);
    }
    if (filters.yearLevel) {
      criteriaParts.push(`(School_Year_Level:equals:${filters.yearLevel})`);
    }

    // Add search condition (partial match for multiple fields)
    if (search) {
      const searchPart = `((Full_Name:starts_with:${search})or(Email:starts_with:${search})or(Phone:starts_with:${search}))`;
      criteriaParts.push(searchPart);
    }

    // Combine with AND
    const criteria = `criteria=${criteriaParts.join("and")}`;

    // ---- Fetch from Zoho ----
    const { data } = await zohoApiRequest(
      "GET",
      `Leads/search?${criteria}&page=${page}&per_page=${perPage}`,
      null
    );

    // Calculate total pages from Zoho's info
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
    console.error("Error fetching Leads:", err);
    return new NextResponse("Error in fetching Leads", { status: 500 });
  }
};
