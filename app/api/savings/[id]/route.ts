import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Saving from "@/models/Saving";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { currentAmount } = await req.json();

    await connectDB();
    const saving = await Saving.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { currentAmount: Number(currentAmount) },
      { returnDocument: "after" }
    );

    if (!saving)
      return NextResponse.json({ error: "Objectif introuvable" }, { status: 404 });

    return NextResponse.json(saving);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    await connectDB();
    await Saving.findOneAndDelete({ _id: id, userId: session.user.id });
    return NextResponse.json({ message: "Objectif supprimé" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}