import { useAuth } from "@/hooks/use-auth";

import prismadb from "@/lib/prismadb";
import { BillboardsSchema } from "@/schema";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  }
) => {
  try {
    const { isAuth, userInfo, userId } = await useAuth();
    const body = await req.json();

    const validatoresData = BillboardsSchema.safeParse(body);

    if (!validatoresData?.success) {
      return new NextResponse("name is required!!", { status: 400 });
    }

    const {
      data: { label, imageUrl },
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
    };

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_POST_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

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
    };

    const { storeId } = params;

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId
      }
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARD_GET_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  };
};
