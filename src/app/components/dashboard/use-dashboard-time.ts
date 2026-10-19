"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNow } from "../timeline/use-now";

export { useNow };

/** 所选日期写进 URL（?day=）供服务端按天载入；跟随今天时去掉参数，地址未变则不跳转 */
export function useDayInUrl(pickedDay: string | null): void {
  const router = useRouter();
  useEffect(() => {
    const target = pickedDay === null ? "" : `?day=${pickedDay}`;
    if (window.location.search === target) return;
    router.replace(`/${target}`, { scroll: false });
  }, [router, pickedDay]);
}
