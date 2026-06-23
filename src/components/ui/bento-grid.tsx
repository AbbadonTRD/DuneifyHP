"use client";

import type React from "react";
import { motion, type Variants } from "framer-motion";
import { BrandLogo } from "@/components/ui/brand-logo";
import { cn } from "@/lib/utils";

export interface BentoItem {
    title: string;
    description: string;
    icon?: React.ReactNode;
    brand?: string;
    status?: string;
    tags?: string[];
    meta?: string;
    cta?: string;
    colSpan?: number;
    hasPersistentHover?: boolean;
}

interface BentoGridProps {
    items?: BentoItem[];
}

const itemsSample: BentoItem[] = [
    {
        title: "Analytics Dashboard",
        meta: "v2.4.1",
        description:
            "Real-time metrics with AI-powered insights and predictive analytics",
        brand: "Grafana",
        status: "Live",
        tags: ["Statistics", "Reports", "AI"],
        colSpan: 2,
        hasPersistentHover: true,
    },
    {
        title: "Task Manager",
        meta: "84 completed",
        description: "Automated workflow management with priority scheduling",
        brand: "Docker",
        status: "Updated",
        tags: ["Productivity", "Automation"],
    },
    {
        title: "Media Library",
        meta: "12GB used",
        description: "Cloud storage with intelligent content processing",
        brand: "Jellyfin",
        tags: ["Storage", "CDN"],
        colSpan: 2,
    },
    {
        title: "Global Network",
        meta: "6 regions",
        description: "Multi-region deployment with edge computing",
        brand: "Tailscale",
        status: "Beta",
        tags: ["Infrastructure", "Edge"],
    },
];

function BentoGrid({ items = itemsSample }: BentoGridProps) {
    const normalizedItems = items.map((item) => ({
        ...item,
        cta: item.cta?.includes(">") ? item.cta : "Open >",
    }));

    // Stagger the cards in as the grid scrolls into view.
    const container: Variants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.07, delayChildren: 0.04 },
        },
    };

    const card: Variants = {
        hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
        },
    };

    return (
        <motion.div
            className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
        >
            {normalizedItems.map((item, index) => {
                return (
                <motion.div
                    key={index}
                    variants={card}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.985 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className={cn(
                        "lab-card group relative flex min-h-[180px] flex-col overflow-hidden p-5 sm:min-h-[204px]",
                        "will-change-transform",
                        item.colSpan === 2 ? "sm:col-span-2" : "col-span-1",
                        item.hasPersistentHover && "lab-card--featured"
                    )}
                >
                    <div className="lab-card-content flex h-full flex-col justify-between gap-4">
                        <div className="flex items-center justify-between gap-3">
                            {item.brand ? (
                                <BrandLogo brand={item.brand} />
                            ) : item.icon ? (
                                <div className="lab-app-slot">{item.icon}</div>
                            ) : (
                                <span aria-hidden="true" />
                            )}
                            <span className="lab-status">{item.status || "Active"}</span>
                        </div>

                        <div className="space-y-2">
                            <h3 className="lab-card-title">
                                <span>{item.title}</span>
                                {item.meta && (
                                    <span className="lab-card-meta">{item.meta}</span>
                                )}
                            </h3>
                            <p className="lab-card-copy">{item.description}</p>
                        </div>

                        <div className="flex items-end justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                {item.tags?.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="lab-tag"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <span className="lab-card-cta">
                                {item.cta || "Explore →"}
                            </span>
                        </div>
                    </div>
                </motion.div>
                );
            })}
        </motion.div>
    );
}

export { BentoGrid };
