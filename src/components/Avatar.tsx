 'use client';

 import React, { useEffect, useState } from 'react';
 import Image from 'next/image';
 import type { AvatarDef } from '@/data/avatars';

 interface Props {
   avatar?: AvatarDef | null;
   url?: string | null; // preferência: profile.foto_url ou avatar.imageUrl
   size?: number; // pixels (display size)
   className?: string;
  /** percentual de zoom aplicado na imagem (ex: 0.12 => escala 1.12). Ajuda a preencher a miniatura */
  zoom?: number;
   alt?: string;
 }

export default function Avatar({ avatar, url, size = 40, className, alt, zoom = 0.18 }: Props) {
   const innerSize = Math.round(size);

   // Prefer URL (user uploaded or image asset). Use next/image for optimization.
   const src = url || (avatar && (avatar as any).imageUrl);

   // Try to render higher-resolution image resources for high-DPI screens.
   // We'll request an image sized by devicePixelRatio (clamped) so Next's
   // internal loader produces a sharper srcset. This logic runs only on
   // the client (this component is `use client`).
   const [dpr, setDpr] = useState<number>(1);
   useEffect(() => {
     const pickDpr = () => {
       const winDpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
       // clamp to avoid requesting very large variants; 1..3 is a sensible range
       setDpr(Math.min(Math.max(1, Math.round(winDpr)), 3));
     };
     pickDpr();
     // devicePixelRatio changes are rare; we don't add a resize listener.
   }, []);

   if (src) {
  // Request a larger source image that matches the visual zoom so the
  // browser receives enough pixels after we scale the image up slightly.
  const requestedSize = Math.max(1, Math.round(innerSize * dpr * (1 + Math.max(0, zoom))));
     // next/image will create srcset entries based on the requested width/height
     // and the `sizes` attribute. We keep the displayed CSS size = innerSize so
     // the browser picks the higher-res resource for crisp rendering on HiDPI.
     return (
      <div
        style={{
          width: innerSize,
          height: innerSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '9999px',
          overflow: 'hidden',
          position: 'relative',
        }}
        className={className}
      >
          <Image
            src={src}
            alt={alt ?? avatar?.name ?? 'avatar'}
            width={requestedSize}
            height={requestedSize}
            unoptimized={src.startsWith('https://') || src.startsWith('data:')}
            className="w-full h-full"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
            sizes={`${innerSize}px`}
            quality={85}
            priority={false}
            loading="lazy"
          />

        {/* inner ring / border to match the design and hide edge artifacts */}
        <div
          aria-hidden
            style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '9999px',
            boxShadow: '0 6px 18px rgba(2,6,23,0.45)',
            border: '2px solid rgba(3,7,18,0.55)',
            pointerEvents: 'none',
          }}
        />
      </div>
     );
   }

   // Fallback: render inline SVG stored in avatar.svg
   if (avatar?.svg) {
     return (
       <div
         style={{ width: innerSize, height: innerSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
         className={className}
         aria-hidden={alt ? undefined : true}
         title={avatar.name}
       >
         <div
           style={{ width: innerSize, height: innerSize }}
           dangerouslySetInnerHTML={{ __html: avatar.svg }}
         />
       </div>
     );
   }

   // Last resort: initials placeholder
   const initial = (avatar?.name ?? alt ?? 'U').charAt(0).toUpperCase();
   return (
     <div
       style={{ width: innerSize, height: innerSize, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#cbd5e1', fontWeight: 700 }}
       className={className}
     >
       {initial}
     </div>
   );
 }
