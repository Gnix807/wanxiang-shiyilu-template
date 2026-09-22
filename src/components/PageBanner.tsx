import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { infoConfig } from "../config/info";

interface PageBannerProps {
  pathname?: string;
  categoryName?: string | null;
  tagName?: string | null;
  postsCount?: number;
  post?: any;
}

export function PageBanner({ 
  pathname: propPathname, 
  categoryName: propCategoryName, 
  tagName: propTagName, 
  postsCount: propPostsCount,
  post: propPost
}: PageBannerProps) {
  // Use props if provided, otherwise fallback to window.location (client-side only)
  const pathname = propPathname || (typeof window !== 'undefined' ? window.location.pathname : '');
  const isHome = pathname === '/' || pathname === '/index.html';

  const categoryName = propCategoryName;
  const tagName = propTagName;
  const post = propPost;
  const SecondaryHeading: 'h1' | 'h2' = post ? 'h2' : 'h1';
  const postsCount = propPostsCount || 0;

  const hasRightContent = useMemo(() => {
    return !!(categoryName || tagName || post || pathname === "/talk" || pathname.startsWith("/talk/") || pathname.startsWith("/talks/"));
  }, [categoryName, tagName, post, pathname]);

  // Determine what type of content to render on the right side
  const rightSideContent = useMemo(() => {
    if (categoryName) {
      return (
        <motion.div
          key="category"
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -60, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex flex-col items-center md:items-end justify-center gap-1 md:gap-1.5 mt-2 md:mt-0 max-w-full"
        >
          <div className="text-[10px] md:text-xs font-black text-[#9e2a2b] dark:text-[#d9534f] bg-white dark:bg-[#242220] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] px-2 py-0.5 rounded-sm shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] transform md:rotate-2 uppercase tracking-widest shrink-0 select-none">
            {infoConfig.banner.labels.category}
          </div>
          <SecondaryHeading className="text-sm md:text-3xl font-black text-[#1a1a1a] dark:text-[#e8e6e3] bg-[#f4efe6] dark:bg-[#242220] border-2 md:border-3 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[2.5px_2.5px_0px_0px_#9e2a2b] dark:shadow-[2.5px_2.5px_0px_0px_#d9534f] px-4 py-1 transform md:-rotate-1 shrink-0 max-w-[70vw] md:max-w-[450px] truncate font-sans">
            {categoryName}
          </SecondaryHeading>
          <div className="font-bold text-[#1a1a1a] dark:text-[#e8e6e3] bg-white dark:bg-[#1c1b1a] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#9e2a2b] dark:shadow-[2px_2px_0px_0px_#d9534f] text-[10px] md:text-xs shrink-0">
            {postsCount} 篇
          </div>
        </motion.div>
      );
    }

    if (tagName) {
      return (
        <motion.div
          key="tag"
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -60, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex flex-col items-center md:items-end justify-center gap-1 md:gap-1.5 mt-2 md:mt-0 max-w-full"
        >
          <div className="text-[10px] md:text-xs font-black text-[#9e2a2b] dark:text-[#d9534f] bg-white dark:bg-[#242220] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] px-2 py-0.5 rounded-sm shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] transform md:rotate-2 uppercase tracking-widest shrink-0 select-none">
            {infoConfig.banner.labels.tag}
          </div>
          <SecondaryHeading className="text-sm md:text-3xl font-black text-[#1a1a1a] dark:text-[#e8e6e3] bg-[#f4efe6] dark:bg-[#242220] border-2 md:border-3 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[2.5px_2.5px_0px_0px_#9e2a2b] dark:shadow-[2.5px_2.5px_0px_0px_#d9534f] px-4 py-1 transform md:-rotate-1 shrink-0 max-w-[70vw] md:max-w-[450px] truncate font-sans">
            #{tagName}
          </SecondaryHeading>
          <div className="font-bold text-[#1a1a1a] dark:text-[#e8e6e3] bg-white dark:bg-[#1c1b1a] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#9e2a2b] dark:shadow-[2px_2px_0px_0px_#d9534f] text-[10px] md:text-xs shrink-0">
            {postsCount} 篇
          </div>
        </motion.div>
      );
    }

    if (post) {
      return (
        <motion.div
          key="post-detail"
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -60, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex flex-col items-center md:items-end justify-center gap-1.5 md:gap-2 mt-2 md:mt-0 max-w-full shrink-0 pr-1"
        >
          <div className="text-[10px] md:text-xs font-black text-[#9e2a2b] dark:text-[#d9534f] bg-white dark:bg-[#242220] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] px-2 py-0.5 rounded-sm shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] transform md:rotate-2 uppercase tracking-widest shrink-0 select-none">
            {infoConfig.banner.labels.post}
          </div>
          <h2 className="text-xs sm:text-base md:text-xl lg:text-2xl font-black text-[#1a1a1a] dark:text-[#e8e6e3] bg-[#f4efe6] dark:bg-[#242220] border-2 md:border-3 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[2.5px_2.5px_0px_0px_#9e2a2b] dark:shadow-[2.5px_2.5px_0px_0px_#d9534f] px-3.5 py-1.5 transform md:-rotate-1 shrink-0 max-w-[85vw] md:max-w-[420px] lg:max-w-[500px] leading-snug font-sans text-center md:text-right break-words line-clamp-2">
            {post.title}
          </h2>
          <div className="font-mono font-bold text-[#9e2a2b] dark:text-[#d9534f] bg-white dark:bg-[#242220] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] text-[10px] md:text-xs shrink-0 tracking-wider whitespace-nowrap">
            {post.date}
          </div>
        </motion.div>
      );
    }

    if (pathname === "/talk" || pathname.startsWith("/talk/") || pathname.startsWith("/talks/")) {
      return (
        <motion.div
          key="talk-list-detail"
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -60, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex flex-col items-center md:items-end justify-center gap-1.5 md:gap-2 mt-2 md:mt-0 max-w-full"
        >
          <div className="text-[10px] md:text-xs font-black text-[#9e2a2b] dark:text-[#d9534f] bg-white dark:bg-[#242220] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] px-2.5 py-0.5 rounded-sm shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] transform md:rotate-2 uppercase tracking-widest shrink-0 select-none">
            {infoConfig.banner.labels.talk}
          </div>
          <SecondaryHeading className="text-xs md:text-lg font-bold text-slate-700 dark:text-slate-200 font-mono h-8 md:h-11 flex items-center justify-center md:justify-end -rotate-1 max-w-[70vw] md:max-w-[450px]">
            <span className="bg-[#f4efe6] dark:bg-[#242220] text-[#1a1a1a] dark:text-[#e8e6e3] px-3 py-1 shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] inline-block font-sans whitespace-nowrap">
              {(infoConfig.banner.talkTicker as any)?.text || "写下想法，留下记录"}
            </span>
          </SecondaryHeading>
        </motion.div>
      );
    }

    return null;
  }, [categoryName, tagName, post, pathname, postsCount]);

  return (
    <motion.div
      layoutId="hero-banner"
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="bg-white dark:bg-[#1c1b1a] border-4 border-[#1a1a1a] dark:border-[#e8e6e3] p-3.5 sm:p-6 md:p-10 shadow-[6px_6px_0px_0px_#1a1a1a] sm:shadow-[8px_8px_0px_0px_#1a1a1a] dark:shadow-[6px_6px_0px_0px_#e8e6e3] sm:dark:shadow-[8px_8px_0px_0px_#e8e6e3] rounded-sm text-center relative overflow-hidden flex flex-col justify-center min-h-[110px] sm:min-h-[180px] md:min-h-[220px]"
    >
      {/* ==================== Editorial Masthead Background Artwork (托底底纹与版画印记) ==================== */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
        {/* 1. Newsprint Halftone Dot Matrix (报纸活字微细网点) */}
        <div 
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03] text-[#1a1a1a] dark:text-[#e8e6e3]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1.2px, transparent 1.2px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* 2. Classical Newspaper Double Hairline Inset & Corner Stars (老报纸双线内框与四角星芒) */}
        <div className="absolute inset-2 sm:inset-3.5 border border-[#1a1a1a]/15 dark:border-[#e8e6e3]/15 rounded-sm">
          <span className="absolute -top-1.5 -left-1.5 text-[10px] leading-none text-[#9e2a2b] dark:text-[#d9534f] opacity-70">✦</span>
          <span className="absolute -top-1.5 -right-1.5 text-[10px] leading-none text-[#9e2a2b] dark:text-[#d9534f] opacity-70">✦</span>
          <span className="absolute -bottom-1.5 -left-1.5 text-[10px] leading-none text-[#9e2a2b] dark:text-[#d9534f] opacity-70">✦</span>
          <span className="absolute -bottom-1.5 -right-1.5 text-[10px] leading-none text-[#9e2a2b] dark:text-[#d9534f] opacity-70">✦</span>
        </div>

        {/* 3. Center Giant Watermark Typography (中心通栏报刊巨幅水印) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif font-black tracking-[0.24em] text-[54px] sm:text-[90px] md:text-[124px] lg:text-[145px] uppercase text-[#1a1a1a]/[0.035] dark:text-[#e8e6e3]/[0.025] whitespace-nowrap transform -rotate-1 select-none">
            PAPER JOURNAL
          </span>
        </div>

        {/* 4. Woodcut Waves & Celestial Compass Lines (深海浪革 / 万象天体与海浪版画线稿) */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-[0.07] dark:opacity-[0.045] text-[#1a1a1a] dark:text-[#e8e6e3]" 
          preserveAspectRatio="none" 
          viewBox="0 0 1200 240" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ocean Wave Contours (深海波浪木刻线) */}
          <path d="M-50 180 C 150 140, 350 210, 600 160 C 850 110, 1050 190, 1250 150" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M-50 200 C 200 160, 400 230, 650 180 C 900 130, 1100 210, 1250 175" stroke="currentColor" strokeWidth="1.2" />
          <path d="M-50 220 C 180 185, 380 245, 620 205 C 860 165, 1080 230, 1250 195" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
          
          {/* Top Arch & Column Dividing Rules (栏目分割经纬线) */}
          <path d="M 100 40 Q 600 -10 1100 40" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
          <line x1="320" y1="0" x2="320" y2="240" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 6" />
          <line x1="600" y1="0" x2="600" y2="240" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 6" />
          <line x1="880" y1="0" x2="880" y2="240" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 6" />

          {/* Center Astrolabe / Celestial Ring (万象星盘同心环) */}
          <circle cx="600" cy="120" r="85" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" />
          <circle cx="600" cy="120" r="60" stroke="currentColor" strokeWidth="0.75" />
          <circle cx="600" cy="120" r="35" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>

        {/* 5. Antique Vermilion Round Seal Watermark (朱红藏书印 / 出版鉴印防伪水印) */}
        <div className="absolute right-[22%] md:right-[26%] top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.065] dark:opacity-[0.08] transform -rotate-12 select-none">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-3 border-double border-[#9e2a2b] dark:border-[#d9534f] p-1 flex items-center justify-center text-[#9e2a2b] dark:text-[#d9534f]">
            <div className="w-full h-full rounded-full border border-dashed border-[#9e2a2b] dark:border-[#d9534f] flex flex-col items-center justify-center text-center p-2">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest font-black uppercase">EST. 2026</span>
              <span className="font-serif font-black text-xs sm:text-sm tracking-wider my-0.5">萬象拾遺</span>
              <span className="text-[7px] sm:text-[8px] font-mono tracking-widest font-bold">VERIFIED PRESS</span>
            </div>
          </div>
        </div>
      </div>

      <div 
        className={`relative z-10 flex w-full h-full gap-3 sm:gap-6 md:gap-8 mx-auto max-w-6xl px-3 sm:px-6 md:px-8 transition-all duration-550 ${
          hasRightContent 
            ? "flex-col md:flex-row items-center justify-center md:justify-between" 
            : "flex-col items-center justify-center text-center"
        }`}
      >
        {/* Left Hand: Site Identity (Persistent / Morphing) */}
        <motion.div 
          layout="position"
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className={`flex flex-col items-center shrink-0 ${
            hasRightContent ? "md:items-start text-center md:text-left" : "text-center"
          }`}
        >
          <a href="/" className="hover:opacity-90 active:scale-98 transition-all inline-block">
            <div className={`flex flex-col ${hasRightContent ? "items-center md:items-start" : "items-center"}`}>
              <span className="text-[10px] sm:text-xs font-mono font-black tracking-[0.28em] text-[#9e2a2b] dark:text-[#d9534f] uppercase mb-0.5 sm:mb-1 block select-none">
                {infoConfig.banner.enTitle || "PAPER JOURNAL"}
              </span>
              {isHome ? (
                <h1 className={`${hasRightContent ? "text-xl sm:text-3xl md:text-4xl lg:text-5xl" : "text-2xl sm:text-4xl md:text-5xl lg:text-6xl"} font-black text-[#1a1a1a] dark:text-[#e8e6e3] mb-1.5 sm:mb-3 md:mb-5 tracking-widest transform -rotate-1 inline-block font-sans`}>
                  {infoConfig.banner.title}
                </h1>
              ) : (
                <p className={`${hasRightContent ? "text-xl sm:text-3xl md:text-4xl lg:text-5xl" : "text-2xl sm:text-4xl md:text-5xl lg:text-6xl"} font-black text-[#1a1a1a] dark:text-[#e8e6e3] mb-1.5 sm:mb-3 md:mb-5 tracking-widest transform -rotate-1 inline-block font-sans`}>
                  {infoConfig.banner.title}
                </p>
              )}
            </div>
          </a>
          <div 
            className={`text-xs md:text-sm lg:text-base font-bold text-slate-600 dark:text-slate-300 font-mono h-6 sm:h-8 flex items-center justify-center -rotate-1 ${
              hasRightContent ? "md:justify-start" : ""
            }`}
          >
            <span className="bg-[#f4efe6] dark:bg-[#242220] text-[#1a1a1a] dark:text-[#e8e6e3] px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] inline-block font-sans whitespace-nowrap select-none">
              {(infoConfig.subtitle as any)?.text || "写下想法，留下记录"}
            </span>
          </div>
        </motion.div>

        {/* Right Hand: Context Specific Cards (Transitioning smoothly) */}
        {hasRightContent && (
          <div className="flex items-center justify-center md:justify-end shrink-0 min-w-0 max-w-full">
            <AnimatePresence mode="popLayout">
              {rightSideContent}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
