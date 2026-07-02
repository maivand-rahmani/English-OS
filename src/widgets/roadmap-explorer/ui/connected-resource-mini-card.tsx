"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";

import type { DashboardResource } from "@/entities/dashboard";
import { buttonVariants } from "@/shared/ui/button";
import { SmallTag } from "@/shared/ui/surfaces";
import { formatMinutes } from "../model/roadmap-view";

type ConnectedResourceMiniCardProps = {
  onStart?: (resource: DashboardResource) => void;
  resource: DashboardResource;
};

export function ConnectedResourceMiniCard({
  onStart,
  resource,
}: ConnectedResourceMiniCardProps) {
  const primarySkill = resource.skills.find((skill) => skill.emphasis === "primary") ?? resource.skills[0];
  const whyNow = resource.note ?? resource.whyRecommended;

  function handleOpen() {
    onStart?.(resource);
    window.open(resource.url, "_blank", "noreferrer");
  }

  return (
    <div className="rounded-[1.25rem] border border-surface-stroke-strong bg-surface-panel-muted p-4 shadow-panel">
      <div className="flex flex-wrap gap-2">
        <SmallTag>{resource.role}</SmallTag>
        <SmallTag>{primarySkill?.title ?? resource.primaryUseCaseLabel}</SmallTag>
        <SmallTag>{formatMinutes(resource.estimatedMinutes)}</SmallTag>
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground">{resource.title}</p>
      {whyNow ? (
        <>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Why now
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{whyNow}</p>
        </>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className={buttonVariants({ size: "sm" })}
          onClick={handleOpen}
          type="button"
        >
          <ExternalLink className="size-3.5" />
          Open resource
        </button>
        <Link
          className={buttonVariants({ size: "sm", variant: "outline" })}
          href={`/resources#resource-${resource.id}`}
        >
          <ArrowUpRight className="size-3.5" />
          Details
        </Link>
      </div>
    </div>
  );
}
