"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

type FsEl = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  mozRequestFullScreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

type FsDoc = Document & {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  mozCancelFullScreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
};

function getFsElement(doc: FsDoc) {
  return (
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement ||
    null
  );
}

async function requestFs(el: FsEl) {
  if (el.requestFullscreen) return el.requestFullscreen();
  if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
  if (el.mozRequestFullScreen) return el.mozRequestFullScreen();
  if (el.msRequestFullscreen) return el.msRequestFullscreen();
  throw new Error("Fullscreen API unavailable");
}

async function exitFs(doc: FsDoc) {
  if (doc.exitFullscreen) return doc.exitFullscreen();
  if (doc.webkitExitFullscreen) return doc.webkitExitFullscreen();
  if (doc.mozCancelFullScreen) return doc.mozCancelFullScreen();
  if (doc.msExitFullscreen) return doc.msExitFullscreen();
}

/**
 * Fullscreen with webkit/moz/ms prefixes. Esc exits natively;
 * graceful no-op / false when denied or unsupported.
 */
export function useFullscreen(targetRef: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const doc = document as FsDoc;
    const sync = () => {
      const el = targetRef.current;
      const fs = getFsElement(doc);
      setActive(!!el && fs === el);
    };
    sync();
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    document.addEventListener("mozfullscreenchange", sync);
    document.addEventListener("MSFullscreenChange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
      document.removeEventListener("mozfullscreenchange", sync);
      document.removeEventListener("MSFullscreenChange", sync);
    };
  }, [targetRef]);

  const enter = useCallback(async () => {
    const el = targetRef.current as FsEl | null;
    if (!el) return false;
    try {
      await requestFs(el);
      setActive(true);
      return true;
    } catch {
      setSupported(false);
      setActive(false);
      return false;
    }
  }, [targetRef]);

  const exit = useCallback(async () => {
    const doc = document as FsDoc;
    if (!getFsElement(doc)) {
      setActive(false);
      return true;
    }
    try {
      await exitFs(doc);
      setActive(false);
      return true;
    } catch {
      return false;
    }
  }, []);

  const toggle = useCallback(async () => {
    if (active) return exit();
    return enter();
  }, [active, enter, exit]);

  return { active, supported, enter, exit, toggle };
}
