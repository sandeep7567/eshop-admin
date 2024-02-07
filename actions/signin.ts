"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const login = async (provider: "google" | "github") => {
  let loginLink = "";
  try {
    const link =  await signIn(provider, { redirect: false, });
    console.log({link});
    loginLink += link
    // return loginLink;
  } catch (error) {
    if (error instanceof AuthError) {
      console.log(error);
    }
      // Handle auth errors
      throw error; // Rethrow all other errors
  }

  redirect(`${loginLink}`);
};
