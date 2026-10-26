"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  src: string;
};

export function PolaroidCollage({ src }: Props) {
  return (
    <div className="relative w-full">
      <motion.figure
        className="polaroid"
        initial={{ opacity: 0, y: 16, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        whileHover={{ y: -8, rotate: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="polaroid-tape" aria-hidden />
        <div className="relative aspect-3/4 overflow-hidden bg-[#efe6d4]">
          <Image
            src={src}
            alt="Joyeeta Biswas"
            fill
            sizes="(min-width: 640px) 380px, 80vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="pointer-events-none absolute right-3 bottom-6 z-20 h-12 w-12 overflow-hidden rounded-full border border-gold/60 shadow-[0_8px_18px_rgba(0,0,0,0.35)]">
          <Image
            src="/brand/monogram.png"
            alt=""
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
      </motion.figure>
    </div>
  );
}
