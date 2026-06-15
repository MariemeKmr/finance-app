import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

const VALID_CATEGORIES = ["Charges fixes", "Alimentation", "Transport", "Santé", "Loisirs", "Épargne", "Salaire", "Freelance", "Autres"];
const VALID_TYPES = ["income", "expense"];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    await connectDB();
    const transactions = await Transaction.find({ userId: session.user.id }).sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await req.json();
    const { type, amount, category, description, date } = body;

    if (!type || !amount || !category)
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });

    if (!VALID_TYPES.includes(type))
      return NextResponse.json({ error: "Type invalide" }, { status: 400 });

    if (!VALID_CATEGORIES.includes(category))
      return NextResponse.json({ error: "Catégorie invalide" }, { status: 400 });

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0 || numAmount > 100_000_000)
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });

    if (description && description.length > 200)
      return NextResponse.json({ error: "Description trop longue" }, { status: 400 });

    await connectDB();
    const transaction = await Transaction.create({
      userId: session.user.id,
      type,
      amount: numAmount,
      category,
      description: description?.trim() || "",
      date: date ? new Date(date) : new Date(),
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}