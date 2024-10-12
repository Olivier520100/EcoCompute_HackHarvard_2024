import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // Get the incoming request body
    const requestBody = await req.json();

    // Forward the request to the backend server
    const backendResponse = await fetch("http://localhost:8000/run-code-cell", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code_lines: requestBody.code,
      }),
    });

    // Check if the backend response is successful
    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: `Backend error: ${backendResponse.status}` },
        { status: backendResponse.status }
      );
    }

    // Parse the backend response
    const backendData = await backendResponse.json();

    // Send the backend response back to the client
    return NextResponse.json({ result: backendData.result }, { status: 200 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle errors
    return NextResponse.json(
      { message: `Error: ${error.message}` },
      { status: 500 }
    );
  }
};
