"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { ClippedCircle } from "@/components/unlumen-ui/clipped-circle";
import { Tilt, type TiltProps } from "@/components/unlumen-ui/tilt";

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  /** left half of the split badge pill; shown as a simple pill if `badgeLabel` is omitted */
  price?: string;
  /** right half of the split pill, coloured by `badgeVariant` */
  badgeLabel?: string;
  badgeVariant?: "success" | "warning";
  imageSrc?: string;
  imageAlt?: string;
  /** wraps the card in a plain `<a>` tag */
  href?: string;
  children?: React.ReactNode;
  tiltProps?: Omit<TiltProps, "children" | "className">;
}

const BADGE_LABEL_CLASSES: Record<
  NonNullable<TiltCardProps["badgeVariant"]>,
  string
> = {
  success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
};

export function TiltCard({
  title,
  description,
  price,
  badgeLabel,
  badgeVariant = "success",
  imageSrc,
  imageAlt = "",
  href,
  children,
  tiltProps,
  className,
  ...props
}: TiltCardProps) {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const spotlightRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!innerRef.current || !spotlightRef.current) return;
    const rect = innerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.1), transparent 40%)`;
  };

  const handleMouseEnter = () => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = "1";
  };
  const handleMouseLeave = () => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
  };

  const inner = (
    <Tilt
      rotationFactor={11}
      {...tiltProps}
      className={cn(
        "relative group overflow-hidden",
        "bg-background border border-border rounded-lg",
        "flex flex-col gap-4",
        "h-48 sm:h-52 md:h-56 w-full",
        "hover:shadow-lg hover:scale-105 transition-all duration-400 ease-out",
        className,
      )}
    >
      <div 
        ref={innerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="absolute inset-0 z-0 h-full w-full pointer-events-auto"
      >
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            opacity: 0,
            background: `radial-gradient(600px circle at 50% 50%, rgba(255,255,255,0.1), transparent 40%)`,
          }}
        />
      </div>
      <div className="relative z-10 flex flex-row h-full transition-all duration-200 justify-between px-4 sm:px-6 py-4 sm:py-8 pointer-events-none">
        <div className="flex flex-col gap-3 flex-1 mr-2 justify-center h-full">
          <h2 className="text-2xl sm:text-3xl tracking-tight leading-tight font-black">
            {title}
          </h2>
          {description && (
            <p className="opacity-95 text-base sm:text-lg font-bold">{description}</p>
          )}
          {children && <div className="mt-2">{children}</div>}
        </div>

        {price && badgeLabel ? (
          <div className="inline-flex h-fit items-center text-sm whitespace-nowrap shrink-0">
            <span className="rounded-l-full bg-secondary h-fit py-1 px-2 font-medium">
              {price}
            </span>
            <span
              className={cn(
                "rounded-r-full text-sm h-fit py-1 px-2 font-medium",
                BADGE_LABEL_CLASSES[badgeVariant],
              )}
            >
              {badgeLabel}
            </span>
          </div>
        ) : price ? (
          <span className="h-fit rounded-full bg-secondary px-3 py-1 text-sm font-medium whitespace-nowrap shrink-0">
            {price}
          </span>
        ) : null}
      </div>

      {imageSrc && (
        <img
          src={imageSrc}
          alt={imageAlt}
          width={288}
          height={224}
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute z-10 top-27 w-72 -right-10",
            "rotate-[-5deg] border-border border rounded-md",
            "transition-transform duration-300 ease-out",
            "group-hover:-rotate-3 group-hover:-translate-y-1 group-hover:-translate-x-0.5",
          )}
        />
      )}

      <ClippedCircle circleClassName="bg-white" circleSize={800} />
    </Tilt>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block cursor-pointer"
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </a>
    );
  }

  return <div {...props}>{inner}</div>;
}
