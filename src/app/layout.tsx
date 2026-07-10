import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/** Root shell — locale-aware UI lives under `[locale]`. */
export default function RootLayout({ children }: Props) {
  return children;
}
