import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

import { SizesSchema } from "@/schema";
import { auth } from "@/auth";

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

    const validatoresData = SizesSchema.safeParse(body);

    if (!validatoresData?.success) {
      return new NextResponse("name/value is required!!", { status: 400 });
    }

    const {
      data: { name, value },
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

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_POST_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

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

    const products = await prismadb.product.findMany({
      where: {
        storeId,
      },
    });

    const priceRanges = products
      .filter((item) => item?.price >= 5)
      .map((priceRange) => ({
        id: `${Number(priceRange?.price) - 5}-${Number(priceRange?.price) + 5}`,
        name: `$${Number(priceRange?.price) - 5}-$${
          Number(priceRange?.price) + 5
        }`,
        value: `${Number(priceRange?.price) - 5}-${
          Number(priceRange?.price) + 5
        }`,
      }));

    const uniqueIds = new Set<string>();

    // Filter the array to keep only objects with unique IDs
    const uniquePriceRanges = priceRanges.filter((obj) => {
      // Check if the current object's ID is not in the Set
      if (!uniqueIds.has(obj.id)) {
        // Add the ID to the Set (marking it as seen)
        uniqueIds.add(obj.id);
        // Include the object in the result
        return true;
      }
      // Exclude the object if its ID has been seen before
      return false;
    });

    return NextResponse.json(uniquePriceRanges);
  } catch (error) {
    console.log("[PRICE_GET_ERROR]-->", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
