import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

import { SizesSchema } from "@/schema";
import { auth } from "@clerk/nextjs";

export const POST = async (
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    const validatoresData = SizesSchema.safeParse(body);

    if (!validatoresData?.success) {
      return new NextResponse("name/value is required!!", { status: 400 });
    }

    const {
      data: { name, value },
    } = validatoresData;

    if (!userId || typeof userId !== "string") {
      return new NextResponse("Unauthenticated!", { status: 401 });
    }

    const { storeId } = params;

    if (!storeId) {
      return new NextResponse("store not found!", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unathourized!", { status: 401 });
    }

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_POST_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

// GET alL DATA
export const GET = async (
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  }
) => {
  try {
    if (!params?.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const { storeId } = params;

    const colors = await prismadb.color.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLORS_GET_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
