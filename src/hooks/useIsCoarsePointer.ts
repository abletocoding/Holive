"use client";

import { useEffect, useState } from "react";

/** True for touch / coarse pointers and narrow viewports — skip heavy desktop FX. */
export function useIsCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mqPointer = window.matchMedia("(pointer: coarse)");
    const mqNarrow = window.matchMedia("(max-width: 768px)");
    const update = () => setCoarse(mqPointer.matches || mqNarrow.matches);
    update();
    mqPointer.addEventListener("change", update);
    mqNarrow.addEventListener("change", update);
    return () => {
      mqPointer.removeEventListener("change", update);
      mqNarrow.removeEventListener("change", update);
    };
  }, []);

  return coarse;
}
