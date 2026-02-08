'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LogoWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc: string;
  fallbackAlt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function LogoWithFallback({
  src,
  alt,
  fallbackSrc,
  fallbackAlt,
  width,
  height,
  className,
  priority,
}: LogoWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [imgAlt, setImgAlt] = useState(alt);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      console.warn(`Failed to load client logo: ${src}, falling back to: ${fallbackSrc}`);
      setImgSrc(fallbackSrc);
      setImgAlt(fallbackAlt);
      setHasError(true);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={imgAlt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={handleError}
    />
  );
}
