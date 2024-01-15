import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "E-shop name required",
  }),
});

export const POST = async (req: Request,) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    const validatoresData = formSchema.safeParse(body);

    if (!validatoresData?.success) {
      return new NextResponse("name is required!!", { status: 400 });
    };

    const { data: {name} } = validatoresData;

    if (!userId || typeof userId !== "string") {
      return new NextResponse("Unauthorized!", { status: 401 });
    };

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      }
    });

    return NextResponse.json(store);

  } catch (error) {
    console.log("[STORES_POST_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};