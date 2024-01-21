import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export const POST = async (req: Request) => {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;
  
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.city,
    address?.country,
    address?.line1,
    address?.line2,
    address?.postal_code,
    address?.state,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(",");

  if (event?.type === "checkout.session.completed") {
    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        orderItems: true,
      },
    });

    // here we found all the purchased paid success product Ids
    const productIds = order.orderItems.map((orderItem) => orderItem.productId);

    // if product purchase id found above then mark purchase product archievd true to not show on produt page;
    await prismadb.product.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: {
        isArchived: true,
      },
    });
  }

  return new NextResponse(null, { status: 200 })
};
