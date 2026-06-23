import {
  siDocker,
  siGrafana,
  siImmich,
  siJellyfin,
  siPihole,
  siPortainer,
  siProxmox,
  siRadarr,
  siSonarr,
  siTailscale,
  type SimpleIcon,
} from "simple-icons";
import { cn } from "@/lib/utils";

// Map the brand label used in the bento data to its simple-icons glyph.
// Brands without an official monochrome mark (e.g. Restic) are intentionally
// left out — the slot then renders nothing instead of an ugly text box.
const BRAND_ICONS: Record<string, SimpleIcon> = {
  docker: siDocker,
  grafana: siGrafana,
  immich: siImmich,
  jellyfin: siJellyfin,
  "pi-hole": siPihole,
  pihole: siPihole,
  portainer: siPortainer,
  proxmox: siProxmox,
  radarr: siRadarr,
  sonarr: siSonarr,
  tailscale: siTailscale,
};

interface BrandLogoProps {
  brand: string;
  className?: string;
}

export function BrandLogo({ brand, className }: BrandLogoProps) {
  const icon = BRAND_ICONS[brand.trim().toLowerCase()];

  if (!icon) return null;

  return (
    <span
      className={cn("lab-app-logo", className)}
      role="img"
      aria-label={icon.title}
      title={icon.title}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="#0a0a0a">
        <path d={icon.path} fill="#0a0a0a" />
      </svg>
    </span>
  );
}
