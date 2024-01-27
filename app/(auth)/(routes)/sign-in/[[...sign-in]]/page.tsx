"use client";


import { UseAccountModal } from "@/hooks/use-account-modal";
import { useEffect } from "react";

export default function SignInPage() {

  const isOpenAccount = UseAccountModal((state) => state.isOpen);
  const onOpenAccount = UseAccountModal((state) => state.onOpen);

  useEffect(() => {
    if (!isOpenAccount) {
      onOpenAccount();
    }
  }, [isOpenAccount, onOpenAccount])

  if (!isOpenAccount) {
    return null;
  }
}
