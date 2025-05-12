import React, { useEffect, useState } from 'react'
import Image from 'next/image'

const ImageWithFallback = ({
  fallback = '/image-not-found.png',
  alt,
  src,
  ...props
}: { fallback?: string; alt: string; src: string } & React.ComponentProps<
  typeof Image
>) => {
  const [imgSrc, set_imgSrc] = useState(src === '' ? fallback : src)

  useEffect(() => {
    set_imgSrc(src)
  }, [src])

  return (
    <Image
      {...props}
      src={imgSrc ?? fallback}
      alt={alt ?? null}
      onLoadingComplete={(result) => {
        if (result.naturalWidth === 0) {
          set_imgSrc(fallback)
        }
      }}
      onError={() => {
        set_imgSrc(fallback)
      }}
    />
  )
}
export default ImageWithFallback
