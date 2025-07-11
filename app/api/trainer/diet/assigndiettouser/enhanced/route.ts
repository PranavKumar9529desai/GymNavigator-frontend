import { NextRequest, NextResponse } from "next/server";
import { TrainerReqConfig } from "@/lib/AxiosInstance/trainerAxios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const trainerAxios = await TrainerReqConfig();
    const response = await trainerAxios.post("/diet/assigndiettouser/enhanced", body);
    
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error("Error in diet assignment API route:", error);
    
    // Handle axios errors
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: unknown; status: number } };
      return NextResponse.json(
        axiosError.response.data || { success: false, msg: "Assignment failed" },
        { status: axiosError.response.status }
      );
    }
    
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}
