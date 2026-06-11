import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import RecurringCharge from "@/models/RecurringCharge";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    await connectDB();
    const charges = await RecurringCharge.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(charges);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const { title, amount, category, description, dayOfMonth } = await req.json();
    if (!title || !amount) return NextResponse.json({ error: "Champs requis" }, { status: 400 });
    await connectDB();
    const charge = await RecurringCharge.create({
      userId: session.user.id,
      title, amount: Number(amount), category, description,
      dayOfMonth: Number(dayOfMonth) || 1,
    });
    return NextResponse.json(charge, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}