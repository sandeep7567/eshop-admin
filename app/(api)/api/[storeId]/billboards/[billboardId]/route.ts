import { NextResponse } from "next/server";

import { BillboardsSchema } from "@/schema";
import prismadb from "@/lib/prismadb";
import { useAuth } from "@/hooks/use-auth";

// get specific billboard by a billboardId;
export const GET = async (
  req: Request,
  {
    params,
  }: {
    params: { billboardId: string };
  }
) => {
  try {
    if (!params?.billboardId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const { billboardId } = params;

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_GET_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) => {
  try {
    const { isAuth, userInfo, userId } = await useAuth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const validatorData = BillboardsSchema.safeParse(body);

    if (!validatorData.success) {
      return new NextResponse("label/imageUrl required", { status: 400 });
    }

    const {
      data: { label, imageUrl },
    } = validatorData;

    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unathourized!", { status: 401 });
    };

    const billboard = await prismadb.billboard.update({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("Store_PATCH_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) => {
  try {
    const { isAuth, userInfo, userId } = await useAuth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unathourized!", { status: 401 });
    }

    const billboard = await prismadb.billboard.delete({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("Store_PATCH_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
