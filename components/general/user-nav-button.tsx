"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExtendedUser } from "@/next-auth";

import { useEffect, useState } from "react";
import { LogoutButton } from "../ui/logout-button";
import { UseAccountModal } from "@/hooks/use-account-modal";
import { Store } from "@prisma/client";

interface UserNavButtonProps {
  userInfo?: ExtendedUser;
  stores: Store[];
}

export function UserNavButton({ userInfo, stores }: UserNavButtonProps) {
  const [isMounted, setIsMounted] = useState(false);

  const isOpen = UseAccountModal((state) => state.isOpen);
  const onClose = UseAccountModal((state) => state.onClose);

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }

    if (isOpen) {
      onClose();
    }
  }, [isMounted, isOpen, onClose]);

  if (!isMounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 bg-orange-300">
            <AvatarImage
              className="bg-orange-300"
              src={userInfo?.image || undefined}
              alt="profile"
            />
            <AvatarFallback className="bg-orange-300">SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userInfo?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userInfo?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer">
            Log out
            {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
