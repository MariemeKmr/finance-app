import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import RecurringCharge from "@/models/RecurringCharge";

const VALID_CATEGORIES = ["Charges fixes", "Alimentation", "Transport", "Santé", "Loisirs", "Autres"];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    await connectDB();
    const charges = await RecurringCharge.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(charges);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { title, amount, category, description, dayOfMonth } = await req.json();

    if (!title || !amount)
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });

    if (title.length > 100)
      return NextResponse.json({ error: "Titre trop long" }, { status: 400 });

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0 || numAmount > 100_000_000)
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });

    if (!VALID_CATEGORIES.includes(category))
      return NextResponse.json({ error: "Catégorie invalide" }, { status: 400 });

    const numDay = Number(dayOfMonth);
    if (isNaN(numDay) || numDay < 1 || numDay > 31)
      return NextResponse.json({ error: "Jour du mois invalide" }, { status: 400 });

    await connectDB();
    const charge = await RecurringCharge.create({
      userId: session.user.id,
      title: title.trim(),
      amount: numAmount,
      category,
      description: description?.trim() || "",
      dayOfMonth: numDay,
    });

    return NextResponse.json(charge, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}