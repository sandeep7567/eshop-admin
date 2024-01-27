
import { NextResponse } from "next/server";

import { ProductsSchema } from "@/schema";
import prismadb from "@/lib/prismadb";
import { useAuth } from "@/hooks/use-auth";

// get specific product by a productId;
export const GET = async (
  req: Request,
  {
    params,
  }: {
    params: { productId: string };
  }
) => {
  try {
    if (!params?.productId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const { productId } = params;

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        color: true,
        size: true,
        category: true,
        images: true,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    const { userId } = await useAuth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const validatorData = ProductsSchema.safeParse(body);

    if (!validatorData.success) {
      return new NextResponse("product details (credentials) required", { status: 400 });
    }

    const {
      data: { name, price, colorId, categoryId, sizeId, images, isArchived, isFeatured },
    } = validatorData;

    if (!params.productId) {
      return new NextResponse("product Id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // authorization;
    if (!storeByUserId) {
      return new NextResponse("Unathourized!", { status: 401 });
    };

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isArchived,
        isFeatured,
        images: {
          deleteMany: {}
        }
      },
    });
    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image)
            ]
          }
        }
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("PRODUCT_PATCH_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    const { userId } = await useAuth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unathourized!", { status: 405 });
    }

    const product = await prismadb.product.delete({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("PRODUCT_DELETE_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
