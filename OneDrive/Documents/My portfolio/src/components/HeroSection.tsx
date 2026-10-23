import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import watermarkImg from '../assets/watermark.png';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.2,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const navItems = [
  { name: 'ABOUT', href: '#about' },
  { name: 'PROJECTS', href: '#work' },
  { name: 'SKILLS', href: '#skills' },
  { name: 'EXPERIENCE', href: '#experience' },
  { name: 'CONTACT', href: '#contact' },
];

const BackgroundVideo: React.FC = React.memo(() => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const logStatus = (eventName: string) => {
      const bufferedRanges: string[] = [];
      for (let i = 0; i < video.buffered.length; i++) {
        bufferedRanges.push(`${video.buffered.start(i).toFixed(1)}s-${video.buffered.end(i).toFixed(1)}s`);
      }
      console.log(`[BackgroundVideo Diagnostic] Event: ${eventName}`, {
        currentSrc: video.currentSrc,
        readyState: video.readyState, // 4 = HAVE_ENOUGH_DATA
        networkState: video.networkState, // 1 = NETWORK_IDLE
        currentTime: video.currentTime.toFixed(2),
        paused: video.paused,
        error: video.error,
        buffered: bufferedRanges.join(', ') || 'none',
      });
    };

    const handleCanPlay = () => logStatus('canplay');
    const handlePlaying = () => logStatus('playing');
    const handleWaiting = () => logStatus('waiting (buffering stall)');
    const handleStalled = () => logStatus('stalled (network idle/stall)');
    const handleError = () => logStatus('error');

    video.addEventListener('canplay', handleCanPlay, { once: true });
    video.addEventListener('playing', handlePlaying, { once: true });
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('stalled', handleStalled);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('stalled', handleStalled);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#080706]"
      style={{ contain: 'paint', isolation: 'isolate' }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-center pointer-events-none"
        style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
      >
        <source src="/videos/vincen-background-optimized.mp4" type="video/mp4" />
      </video>

      {/* Subtle Localized Gradient Overlay: readability on the left, clear center & right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 md:via-black/25 to-transparent pointer-events-none" />
      {/* Subtle Vertical Vignette: ~15-20% overall baseline tone with gentle edge shading */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-black/20 pointer-events-none" />

      {/* ================= 3. ANIMATED WATERMARK EMBLEM ================= */}
      <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-12 pointer-events-none flex items-center justify-center z-10">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-36 h-36 bg-black/60 rounded-full blur-xl pointer-events-none" />

          <div
            className="relative flex items-center justify-center"
            style={{ willChange: 'transform', transform: 'translateZ(0)' }}
          >
            <img
              src={watermarkImg}
              alt="Insignia"
              className="w-28 h-28 lg:w-32 lg:h-32 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.25)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
});
BackgroundVideo.displayName = 'BackgroundVideo';

// Zero-overhead GPU custom cursor (no React re-renders on mousemove)
const CustomCursor: React.FC = React.memo(() => {
  const cursorRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let rAF: number;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${e.clientX - 5}px, ${e.clientY - 5}px, 0)`;
        cursor.style.opacity = '1';
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rAF);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-[#D4AF37]/50 shadow-[0_0_10px_rgba(212,175,55,0.25)] bg-[rgba(235,215,195,0.95)] w-2.5 h-2.5 opacity-0 transition-opacity duration-300"
      style={{ willChange: 'transform' }}
    />
  );
});
CustomCursor.displayName = 'CustomCursor';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-screen h-screen overflow-hidden bg-black text-[#E8DFD8] font-sans selection:bg-[#cbb59d] selection:text-black cursor-none">
      {/* ================= 1. MINIMAL CUSTOM CURSOR (ZERO RE-RENDER) ================= */}
      <CustomCursor />

      {/* ================= 2. CINEMATIC VIDEO BACKGROUND LAYER ================= */}
      <BackgroundVideo />


      {/* ================= 4. CONTENT LAYER ================= */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full px-6 sm:px-12 lg:px-16 pt-6 pb-8 pointer-events-none">

        {/* Navigation Bar */}
        <header className="relative flex items-center justify-between w-full pointer-events-auto">
          <a
            href="#"
            className="text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase text-[#EAD8C7] hover:opacity-75 transition-opacity"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            VINCEN M
          </a>

          {/* Navigation Links */}
          <nav
            className="hidden md:flex items-center space-x-8 lg:space-x-10 text-[11px] tracking-[0.28em] font-light uppercase text-[#C4B5A5] absolute left-1/2 -translate-x-1/2"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative group py-1 transition-colors duration-300 hover:text-[#FFF5EB]"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37]/50 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action */}
          <a
            href="#contact"
            className="group flex items-center space-x-2 text-[11px] tracking-[0.24em] font-light uppercase py-2 px-4 border border-[#8C6D4F]/50 hover:border-[#D4AF37] bg-[#120F0C]/80 text-[#EAD8C7] transition-all duration-300 ml-auto md:ml-0"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <span>LET&apos;S TALK</span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs">
              ↗
            </span>
          </a>
        </header>

        {/* Main Hero Content */}
        <div className="relative flex flex-col items-start justify-center w-full pt-4 pb-2 my-auto">

          {/* Hero Headline & Actions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl lg:max-w-3xl xl:max-w-4xl pointer-events-auto z-20"
          >
            {/* Massive Condensed Headline */}
            <motion.div variants={fadeUpVariants} className="relative mb-3.5 select-none">
              <h1
                className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.2rem] xl:text-[7.8rem] tracking-tight uppercase leading-[0.83]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {/* Line 1: I BUILD */}
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#D5CBC0] to-[#605448] drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
                  I BUILD
                </span>

                {/* Line 2: DIGITAL */}
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#F7E7C4] via-[#C99E5D] to-[#543B1A] drop-shadow-[0_8px_25px_rgba(201,158,93,0.35)]">
                  DIGITAL
                </span>

                {/* Line 3: EXPERIENCES */}
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#DFBE8A] via-[#9B7640] to-[#342410] drop-shadow-[0_10px_30px_rgba(155,118,64,0.4)]">
                  EXPERIENCES
                </span>
              </h1>
            </motion.div>

            {/* Subtitle Technologies */}
            <motion.div variants={fadeUpVariants} className="mb-4">
              <p
                className="text-[10px] sm:text-[11px] md:text-xs font-normal tracking-[0.28em] uppercase text-[#C4B29E]"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                DATA ANALYTICS <span className="text-[#8C6D4F] mx-1">•</span> DATA SCIENCE <span className="text-[#8C6D4F] mx-1">•</span> AI APPLICATION DEVELOPMENT
              </p>
            </motion.div>

            {/* 3-Line Description */}
            <motion.div
              variants={fadeUpVariants}
              className="text-xs sm:text-sm md:text-[13.5px] font-light text-[#A8988B] leading-[1.8] tracking-wide max-w-lg mb-6 space-y-1"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <p className="text-[#F7E7C4] font-medium tracking-wide">
                Turning Data Into Intelligence. Building Applied AI Solutions.
              </p>
              <p>
                I build data-driven solutions, interactive dashboards, and AI-powered applications that transform complex information into actionable insights.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-row items-center gap-4 sm:gap-6"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {/* Explore My Work CTA */}
              <motion.a
                href="#work"
                whileHover={{ scale: 1.02 }}
                className="relative inline-flex items-center space-x-3 px-6 sm:px-7 py-3.5 border border-[#8C6D4F] bg-[#120F0C]/80 hover:border-[#D4AF37] text-[#EAD8C7] hover:text-[#FFF5EB] text-[11px] font-medium tracking-[0.24em] uppercase transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.18)]"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E8D7C5]/40 to-transparent pointer-events-none" />
                <span>EXPLORE MY WORK</span>
                <span className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs">
                  ↗
                </span>
              </motion.a>

              {/* Download Resume Button */}
              <motion.a
                href="mailto:jasvince20011@gmail.com?subject=Resume%20Request%20-%20Vincen%20M."
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="relative inline-flex items-center space-x-2 px-6 sm:px-7 py-3.5 border border-[#8C6D4F]/40 hover:border-[#8C6D4F] text-[#BFA895] hover:text-[#EAD8C7] text-[11px] font-medium tracking-[0.24em] uppercase transition-all duration-300"
              >
                <span>DOWNLOAD RESUME</span>
                <span className="transform transition-transform duration-300 group-hover:translate-y-0.5 text-xs">
                  ↓
                </span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-2" />
      </div>
    </section>
  );
};

export default HeroSection;