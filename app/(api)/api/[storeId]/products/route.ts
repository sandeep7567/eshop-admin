import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { ProductsSchema } from "@/schema";
import { useAuth } from "@/hooks/use-auth";

export const POST = async (
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  }
) => {
  try {
    const { userId } = await useAuth();
    const body = await req.json();

    const validatoresData = ProductsSchema.safeParse(body);

    if (!validatoresData?.success) {
      return new NextResponse("name is required!!", { status: 400 });
    }

    const {
      data: {
        name,
        images,
        categoryId,
        colorId,
        sizeId,
        price,
        isArchived,
        isFeatured,
      },
    } = validatoresData;

    if (!userId || typeof userId !== "string") {
      return new NextResponse("Unauthenticated!", { status: 401 });
    }

    const { storeId } = params;

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
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        colorId,
        sizeId,
        categoryId,
        isArchived,
        isFeatured,
        storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST_ERROR]-->", error);
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

    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    const priceId = searchParams.get("priceId") || undefined;
    const sortId = searchParams.get("sortId") || undefined;
    const name = searchParams.get("name")?.toString() || "";

    const [priceLow, priceHigh] = priceId?.split("-") || [];
    const [sortName, sortValue] = sortId?.split("-") || ["createdAt", "desc"];

    const products = await prismadb.product.findMany({
      where: {
        storeId,
        categoryId,
        sizeId,
        colorId,
        name: {
          contains: name.toLowerCase(),
        },
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
        price: {
          gte: priceLow ? Number(priceLow) : undefined,
          lte: priceHigh ? Number(priceHigh) : undefined,
        },
      },
      include: {
        category: true,
        size: true,
        color: true,
        images: true,
      },
      orderBy: {
        [sortName]: sortValue === "desc" ? "desc" : "asc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
