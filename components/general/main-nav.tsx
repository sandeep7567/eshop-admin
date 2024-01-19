"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { NavModal } from "../modals/nav-model";
import { Property } from "@prisma/client";
import { useState } from "react";
interface MainNavProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'property'> {
  className: string;
  property: Property[];
}

export const MainNav: React.FC<MainNavProps> = ({
  className,
  property,
  ...props
}) => {
  const pathname = usePathname();
  const params = useParams();

  // dyanamic routes
  const formattedProperty = property.map((prop) =>
    prop.name.toLowerCase() === "overview"
      ? {
          href: `/${params.storeId}`,
          label: `${prop.name.at(0)}${prop.name.slice(1)}`,
          active: pathname === `/${params.storeId}`,
        }
      : {
          href: `/${params.storeId}/${prop.name.toLowerCase()}`,
          label: `${prop.name.at(0)}${prop.name.slice(1)}`,
          active: pathname === `/${params.storeId}/${prop.name.toLowerCase()}`,
        }
  );

  // static routes
  const defaultRoute = [
    ...formattedProperty,
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: "Colors",
      active: pathname === `/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  const routing = !formattedProperty.length ? defaultRoute : formattedProperty;

  const routes = [...formattedProperty];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={cn(
        "flex items-center justify-center space-x-4 lg:space-x-6",
        className
      )}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route?.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route?.label}
        </Link>
      ))}
      {/* TODO:--> Dynamically add navbar routes=[{ label, href, pathname }] */}

      <NavModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {!isOpen ? (
        <Button
          onClick={() => {
            setIsOpen(true);
          }}
          variant={"nav"}
          size={"nav"}
        >
          <Plus />
        </Button>
      ) : null}
    </nav>
  );
};
