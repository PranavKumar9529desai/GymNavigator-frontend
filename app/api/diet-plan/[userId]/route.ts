import { NextResponse } from "next/server";
import { gethealthprofileById } from "@/app/dashboard/trainer/diet/assigndietplan/assigndietplanwithai2/_actions/get-healthprofile-by-id";
import { generateDietWithAI } from "@/app/dashboard/trainer/diet/assigndietplan/assigndietplanwithai2/_actions/generate-diet-with-ai";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    // Get the user's health profile
    const healthProfileResult = await gethealthprofileById(userId);

    if (!healthProfileResult.success) {
      return NextResponse.json(
        { error: healthProfileResult.error || "Failed to fetch health profile" },
        { status: 404 }
      );
    }

    // Generate a diet plan using the health profile
    const dietPlans = await generateDietWithAI(
      userId,
      healthProfileResult.data,
      ["Monday"] // Just generate Monday's plan for API efficiency
    );

    return NextResponse.json(dietPlans.Monday || {}, { status: 200 });
  } catch (error) {
    console.error("Error in diet plan API:", error);
    return NextResponse.json(
      { error: "Failed to generate diet plan" },
      { status: 500 }
    );
  }
} 