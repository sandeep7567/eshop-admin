import { useAuth } from "@/hooks/use-auth";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "E-shop name required",
  }),
});

export const GET = async (
  req: Request,
) => {
  const { isAuth, userId } = await useAuth();
  console.log({isAuth});
  try {
    if (!isAuth) {
      return new NextResponse("authentication user required", { status: 400 });
    };

    const store = await prismadb.store.findFirst({
      where: {
        userId,
      },
    });
    console.log({store});

    if (!store) {
      return new NextResponse("", { status: 200 });
    };

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_GET_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: Request,) => {
  try {

    const { isAuth, userInfo, userId } = await useAuth();

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