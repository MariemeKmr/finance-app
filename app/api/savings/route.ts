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
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { title, targetAmount, currentAmount, deadline, color } = await req.json();

    if (!title || !targetAmount)
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });

    if (title.length > 100)
      return NextResponse.json({ error: "Titre trop long" }, { status: 400 });

    const numTarget = Number(targetAmount);
    if (isNaN(numTarget) || numTarget <= 0 || numTarget > 100_000_000)
      return NextResponse.json({ error: "Montant cible invalide" }, { status: 400 });

    const numCurrent = Number(currentAmount) || 0;
    if (numCurrent < 0 || numCurrent > numTarget)
      return NextResponse.json({ error: "Montant actuel invalide" }, { status: 400 });

    const validColors = ["#069494", "#C48A9F", "#D4AF37", "#5B9BD5", "#8B7BB5", "#4CAF82"];
    const safeColor = validColors.includes(color) ? color : "#069494";

    await connectDB();
    const saving = await Saving.create({
      userId: session.user.id,
      title: title.trim(),
      targetAmount: numTarget,
      currentAmount: numCurrent,
      deadline: deadline ? new Date(deadline) : null,
      color: safeColor,
    });

    return NextResponse.json(saving, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}