import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  fill?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = "100vw",
  quality = 75,
  fill = false,
  objectFit = "cover",
  ...props
}: OptimizedImageProps) {
  // Handle remote images (starting with http/https)
  const isRemote = src.startsWith('http');
  
  // For local images, ensure they're in the public directory
  const imageSrc = isRemote ? src : `/images/${src}`;

  if (fill) {
    return (
      <div className={cn("relative w-full", className)}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          quality={quality}
          style={{ objectFit }}
          {...props}
        />
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width || 1920}
      height={height || 1080}
      priority={priority}
      sizes={sizes}
      quality={quality}
      className={cn("", className)}
      style={{ objectFit }}
      {...props}
    />
  );
} 