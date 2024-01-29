import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/schema";

import { User } from "@prisma/client";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

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

    const validatedFields = LoginSchema.safeParse(body);

    if (!validatedFields?.success) {
      return new NextResponse("email-password is required!!", { status: 400 });
    }

    const { email, password } = validatedFields.data;

    const existingUser = (await getUserByEmail(email)) as User;

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return new NextResponse("Email does not exist!", { status: 400 });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      existingUser?.password
    );

    if (!passwordMatch) {
      return new NextResponse("password mismatch!", { status: 400 });
    }
    
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    const user = {
      id: existingUser?.id,
      email: existingUser?.email,
      name: existingUser?.name,
      role: existingUser?.role,
      image: existingUser?.image,
    }

    return NextResponse.json({success: true, user},
      { headers: corsHeaders, status: 200 }
    );

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    console.log("[LOGIN_POST_ERROR]-->", error);
    throw error;
    return new NextResponse("Internal error", { status: 500 });

  }
};
