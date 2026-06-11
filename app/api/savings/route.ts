import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Saving from "@/models/Saving";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    await connectDB();
    const savings = await Saving.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(savings);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { title, targetAmount, currentAmount, deadline, color } = await req.json();

    if (!title || !targetAmount)
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });

    await connectDB();
    const saving = await Saving.create({
      userId: session.user.id,
      title,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      deadline: deadline ? new Date(deadline) : null,
      color: color || "#069494",
    });

    return NextResponse.json(saving, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}