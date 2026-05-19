 'use client';

 import React from 'react';
 import Image from 'next/image';
 import type { AvatarDef } from '@/data/avatars';

 interface Props {
   avatar?: AvatarDef | null;
   url?: string | null; // preferência: profile.foto_url ou avatar.imageUrl
   size?: number; // pixels
   className?: string;
   alt?: string;
 }

 export default function Avatar({ avatar, url, size = 40, className, alt }: Props) {
   const innerSize = Math.round(size);

   // Prefer URL (user uploaded or image asset). Use next/image for optimization.
   const src = url || (avatar && (avatar as any).imageUrl);

   if (src) {
     // next/image requires valid src. For local files place them under /public and use '/avatars/..'
     return (
       <div style={{ width: innerSize, height: innerSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={className}>
         <Image
           src={src}
           alt={alt ?? avatar?.name ?? 'avatar'}
           width={innerSize}
           height={innerSize}
           className="w-full h-full object-cover"
           sizes={`${innerSize}px`}
           priority={false}
           loading="lazy"
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
