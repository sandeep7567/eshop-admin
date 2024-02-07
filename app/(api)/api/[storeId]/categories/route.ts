import { auth } from "@/auth";
import prismadb from "@/lib/prismadb";
import { CategoriesSchema } from "@/schema";
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
    const session = await auth();
    const userId = session?.user?.id;
    
    const body = await req.json();

    const validatoresData = CategoriesSchema.safeParse(body);

    if (!validatoresData?.success) {
      return new NextResponse("name is required!!", { status: 400 });
    }

    const {
      data: { name, billboardId },
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

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST_ERROR]-->", error);
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
    }

    const { storeId } = params;

    const categories = await prismadb.category.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
