"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";
import { AccountModal } from "@/components/modals/account-models";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  };

  return (
    <>
      <AccountModal />
      <StoreModal />
    </>
  )
};