import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "Compte créé avec succès", userId: user._id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}