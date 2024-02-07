import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import prismadb from "@/lib/prismadb";
import { RegisterSchema } from "@/schema";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () => {
  return NextResponse.json({}, { headers: corsHeaders });
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const validatedFields = RegisterSchema.safeParse(body);

    if (!validatedFields?.success) {
      return new NextResponse("name is required!!", { status: 400 });
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return  new NextResponse("Email already in use!", { status: 400 });
    }

    await prismadb.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { success: "User created success" },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    console.log("[REGISTER_POST_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
