import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EnterScreen } from "@/components/enter-screen";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";
import { CpuArchitecture } from "@/components/ui/cpu-architecture";
import HeroAscii from "@/components/ui/hero-ascii";
import HeroAsciiOne from "@/components/ui/hero-ascii-one";
import { OceanWaves } from "@/components/ui/ocean-waves";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import { RackTerminal } from "@/components/ui/rack-terminal";
import { WavePath } from "@/components/ui/wave-path";
import sharkImage from "@/assets/images/shark-duneify.png";

const services: BentoItem[] = [
  {
    title: "Media Vault",
    description:
      "Movies, shows and music served from your own stack, ready for every screen.",
    brand: "Jellyfin",
    status: "Serving",
    tags: ["Jellyfin", "Library", "4K"],
    cta: "Open >",
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Photo Vault",
    description:
      "Immich keeps the camera roll local, indexed and ready without renting access back.",
    brand: "Immich",
    status: "Synced",
    tags: ["Immich", "Photos"],
    cta: "Open >",
  },
  {
    title: "Network Filter",
    description:
      "Local DNS, tracker blocking and quiet routing before traffic leaves the house.",
    brand: "Pi-hole",
    status: "Filtering",
    tags: ["Pi-hole", "DNS"],
    cta: "Open >",
  },
  {
    title: "Container Deck",
    description:
      "The apps stay boxed, supervised and restartable without drama.",
    brand: "Docker",
    status: "Stacked",
    tags: ["Docker", "Portainer"],
    cta: "Open >",
    colSpan: 2,
  },
  {
    title: "System Health",
    description:
      "CPU, memory and thermals from the rack, visible before anything gets loud.",
    brand: "Proxmox",
    status: "Nominal",
    tags: ["Proxmox", "Grafana"],
    cta: "Open >",
    colSpan: 2,
  },
  {
    title: "Cold Backups",
    description:
      "Nightly snapshots to local disks and a cold copy for when luck runs out.",
    brand: "Restic",
    status: "Protected",
    tags: ["Restic", "Offsite"],
    cta: "Open >",
  },
  {
    title: "Remote Tunnel",
    description:
      "Encrypted access back home without exposing the whole rack to the open web.",
    brand: "Tailscale",
    status: "Peered",
    tags: ["Tailscale", "VPN"],
    cta: "Open >",
  },
  {
    title: "Ingest Queue",
    description:
      "Fetch, rename and file the incoming cargo before it hits the library.",
    brand: "Sonarr",
    status: "Sorting",
    tags: ["Sonarr", "Radarr"],
    cta: "Open >",
    colSpan: 2,
  },
];

function App() {
  const reduce = useReducedMotion();
  const [entered, setEntered] = useState(false);

  // Lock scrolling behind the enter-gate so the spiral stays the whole view
  // until the visitor chooses to come in.
  useEffect(() => {
    if (entered) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [entered]);

  return (
    <>
      {!entered && (
        <EnterScreen
          onEnter={() => {
            setEntered(true);
            window.scrollTo({ top: 0 });
          }}
        />
      )}

      <HeroAscii />

      <section className="scatter-original-section">
        <div className="scatter-backdrop" aria-hidden="true" />
        <ParticleTextEffect />
      </section>

      <section className="lab-section dark relative min-h-screen w-full overflow-hidden">
        <div className="lab-backdrop" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <motion.header
            initial={{ opacity: 0, y: reduce ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <h2 className="lab-heading text-3xl font-semibold sm:text-4xl">
                Home lab command
              </h2>
              <p className="lab-copy mt-2 max-w-md text-sm leading-relaxed sm:text-base">
                The parts that keep DUNEIFY alive: storage, routing,
                transcoding, backups and the queue feeding the archive.
              </p>
            </div>

            <div className="lab-status-pill inline-flex items-center gap-2 self-start px-3.5 py-1.5 text-xs font-medium">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              All systems nominal
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 24, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lab-card quicksync-bento group relative mb-4 overflow-hidden p-5 sm:p-7 lg:p-8"
          >
            <div className="lab-card-content quicksync-bento-content">
              <div className="quicksync-bento-copy">
                <div className="quicksync-app-mark mb-5">Intel Quick Sync</div>
                <h3 className="quicksync-bento-title">
                  Bad device? no problem.
                </h3>
                <p className="quicksync-bento-text">
                  Centralized Intel Quick Sync handles the heavy lift whenever a
                  screen cannot keep up. Phones, tablets, old laptops: the rack
                  transcodes once, the room keeps watching.
                </p>
                <div
                  className="quicksync-bento-tags"
                  aria-label="Quick Sync capabilities"
                >
                  <span className="lab-tag">#Intel Quick Sync</span>
                  <span className="lab-tag">#Hardware transcode</span>
                  <span className="lab-tag">#Multi-device</span>
                </div>
              </div>

              <div className="quicksync-bento-visual" aria-hidden="true">
                <CpuArchitecture text="Quicksync" />
              </div>
            </div>
          </motion.div>

          <BentoGrid items={services} />

          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 24, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <RackTerminal />
          </motion.div>
        </div>
      </section>

      <section className="seas-section dark relative min-h-[82vh] w-full overflow-hidden">
        <div className="lab-backdrop" aria-hidden="true" />
        <div className="seas-current" aria-hidden="true" />
        <OceanWaves />

        <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-7xl items-center px-4 py-20 sm:px-6 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="seas-compose flex w-full flex-col"
          >
            <WavePath className="seas-wave mb-12 w-full max-w-none" />
            <div className="seas-row">
              <img
                src={sharkImage}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="seas-shark"
              />

              <div className="seas-text flex flex-col gap-4">
                <h2 className="seas-title text-4xl font-semibold sm:text-6xl lg:text-7xl">
                  Sail the seven seas.
                </h2>
                <p className="seas-copy max-w-xl text-lg leading-relaxed sm:text-2xl">
                  Since buying isn't owning.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <HeroAsciiOne />
    </>
  );
}

export default App;
