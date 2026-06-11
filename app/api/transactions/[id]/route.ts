import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    await connectDB();
    const transaction = await Transaction.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!transaction)
      return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });

    return NextResponse.json({ message: "Transaction supprimée" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}