"use client";

import { FC, useState } from "react";

import { Check, Copy, Server } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { onCopy } from "@/hooks/use-copy";

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
  const copyTimeout = 1500;

  const onCopyText = () => {
    setIsCopy(true);
    const { success } = onCopy(description);
    
    if (success) {
      toast.success("api route copied to the clipboard");

      const interval = setTimeout(() => {
        clearInterval(interval);  // Clear the interval before setting setIsCopy(false)
        setIsCopy(false);
      }, copyTimeout);
    };
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
        <Button variant={"outline"} size={"icon"} onClick={onCopyText}>
          {isCopy === false ? (
            <Copy className="h-4 w-4" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
};
