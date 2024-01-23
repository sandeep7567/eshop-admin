import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { ColorsSchema } from "@/schema";
import prismadb from "@/lib/prismadb";

export const GET = async (
  req: Request,
  {
    params,
  }: {
    params: { colorId: string };
  }
) => {
  try {
    if (!params?.colorId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const { colorId } = params;

    const color = await prismadb.color.findUnique({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[BILLBOARD_GET_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const validatorData = ColorsSchema.safeParse(body);

    if (!validatorData.success) {
      return new NextResponse("label/imageUrl required", { status: 400 });
    }

    const {
      data: { name, value  },
    } = validatorData;

    if (!params.colorId) {
      return new NextResponse("Color Id is required", { status: 400 });
    };

    // authorization don not change
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unathourized!", { status: 401 });
    };

    const color = await prismadb.color.update({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("COLOR_PATCH_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!params.colorId) {
      return new NextResponse("Color Id is required", { status: 400 });
    }

    // authorization do not change ( it's verify that user and their store );
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unathourized!", { status: 401 });
    }

    const color = await prismadb.color.delete({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("COLOR_DELETE_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
