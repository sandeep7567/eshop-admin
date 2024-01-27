"use client";

import { FC } from "react";

import { Modal } from "@/components/ui/modal";
import { UseAccountModal } from "@/hooks/use-account-modal";
import { AccountForm } from "../forms/_auth/account-form";

interface AccountModalProps {}

export const AccountModal: FC<AccountModalProps> = () => {
  const isOpenAccount = UseAccountModal((state) => state.isOpen);
  const onCloseAccount = UseAccountModal((state) => state.onClose);

  return (
    <Modal
      title=""
      description=""
      isOpen={isOpenAccount}
      onClose={onCloseAccount}
    >
      <AccountForm />
    </Modal>
  );
};
