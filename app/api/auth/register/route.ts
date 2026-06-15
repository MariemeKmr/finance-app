import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { applyRateLimit } from "@/lib/rateLimiter";

export async function POST(req: NextRequest) {
  const limited = await applyRateLimit(req);
  if (limited) return limited;

  try {
    const { name, email: rawEmail, password } = await req.json();

    if (!name || !rawEmail || !password)
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });

    if (name.length < 2 || name.length > 50)
      return NextResponse.json({ error: "Nom invalide" }, { status: 400 });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = rawEmail.toLowerCase().trim();
    if (!emailRegex.test(email))
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });

    if (password.length < 6 || password.length > 100)
      return NextResponse.json({ error: "Mot de passe trop court (6 caractères min)" }, { status: 400 });

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "Compte créé avec succès", userId: user._id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}