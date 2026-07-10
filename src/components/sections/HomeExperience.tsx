"use client";

import dynamic from "next/dynamic";
import { HoliStories } from "@/components/sections/HoliStories";

const GlyphEye = dynamic(
  () => import("@/components/sections/GlyphEye").then((m) => m.GlyphEye),
  { ssr: false },
);
const KineticTunnel = dynamic(
  () =>
    import("@/components/sections/KineticTunnel").then((m) => m.KineticTunnel),
  { ssr: false },
);
const SeedGrowth = dynamic(
  () => import("@/components/sections/SeedGrowth").then((m) => m.SeedGrowth),
  { ssr: false },
);
const ComfortDiptych = dynamic(
  () =>
    import("@/components/sections/ComfortDiptych").then(
      (m) => m.ComfortDiptych,
    ),
  { ssr: false },
);
const EcosystemConstellation = dynamic(
  () =>
    import("@/components/sections/EcosystemConstellation").then(
      (m) => m.EcosystemConstellation,
    ),
  { ssr: false },
);
const MantraWaterfall = dynamic(
  () =>
    import("@/components/sections/MantraWaterfall").then(
      (m) => m.MantraWaterfall,
    ),
  { ssr: false },
);
const MirrorHarvest = dynamic(
  () =>
    import("@/components/sections/MirrorHarvest").then((m) => m.MirrorHarvest),
  { ssr: false },
);

/** Home experience band stack — client-only canvases stay out of the RSC tree. */
export function HomeExperience() {
  return (
    <>
      <HoliStories mode="teaser" />
      <GlyphEye />
      <KineticTunnel />
      <SeedGrowth />
      <ComfortDiptych />
      <EcosystemConstellation />
      <MantraWaterfall />
      <MirrorHarvest />
    </>
  );
}
