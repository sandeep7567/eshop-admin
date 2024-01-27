import { NextResponse } from "next/server";

import { SettingsSchema } from "@/schema";
import prismadb from "@/lib/prismadb";
import { useAuth } from "@/hooks/use-auth";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { isAuth, userInfo, userId } = await useAuth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const validatorData = SettingsSchema.safeParse(body);

    if (!validatorData.success) {
      return new NextResponse("name not found", { status: 400 });
    }

    const {
      data: { name },
    } = validatorData;

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("Store_PATCH_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { isAuth, userInfo, userId } = await useAuth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("Store_PATCH_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
