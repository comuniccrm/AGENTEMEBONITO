import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import StarBorder from './StarBorder';

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title = '',
  date,
  scrollToExpand,
  textBlend = true,
  children,
}) => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // "start end" = progress is 0 when the top of the section enters the bottom of the screen.
  // "start start" = progress is 1 when the top of the section reaches the top of the screen.
  // This makes the video expand MAGICALLY as the user is scrolling down towards it!
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  const zoomProgress = scrollYProgress; // no need to remap, we want the full [0,1]
  
  // Transform values
  const mediaWidth = useTransform(zoomProgress, [0, 1], [300, isMobile ? window.innerWidth * 0.9 : 850]);
  const mediaHeight = useTransform(zoomProgress, [0, 1], [400, isMobile ? 450 : 550]);
  
  const textTranslateOut = useTransform(zoomProgress, [0, 1], [0, isMobile ? 300 : 800]);
  const bgOpacity = useTransform(zoomProgress, [0, 1], [1, 0.2]);
  const overlayOpacity = useTransform(zoomProgress, [0, 1], [0.7, 0.3]);
  const contentOpacity = useTransform(zoomProgress, [0.4, 1], [0, 1]);

  const firstWord = title.split(' ')[0] || '';
  const restOfTitle = title.split(' ').slice(1).join(' ') || '';

  return (
    <div ref={containerRef} className="w-full min-h-[200vh] relative bg-black flex flex-col items-center justify-center overflow-hidden">
        
      {/* Background Image that fades out */}
      <motion.div
        className="absolute inset-0 z-0 h-full w-full pointer-events-none"
        style={{ opacity: bgOpacity }}
      >
        <img
          src={bgImageSrc}
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      {/* Transforming Video/Image container */}
      <motion.div
  className="absolute z-0 top-1/2 left-1/2 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-[40px]"
  style={{
    x: "-50%",
    y: "-50%",
    width: mediaWidth,
    height: mediaHeight,
  }}
>
        <StarBorder 
          color="#00a8cc" 
          speed="10s" 
          thickness={12} 
          className="w-full h-full" 
          style={{ borderRadius: '40px' }}
          innerClassName="w-full h-full overflow-hidden relative"
          innerStyle={{ borderRadius: '40px' }}
        >
          {mediaType === 'video' ? (
            <div className="relative w-full h-full pointer-events-none bg-zinc-900">
              <video
                src={mediaSrc}
                poster={posterSrc}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <motion.div className="absolute inset-0 bg-black/50" style={{ opacity: overlayOpacity }} />
            </div>
          ) : (
            <div className="relative w-full h-full pointer-events-none bg-zinc-900">
              <img src={mediaSrc} alt={title} className="w-full h-full object-cover" />
              <motion.div className="absolute inset-0 bg-black/50" style={{ opacity: overlayOpacity }} />
            </div>
          )}
        </StarBorder>
      </motion.div>

      {/* Texts that split apart (Restored exact demo formatting with mix-blend-difference) */}
      <div className={`flex flex-row items-center justify-center text-center gap-0 w-full relative z-10 pointer-events-none ${textBlend ? 'mix-blend-difference' : 'mix-blend-normal'}`}>
        <motion.h2
          className="text-7xl md:text-[15rem] lg:text-[25rem] font-black whitespace-nowrap"
          style={{ x: useTransform(textTranslateOut, v => -v), color: 'white' }}
        >
          {firstWord}
        </motion.h2>
        <motion.h2
          className="text-7xl md:text-[15rem] lg:text-[25rem] font-black text-center whitespace-nowrap"
          style={{ x: textTranslateOut, color: 'white' }}
        >
          {restOfTitle}
        </motion.h2>
      </div>

      {/* Subtitles inside the expanding box effect */}
      <motion.div 
        className="absolute bottom-[20%] flex flex-col items-center text-center z-20 pointer-events-none"
        style={{ opacity: useTransform(zoomProgress, [0, 0.5], [1, 0]) }}
      >
        {date && <p className="text-2xl text-white font-semibold drop-shadow-lg">{date}</p>}
        {scrollToExpand && <p className="text-[#00a8cc] mt-2 font-bold uppercase tracking-widest drop-shadow-md">{scrollToExpand}</p>}
      </motion.div>

      {/* Rendered Children (The call to action content) */}
      <motion.div
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-end pb-[10vh] pointer-events-auto"
        style={{ opacity: contentOpacity, pointerEvents: useTransform(contentOpacity, v => v > 0.5 ? "auto" : "none") }}
      >
        {children}
      </motion.div>

    </div>
  );
};

export default ScrollExpandMedia;
