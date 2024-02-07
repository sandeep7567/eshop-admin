import { NextResponse } from "next/server";

import { SizesSchema } from "@/schema";
import prismadb from "@/lib/prismadb";

import { auth } from "@/auth";

export const GET = async (
  req: Request,
  {
    params,
  }: {
    params: { sizeId: string };
  }
) => {
  try {
    if (!params?.sizeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const { sizeId } = params;

    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const validatorData = SizesSchema.safeParse(body);

    if (!validatorData.success) {
      return new NextResponse("label/imageUrl required", { status: 400 });
    }

    const {
      data: { name, value },
    } = validatorData;

    if (!params.sizeId) {
      return new NextResponse("Size Id is required", { status: 400 });
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

    const size = await prismadb.size.update({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("SIZE_PATCH_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!params.sizeId) {
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

    const size = await prismadb.size.delete({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("SIZE_DELETE_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
