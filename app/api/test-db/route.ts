import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "Connexion MongoDB OK ✅" });
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ 
      error: String(error),
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}