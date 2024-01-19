import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { PropertiesSchema } from "@/schema";
import { auth } from "@clerk/nextjs";

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

    const property = await prismadb.property.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.log("[PROPERTY_GET_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

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
    
    const validatoresData = PropertiesSchema.safeParse(body);

    if (!validatoresData?.success) {
      return new NextResponse("name is required!!", { status: 400 });
    }

    const {
      data: { name },
    } = validatoresData;

    if (!userId || typeof userId !== "string") {
      return new NextResponse("Unauthorized!", { status: 401 });
    };

    const {storeId} = params;

    if (!storeId) {
      return new NextResponse("store not found!", { status: 400 });
    }

    // authorization check;
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unathourized!", { status: 401 });
    };

    const alreadyExist = await prismadb.property.findFirst({
      where: {
        name,
        storeId,
      }
    });

    if (alreadyExist) {
      return new NextResponse("already Exist property!", { status: 401 });
    };

    const property = await prismadb.property.create({
      data: {
        name,
        storeId,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.log("[PROPERTY_POST_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};