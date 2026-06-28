import { NextResponse } from "next/server";
import { runWorkflow } from "../../../graph/workflow";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName } = body;

    // Validate request
    if (!companyName || typeof companyName !== "string" || companyName.trim() === "") {
      return NextResponse.json(
        { error: "Invalid request: 'companyName' must be a non-empty string." },
        { status: 400 }
      );
    }

    const trimmedCompany = companyName.trim();

    // Execute the LangGraph workflow
    const graphState = await runWorkflow(trimmedCompany);

    return NextResponse.json(graphState, { status: 200 });
  } catch (error: unknown) {
    console.error("API /api/analyze failed:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing the workflow." },
      { status: 500 }
    );
  }
}
