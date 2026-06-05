"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";

import type { DashboardResource } from "@/entities/dashboard";
import { buttonVariants } from "@/shared/ui/button";
import { SmallTag } from "@/shared/ui/surfaces";
import { formatMinutes } from "../model/roadmap-view";

type ConnectedResourceMiniCardProps = {
  resource: DashboardResource;
};

export function ConnectedResourceMiniCard({ resource }: ConnectedResourceMiniCardProps) {
  const primarySkill = resource.skills.find((skill) => skill.emphasis === "primary") ?? resource.skills[0];

  return (
    <div className="rounded-[1.25rem] border border-surface-stroke-strong bg-white/55 p-4 shadow-panel">
      <div className="flex flex-wrap gap-2">
        <SmallTag>{resource.role}</SmallTag>
        <SmallTag>{primarySkill?.title ?? resource.primaryUseCaseLabel}</SmallTag>
        <SmallTag>{formatMinutes(resource.estimatedMinutes)}</SmallTag>
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground">{resource.title}</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {resource.note ?? resource.bestUseCase}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          className={buttonVariants({ size: "sm" })}
          href={resource.url}
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink className="size-3.5" />
          Open resource
        </a>
        <Link
          className={buttonVariants({ size: "sm", variant: "outline" })}
          href={`/resources#resource-${resource.id}`}
        >
          <ArrowUpRight className="size-3.5" />
          View details
        </Link>
      </div>
    </div>
  );
}
