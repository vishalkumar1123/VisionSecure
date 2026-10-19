"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Clarity from "@microsoft/clarity";

export default function ClarityProvider() {
  const pathname = usePathname();
  useEffect(() => {
    if (/^\/(admin|profile|register)(\/|$)/.test(pathname)) return;
    const projectId = process.env.NEXT_PUBLIC_CLARITY_ID;

    if (projectId) {
      Clarity.init(projectId);
    }
  }, [pathname]);

  return null;
}