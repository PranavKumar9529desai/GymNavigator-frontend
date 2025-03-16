import { TrainerReqConfig } from "@/lib/AxiosInstance/trainerAxios";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    const trainerAxios = await TrainerReqConfig();
    const response = await trainerAxios.get(`gym/${id}`);
    
    if (response.data.success) {
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json(
        { error: "Failed to fetch gym" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching gym:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching gym data" },
      { status: 500 }
    );
  }
}
