import { NextResponse } from "next/server";

import { PropertiesSchema } from "@/schema";
import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";

export const GET = async (
  req: Request,
  {
    params,
  }: {
    params: { propertyId: string };
  }
) => {
  try {
    if (!params?.propertyId) {
      return new NextResponse("Property id is required", { status: 400 });
    }

    const { propertyId } = params;

    const property = await prismadb.property.findUnique({
      where: {
        id: propertyId,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.log("[PROPERTY_GET_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; propertyId: string } }
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const validatorData = PropertiesSchema.safeParse(body);

    if (!validatorData.success) {
      return new NextResponse("label/imageUrl required", { status: 400 });
    }

    const {
      data: { name },
    } = validatorData;

    if (!params.propertyId) {
      return new NextResponse("PropertyId is required", { status: 400 });
    }

    // authorization don not change
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unathourized!", { status: 401 });
    }

    const property = await prismadb.property.update({
      where: {
        id: params.propertyId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.log("PROPERTY_PATCH_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; propertyId: string } }
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

    if (!params.propertyId) {
      return new NextResponse("PropertyId is required", { status: 400 });
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

    const property = await prismadb.property.delete({
      where: {
        id: params.propertyId,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.log("PROPERTY_DELETE_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
