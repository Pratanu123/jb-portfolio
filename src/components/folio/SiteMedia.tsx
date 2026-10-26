import Image from "next/image";
import { isVideoUrl } from "@/lib/media";

type Props = {
  src: string;
  alt?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: "contain" | "cover";
};

export function SiteMedia({
  src,
  alt = "",
  fill,
  width,
  height,
  className = "",
  sizes,
  priority,
  objectFit = "contain",
}: Props) {
  const fitClass = objectFit === "cover" ? "object-cover" : "object-contain";

  if (isVideoUrl(src)) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={fill ? `absolute inset-0 h-full w-full ${fitClass} ${className}` : className}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={`${fitClass} ${className}`}
        sizes={sizes}
        priority={priority}
        unoptimized
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1200}
      height={height ?? 1200}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized
    />
  );
}
