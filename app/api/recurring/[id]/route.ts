import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import RecurringCharge from "@/models/RecurringCharge";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const body = await req.json();
    await connectDB();
    const charge = await RecurringCharge.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { ...body, amount: body.amount ? Number(body.amount) : undefined },
      { returnDocument: "after" }
    );
    if (!charge) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json(charge);
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
    await RecurringCharge.findOneAndDelete({ _id: id, userId: session.user.id });
    return NextResponse.json({ message: "Supprimé" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}