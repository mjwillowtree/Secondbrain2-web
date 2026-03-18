"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderTree, Bot, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/today", label: "Today", icon: Sun },
  { href: "/", label: "Explorer", icon: FolderTree },
  { href: "/automations", label: "Automations", icon: Bot },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav data-testid="main-nav" className="border-b bg-background/80 backdrop-blur-sm px-4">
      <div className="flex items-center gap-6 h-12">
        <span className="text-[13px] font-bold tracking-tight text-foreground">
          Secondbrain2
        </span>
        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors",
                pathname === href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
