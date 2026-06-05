import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "Connexion MongoDB OK ✅" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}