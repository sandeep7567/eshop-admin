"use client";

import { FC, useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";
import { AccountModal } from "@/components/modals/account-models";
import { useSession } from "next-auth/react";
import { Store } from "@prisma/client";

interface ModalProviderProps {
  store?: Store | null;
}

export const ModalProvider: FC<ModalProviderProps> = ({
  store,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { data: session } = useSession();
  console.log(session);
  console.log(store);

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