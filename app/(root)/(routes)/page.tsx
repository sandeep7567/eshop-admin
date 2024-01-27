"use client";

import { UseAccountModal } from "@/hooks/use-account-modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

const SetupPage = ({}) => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  const isOpenAccount = UseAccountModal((state) => state.isOpen);
  const onCloseAccount = UseAccountModal((state) => state.onClose);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
    if (isOpenAccount) {
      onCloseAccount();
    }
  }, [isOpen, onOpen, isOpenAccount, onCloseAccount ]);

  return null;
};

export default SetupPage;
