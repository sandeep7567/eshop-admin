"use client";

import { FC, useState } from "react";

import { Copy, CopyCheck, IconNode, Server } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export const ApiAlert: FC<ApiAlertProps> = ({
  title,
  description,
  variant = "public",
}) => {
  const [isCopy, setIsCopy] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("api route copied to the clipboard");
    setIsCopy(true);
  };

  return (
    <Alert>
      <Server className="w-4 h-4" />
      <AlertTitle className="flex gap-x-4 items-center">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex justify-between items-center">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>
        <Button variant={"outline"} size={"icon"} onClick={onCopy}>
          {isCopy === false ? (
            <Copy className="h-4 w-4" />
          ) : (
            <CopyCheck className="h-4 w-4 text-emerald-600" />
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
};
