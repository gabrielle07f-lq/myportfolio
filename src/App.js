import React, { useState, useEffect, useRef } from 'react';

// --- CSS Animations & Custom Styles ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Noto+Sans+SC:wght@400;700;900&family=Ma+Shan+Zheng&display=swap');

  :root {
    --bg-parchment: #F4F0E6;
    --text-ink: #1A1A1A;
    --neon-pink: #FF1493;
    --neon-yellow: #FFFF00;
    --neon-blue: #00FFFF;
  }

  body {
    background-color: var(--bg-parchment);
    color: var(--text-ink);
    font-family: 'Noto Sans SC', sans-serif;
    overflow: hidden; 
    background-image: radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px);
    background-size: 8px 8px;
  }

  .font-typewriter { font-family: 'Courier Prime', monospace; }
  .font-handwriting { font-family: 'Ma Shan Zheng', cursive; letter-spacing: 1px; }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  .animate-blink { animation: blink 1s step-end infinite; }

  .torn-paper {
    border-radius: 2px 255px 3px 25px / 255px 5px 225px 3px;
    box-shadow: 3px 4px 15px rgba(0,0,0,0.1), -1px -1px 2px rgba(255,255,255,0.5) inset;
    border: 1px solid rgba(0,0,0,0.8);
    position: relative;
    background-color: #FFFAF0;
    background-image: radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px);
    background-size: 6px 6px;
  }

  .torn-paper-alt { border-radius: 255px 5px 225px 3px / 2px 255px 3px 25px; }

  /* 修复：使用 CSS 代替 Tailwind content-[''] 避免编译错误 */
  .bullet-dot::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.5rem;
    width: 0.75rem;
    height: 0.75rem;
    background-color: var(--text-ink);
    border-radius: 9999px;
  }

  .neon-highlight { position: relative; display: inline-block; z-index: 1; }
  .neon-highlight::before {
    content: ''; position: absolute; bottom: 2px; left: -4px; right: -4px; height: 60%;
    z-index: -1; transform: rotate(-1deg); background-color: currentColor; mix-blend-mode: multiply;
  }
  .neon-pink::before { background-color: rgba(255, 20, 147, 0.6); }
  .neon-yellow::before { background-color: rgba(255, 255, 0, 0.6); }
  .neon-blue::before { background-color: rgba(0, 255, 255, 0.6); }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.3); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.5); }

  .nav-label { max-width: 0; opacity: 0; overflow: hidden; white-space: nowrap; transition: max-width 0.2s ease-out, opacity 0.2s ease-out; }
  .sidebar-expanded .nav-label { max-width: 180px; opacity: 1; transition: max-width 0.5s steps(12, end) 0.1s, opacity 0.3s ease-in 0.1s; }

  .spring-transition { transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }

  .cursor-prev { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10' fill='rgba(0,0,0,0.4)' stroke='none'/%3E%3Cpath d='M14 16l-4-4 4-4'/%3E%3C/svg%3E") 28 28, w-resize; }
  .cursor-next { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10' fill='rgba(0,0,0,0.4)' stroke='none'/%3E%3Cpath d='M10 16l4-4-4-4'/%3E%3C/svg%3E") 28 28, e-resize; }
  
  .cursor-inspect { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8' fill='white'/%3E%3Cpath d='M21 21l-4.3-4.3'/%3E%3C/svg%3E") 16 16, pointer; }

  .dymo-label {
    background-color: #1a1a1a; color: #f4f4f4; font-family: 'Courier Prime', monospace;
    text-transform: uppercase; font-weight: bold; letter-spacing: 0.1em;
    padding: 4px 10px; box-shadow: 2px 2px 0px rgba(0,0,0,0.5), inset 1px 1px 2px rgba(255,255,255,0.2);
    border: 1px solid #000; border-radius: 2px;
  }

  .grid-paper {
    background-image: linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px);
    background-size: 25px 25px;
    background-color: #fcfbf7;
  }
  .kraft-paper {
    background-color: #e5d8c1;
    background-image: radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px);
    background-position: 0 0, 3px 3px;
    background-size: 6px 6px;
  }
  
  .page-flip-enter-right {
    animation: flipRight 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    transform-origin: left center;
  }
  .page-flip-enter-left {
    animation: flipLeft 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    transform-origin: right center;
  }
  @keyframes flipRight {
    from { transform: perspective(2000px) rotateY(90deg); opacity: 0; filter: brightness(0.8) drop-shadow(10px 0 10px rgba(0,0,0,0.2)); }
    to { transform: perspective(2000px) rotateY(0deg); opacity: 1; filter: brightness(1) drop-shadow(0 0 0 rgba(0,0,0,0)); }
  }
  @keyframes flipLeft {
    from { transform: perspective(2000px) rotateY(-90deg); opacity: 0; filter: brightness(0.8) drop-shadow(-10px 0 10px rgba(0,0,0,0.2)); }
    to { transform: perspective(2000px) rotateY(0deg); opacity: 1; filter: brightness(1) drop-shadow(0 0 0 rgba(0,0,0,0)); }
  }

  .draw-path {
    stroke-dasharray: 600;
    stroke-dashoffset: 600;
    animation: drawPath 0.6s ease-out 0.4s forwards;
  }
  @keyframes drawPath { to { stroke-dashoffset: 0; } }

  .stamp-opened {
    animation: stampStrike 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  @keyframes stampStrike {
    0% { transform: scale(3) rotate(-30deg); opacity: 0; }
    50% { transform: scale(0.9) rotate(-15deg); opacity: 1; }
    100% { transform: scale(1) rotate(-15deg); opacity: 0; }
  }

  .animate-bounce-in-left {
    animation: bounceInLeft 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) calc(var(--delay, 0s)) forwards;
    opacity: 0;
  }
  @keyframes bounceInLeft {
    0% { opacity: 0; transform: translateX(-40px); }
    60% { opacity: 1; transform: translateX(10px); }
    100% { opacity: 1; transform: translateX(0); }
  }

  .animate-slide-up-hand {
    animation: slideUpHand 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) calc(var(--delay, 0.4s)) forwards;
    opacity: 0;
    transform-origin: bottom right;
    transform: translateY(60px) rotate(10deg);
  }
  @keyframes slideUpHand {
    0% { opacity: 0; transform: translateY(60px) rotate(10deg); }
    100% { opacity: 1; transform: translateY(0) rotate(0deg); }
  }
`;

// --- UI Components ---

const WashiTape = ({ color = 'yellow', angle = '-2deg', width = 'w-32', top = '-top-4', left = 'left-1/2', extraClasses = '' }) => {
  const colorMap = { yellow: 'bg-yellow-200/90', white: 'bg-slate-100/90', pink: 'bg-pink-300/90', blue: 'bg-blue-300/90' };
  return (
    <div
      className={`absolute ${top} ${left} h-8 ${width} ${colorMap[color]} shadow-sm z-10 border-l-2 border-r-2 border-dashed border-black/20 ${extraClasses}`}
      style={{ transform: `rotate(${angle}) translateX(-50%)` }}
    />
  );
};

const DadaScribble = ({ type, className }) => {
  if (type === 'wave') return <svg className={`absolute pointer-events-none ${className}`} viewBox="0 0 100 20" fill="none" stroke="var(--neon-blue)" strokeWidth="3" strokeLinecap="round"><path d="M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10" /></svg>;
  if (type === 'star') return <svg className={`absolute pointer-events-none ${className}`} viewBox="0 0 50 50" fill="var(--text-ink)"><polygon points="25,0 32,15 50,18 36,30 40,48 25,38 10,48 14,30 0,18 18,15" /></svg>;
  return null;
};

const AnimatedHighlight = ({ children, color = 'var(--neon-pink)', type = 'underline' }) => (
  <span className="relative inline-block font-bold">
    {children}
    {type === 'underline' && (
      <svg className="absolute -bottom-1 left-0 w-full h-3 z-0 pointer-events-none overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 10">
        <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" className="draw-path" />
      </svg>
    )}
    {type === 'circle' && (
      <svg className="absolute -inset-2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] z-0 pointer-events-none overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
        <path d="M10,20 Q10,5 50,5 T90,20 T50,35 T5,20" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" className="draw-path" />
      </svg>
    )}
  </span>
);

const NotebookPolaroid = ({ src, alt, angle, onClick, className = '', imgClassName = '' }) => (
  <div
    className={`relative group/ui cursor-zoom-in transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02] bg-white shadow-[0_5px_15px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] border border-gray-200 ${angle} ${className}`}
    onClick={onClick}
  >
    <img src={src} alt={alt} className={`w-full h-auto object-contain block relative z-10 ${imgClassName}`} draggable="false" />
    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/ui:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-30">
      {/* 修改：放大镜样式升级为黑底半透明质感 */}
      <div className="w-12 h-12 bg-black/70 text-white rounded-full flex items-center justify-center shadow-xl text-xl transform scale-50 group-hover/ui:scale-100 transition-transform duration-200 delay-75 border border-white/20 backdrop-blur-sm">🔍</div>
    </div>
  </div>
);

// --- Page Modules ---

const AboutMe = () => {
  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden p-4 md:p-16 relative scroll-smooth">
      {/* 目录箭头和文字 */}
      <div className="absolute top-24 -left-4 md:top-36 md:-left-2 z-50 flex flex-col items-center animate-bounce-in-left pointer-events-none" style={{ '--delay': '0.3s' }}>
        <div className="font-typewriter font-black text-xl md:text-2xl rotate-[-10deg] text-pink-500 tracking-widest pl-4 drop-shadow-md z-10" style={{ textShadow: '0 0 10px #FF1493, 0 0 20px #FF1493, 0 0 30px #FF1493' }}>目录在这里</div>
        <img src={process.env.PUBLIC_URL + '/arrow.png'} alt="arrow" className="w-48 md:w-64 rotate-[-5deg] drop-shadow-md -mt-6 md:-mt-8" />
      </div>

      <div className="min-h-full flex flex-col justify-center relative z-10">
        <div className="torn-paper p-8 md:p-12 max-w-4xl mx-auto w-full relative">
          <WashiTape color="white" angle="-4deg" top="-top-5" left="left-1/3" width="w-40" />
          <WashiTape color="yellow" angle="3deg" top="-top-3" left="left-2/3" width="w-24" />

          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="relative w-64 h-80 flex-shrink-0 -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="absolute inset-0 bg-white shadow-lg p-4 pb-12 border border-gray-300">
                <div className="w-full h-full bg-gray-200 overflow-hidden relative">
                  <img src="https://i.postimg.cc/Y2Zw1p13/c50ff7319717b16afecc57a2ff01e1d5.jpg" alt="Fang Linqi" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-pink-500/10 mix-blend-overlay"></div>
                </div>
                <span className="font-typewriter absolute bottom-3 left-1/2 -translate-x-1/2 text-sm text-gray-600 font-bold tracking-widest">ME.jpg</span>
              </div>
              <WashiTape color="pink" angle="-15deg" top="-top-2" left="left-4" width="w-16" />
              <WashiTape color="yellow" angle="25deg" top="top-auto bottom-8" left="left-auto -right-6" width="w-20" />
              <DadaScribble type="star" className="-top-10 -right-10 w-16 h-16 opacity-80" />
            </div>

            <div className="flex-1 space-y-8">
              <div>
                <h1 className="font-typewriter text-5xl md:text-7xl font-bold tracking-tighter leading-none">
                  方琳淇 <br /><span className="pl-8">Sylvie</span>
                </h1>
                <div className="flex gap-4 mt-6 font-typewriter text-sm font-bold border-t-2 border-b-2 border-black py-2 w-max">
                  <span className="bg-black text-white px-2">处女座</span>
                  <span>INTJ</span>
                  <span className="text-gray-400">|</span>
                  <span>fanglinqi07@163.com</span>
                  <span className="text-gray-400">|</span>
                  <span>+86 15270280507</span>
                </div>
              </div>

              <div className="space-y-6 mt-8">
                {/* 修复：使用 bullet-dot 自定义类替代 content-[''] 避免解析错误 */}
                <div className="relative pl-6 bullet-dot">
                  <h3 className="text-xl font-bold mb-1"><span className="neon-highlight neon-yellow">深度业务洞察</span></h3>
                  <p className="text-sm font-typewriter text-gray-700 leading-relaxed">聚焦本质，善于在庞杂的数据和用户反馈中敏锐发现核心问题，并提出突破性的解决思路与产品定义。</p>
                </div>
                <div className="relative pl-6 bullet-dot">
                  <h3 className="text-xl font-bold mb-1"><span className="neon-highlight neon-blue">全链路运营策略</span></h3>
                  <p className="text-sm font-typewriter text-gray-700 leading-relaxed">拒绝纸上谈兵。展现从 0-1 的策划构建到落地执行、复盘优化的完整商业链路把控能力。</p>
                </div>
                <div className="relative pl-6 bullet-dot">
                  <h3 className="text-xl font-bold mb-1"><span className="neon-highlight neon-pink">AIGC 创新实践</span></h3>
                  <p className="text-sm font-typewriter text-gray-700 leading-relaxed">拥抱技术变量。结合对前沿生成式 AI 工具的深度探索，在内容创作与工作流效率上实现双重赋能。</p>
                </div>
              </div>
            </div>
          </div>

          {/* 手绘插画 */}
          <img src={process.env.PUBLIC_URL + '/hand.png'} alt="hand drawing" className="absolute -bottom-32 -right-32 md:-bottom-48 md:-right-64 w-96 md:w-[512px] z-[60] animate-slide-up-hand pointer-events-none drop-shadow-2xl" style={{ '--delay': '0.6s' }} />
        </div>
      </div>
    </div>
  );
};

const Internship = () => {
  const [zoomedImg, setZoomedImg] = useState(null);
  const [gallery, setGallery] = useState({ isOpen: false, collectionId: null, currentIndex: 0 });

  const collections = {
    A: { images: ['https://i.postimg.cc/d1fNfZ90/image.png', 'https://i.postimg.cc/HnJRW9Lc/image.png', 'https://i.postimg.cc/FHbqKR9v/image.png'], caption: '复刻敦煌酒俗，将品牌价值转化为沉浸式交互体验。' },
    B: { images: ['https://i.postimg.cc/R0vhXPFy/image.png', 'https://i.postimg.cc/Ghvrkbcj/image.png', 'https://i.postimg.cc/HnXG4t1R/image.png'], caption: '从预热到爆发，打通多媒介触点实现圈层精准触达。' }
  };

  const openGallery = (id) => setGallery({ isOpen: true, collectionId: id, currentIndex: 0 });
  const closeGallery = () => setGallery({ ...gallery, isOpen: false });
  const nextImage = (e) => { e.stopPropagation(); setGallery(prev => ({ ...prev, currentIndex: (prev.currentIndex + 1) % collections[prev.collectionId].images.length })); };
  const prevImage = (e) => { e.stopPropagation(); setGallery(prev => ({ ...prev, currentIndex: (prev.currentIndex - 1 + collections[prev.collectionId].images.length) % collections[prev.collectionId].images.length })); };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden p-4 md:p-16 relative scroll-smooth">
      <div className="space-y-24 pb-24">
        {zoomedImg && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-sm transition-opacity" onClick={() => setZoomedImg(null)}>
            <div className="relative max-w-[95vw] max-h-[95vh] bg-white p-2 md:p-4 shadow-2xl border border-gray-300" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setZoomedImg(null)} className="absolute top-1 right-2 md:top-2 md:right-4 text-black text-4xl font-light hover:text-pink-500 z-[60] transition-colors leading-none cursor-pointer">&times;</button>
              <img src={zoomedImg} alt="Enlarged view" className="max-w-full max-h-[85vh] object-contain relative z-10" />
            </div>
          </div>
        )}
        {gallery.isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md transition-opacity" onClick={closeGallery}>
            <div className="absolute inset-0 bg-[#111]/95 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:6px_6px]" />
            <div className="relative z-10 w-full max-w-6xl flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <div className="relative bg-white p-2 md:p-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] transform transition-transform border border-gray-300">
                <button onClick={closeGallery} className="absolute top-1 right-2 md:top-2 md:right-4 text-black text-4xl font-light hover:text-pink-500 z-[60] transition-colors leading-none cursor-pointer">&times;</button>
                <img src={collections[gallery.collectionId].images[gallery.currentIndex]} className="max-w-full max-h-[70vh] object-contain relative z-10" alt="Gallery" draggable="false" />
                <div className="absolute inset-y-0 left-0 w-1/2 cursor-prev z-20" onClick={prevImage}></div>
                <div className="absolute inset-y-0 right-0 w-1/2 cursor-next z-20" onClick={nextImage}></div>
              </div>
              <div className="mt-8 text-center max-w-3xl">
                <p className="font-typewriter text-white text-sm md:text-base tracking-widest bg-black/60 px-6 py-4 border-l-4 border-pink-500 shadow-xl inline-block">
                  {collections[gallery.collectionId].caption}
                  <span className="text-gray-400 ml-6 font-bold bg-white/10 px-2 py-1">[ {gallery.currentIndex + 1} / {collections[gallery.collectionId].images.length} ]</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SF Express */}
        <div className="flex flex-col justify-center mt-12 relative">
          <div className="torn-paper torn-paper-alt p-8 max-w-5xl mx-auto w-full relative">
            {/* Eyes graphic */}
            <img src={process.env.PUBLIC_URL + '/eyes.png'} alt="eyes graphic" className="absolute -top-4 -right-8 md:-top-16 md:-right-20 w-48 md:w-80 z-50 pointer-events-none drop-shadow-xl rotate-[10deg]" />
            <WashiTape color="pink" angle="-2deg" left="left-1/4" />
            <div className="flex justify-between items-start mb-8 border-b-4 border-black pb-4">
              <div>
                <h2 className="text-4xl font-black tracking-tight">顺丰控股 <span className="font-typewriter text-2xl font-normal">SF EXPRESS</span></h2>
                <p className="font-typewriter mt-2 text-lg"><span className="neon-highlight neon-yellow">用户与内容运营</span></p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-8 flex flex-col justify-between h-full">
                <div>
                  <div className="relative pl-6 bullet-dot mb-8">
                    <h3 className="text-xl font-bold mb-2"><span className="neon-highlight neon-pink">爆款内容打造：</span></h3>
                    <p className="text-gray-800 leading-relaxed text-justify font-sans mt-2">负责外域短视频矩阵「顺丰小哥说」的日常运营。基于对用户情绪的精准洞察，成功打造单支最高播放量破 1000w 的出圈视频。</p>
                  </div>
                  <div className="relative pl-6 bullet-dot">
                    <h3 className="text-xl font-bold mb-2"><span className="neon-highlight neon-blue">账号生态沉淀：</span></h3>
                    <p className="text-gray-800 leading-relaxed text-justify font-sans mt-2">全链路统筹内容生产落地与供应商排期，助力账号累计收获 34.1w+ 高粘性粉丝，有效提升品牌 C 端感知。</p>
                  </div>
                </div>

                {/* Account Details Image placed below the text */}
                <div className="mt-12 pl-6">
                  <a href="https://www.douyin.com/user/MS4wLjABAAAAnU6ohc4TrSxl6OGz9EKKY8QbWZ-6n-uZS-oVVCTyIbJ7CHQbaR6mLHG9ub9u-Zws?from_tab_name=main" target="_blank" rel="noopener noreferrer" className="block relative group cursor-pointer inline-block">
                    <img src="https://i.postimg.cc/s2WCW0MP/image.png" alt="Douyin Account Details" className="w-[280px] md:w-[320px] h-auto object-contain border border-gray-200 shadow-sm transition-transform duration-300 group-hover:-translate-y-1" />
                    <p className="font-typewriter text-xs text-center text-gray-500 mt-2 font-bold tracking-widest group-hover:text-pink-500 transition-colors">
                      [点击跳转查看账号更多内容]
                    </p>
                  </a>
                </div>
              </div>

              {/* 修复：通过限制最大宽度并居中，等比例缩小竖版图片高度 */}
              <div className="relative mt-8 md:mt-0 flex justify-center self-start md:self-center">
                <div className="relative w-3/4 md:w-2/3 max-w-[260px]">
                  <WashiTape color="white" angle="45deg" top="-top-4" left="-left-4" width="w-16" extraClasses="z-20" />
                  <div className="bg-white p-3 border-2 border-black rotate-0 hover:-rotate-2 transition-all duration-300 flex flex-col gap-3 w-full shadow-lg">
                    <img src="https://i.postimg.cc/hG1ddy66/c6444b55971bc224b9a9f7bd15ffcc67.jpg" alt="1000w views video" className="w-full h-auto object-contain border border-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Baiyun Airport */}
        <div className="flex flex-col justify-center">
          <div className="torn-paper p-8 max-w-5xl mx-auto w-full bg-[#fdfbf7] relative">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center font-typewriter text-xl font-bold border-[4px] border-dashed border-white shadow-[0_0_0_2px_black] flex-shrink-0">CAN</div>
              <div>
                <h2 className="text-4xl font-black">广州白云机场</h2>
                <p className="font-typewriter mt-1"><span className="bg-black text-white px-2 py-1">市场推广实习生</span></p>
              </div>
            </div>
            <div className="relative w-full md:w-[90%] mx-auto my-8 group/doc cursor-zoom-in" onClick={() => setZoomedImg('https://i.postimg.cc/44BxYfxH/image.png')}>
              <WashiTape color="white" width="w-16" angle="-35deg" top="-top-4" left="left-4 md:left-8" />
              <WashiTape color="yellow" width="w-16" angle="40deg" top="-top-4" left="left-[85%] md:left-[90%]" />
              <WashiTape color="white" width="w-16" angle="35deg" top="top-auto -bottom-4" left="left-4 md:left-8" />
              <WashiTape color="white" width="w-16" angle="-45deg" top="top-auto -bottom-4" left="left-[85%] md:left-[90%]" />
              <div className="bg-white p-1 md:p-2 shadow-[0_15px_30px_rgba(0,0,0,0.12)] border border-gray-300 transform transition-transform duration-300 group-hover/doc:-translate-y-1">
                <img src="https://i.postimg.cc/44BxYfxH/image.png" alt="2025 Marketing Plan" className="w-full h-auto object-contain" />
              </div>
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/doc:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 pointer-events-none">
                <div className="w-16 h-16 bg-black/70 text-white rounded-full flex items-center justify-center shadow-xl text-2xl transform scale-50 group-hover/doc:scale-100 transition-transform duration-300 delay-75 border border-white/20 backdrop-blur-sm">🔍</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-12">
              <div className="space-y-4">
                <h3 className="text-xl font-bold border-l-4 border-black pl-3"><span className="neon-highlight neon-blue">| 营销策略复盘与规划</span></h3>
                <p className="text-gray-800 leading-relaxed font-sans mt-4 text-justify">独立撰写《2025年营销工作优化方案》，为全年市场推广提供宏观方向指引。深度参与春运等核心节点，协助完成产品包装和落地排期的工作，高效协调多方资源，确保各项权益准确配置与交付上线。</p>
              </div>
              <div className="bg-gray-100 p-6 border border-gray-300 font-typewriter text-sm relative mt-2 md:mt-0">
                <DadaScribble type="wave" className="-top-3 -right-5 w-24 h-10" />
                <p className="font-bold mb-4 text-base">{'>>'} STRATEGY HIGHLIGHTS:</p>
                <div className="space-y-4">
                  <p><span className="font-bold bg-yellow-200 px-1 py-0.5 mr-1 box-decoration-clone">年度策略推演：</span>梳理200+篇历史物料，输出上方《2025年营销计划表》，构建宏观策略支撑。</p>
                  <p><span className="font-bold bg-pink-200 px-1 py-0.5 mr-1 box-decoration-clone">精细化客群触达：</span>独立策划“青春白云”全年四阶段活动，首发单品斩获全网 30w+ 浏览量。</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GMPC */}
        <div className="flex flex-col justify-center relative mt-16 md:mt-24">
          {/* BLAH graphic */}
          <img src={process.env.PUBLIC_URL + '/blah.png'} alt="blah graphic" className="absolute -top-24 left-4 md:-top-40 md:left-8 w-28 md:w-[180px] z-50 pointer-events-none drop-shadow-lg" />
          <div className="torn-paper torn-paper-alt p-8 md:p-12 max-w-5xl mx-auto w-full relative">
            <WashiTape color="pink" angle="-1deg" left="left-3/4" />
            <h2 className="text-4xl font-black text-center mb-2 uppercase tracking-widest">广东省广告集团</h2>
            <p className="text-center font-typewriter mb-16"><span className="neon-highlight neon-yellow">品牌策略实习生</span></p>
            <div className="flex flex-col md:flex-row gap-16 md:gap-8 justify-center">
              <div className="flex-1 max-w-sm mx-auto w-full relative group cursor-pointer" onClick={() => openGallery('A')}>
                <div className="relative w-full mt-4">
                  <div className="absolute top-0 left-0 w-full h-full bg-white p-2 border border-gray-300 shadow-sm transform -rotate-6 group-hover:-rotate-12 group-hover:-translate-x-10 group-hover:-translate-y-2 spring-transition origin-bottom-left">
                    <img src="https://i.postimg.cc/HnJRW9Lc/image.png" className="w-full h-full object-contain grayscale-[40%]" alt="Stack A Img 1" />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full bg-white p-2 border border-gray-300 shadow-sm transform rotate-3 group-hover:rotate-12 group-hover:translate-x-10 group-hover:-translate-y-1 spring-transition origin-bottom-right">
                    <img src="https://i.postimg.cc/FHbqKR9v/image.png" className="w-full h-full object-contain grayscale-[40%]" alt="Stack A Img 2" />
                  </div>
                  <div className="relative bg-white p-2 border border-gray-400 shadow-[0_4px_10px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] transform group-hover:scale-105 spring-transition z-10 flex flex-col">
                    <img src="https://i.postimg.cc/d1fNfZ90/image.png" className="w-full h-auto object-contain" alt="Stack A Cover" />
                    <p className="font-typewriter text-xs p-2 text-center text-gray-500 font-bold tracking-wider mt-auto">Collection 1: 沉浸式文化溯源</p>
                  </div>
                </div>
                <div className="absolute -bottom-10 md:-bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 font-typewriter text-xs font-bold text-pink-500 bg-pink-100 px-3 py-1 rounded-full pointer-events-none z-20 group-hover:translate-y-2 shadow-sm whitespace-nowrap">CLICK TO EXPLORE</div>
              </div>
              <div className="flex-1 max-w-sm mx-auto w-full relative group cursor-pointer mt-12 md:mt-0" onClick={() => openGallery('B')}>
                <div className="relative w-full mt-4">
                  <div className="absolute top-0 left-0 w-full h-full bg-white p-2 border border-gray-300 shadow-sm transform rotate-6 group-hover:rotate-12 group-hover:translate-x-10 group-hover:-translate-y-2 spring-transition origin-bottom-right">
                    <img src="https://i.postimg.cc/Ghvrkbcj/image.png" className="w-full h-full object-contain grayscale-[40%]" alt="Stack B Img 1" />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full bg-white p-2 border border-gray-300 shadow-sm transform -rotate-4 group-hover:-rotate-12 group-hover:-translate-x-10 group-hover:-translate-y-1 spring-transition origin-bottom-left">
                    <img src="https://i.postimg.cc/HnXG4t1R/image.png" className="w-full h-full object-contain grayscale-[40%]" alt="Stack B Img 2" />
                  </div>
                  <div className="relative bg-white p-2 border border-gray-400 shadow-[0_4px_10px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] transform group-hover:scale-105 spring-transition z-10 flex flex-col">
                    <img src="https://i.postimg.cc/R0vhXPFy/image.png" className="w-full h-auto object-contain" alt="Stack B Cover" />
                    <p className="font-typewriter text-xs p-2 text-center text-gray-500 font-bold tracking-wider mt-auto">Collection 2: 全域整合传播</p>
                  </div>
                </div>
                <div className="absolute -bottom-10 md:-bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 font-typewriter text-xs font-bold text-blue-500 bg-blue-100 px-3 py-1 rounded-full pointer-events-none z-20 group-hover:translate-y-2 shadow-sm whitespace-nowrap">CLICK TO EXPLORE</div>
              </div>
            </div>
            <div className="mt-20 md:mt-24 bg-black text-white p-6 md:p-8 font-typewriter relative shadow-xl">
              <DadaScribble type="star" className="-top-6 -left-6 w-12 h-12 fill-yellow-400 opacity-100 z-20" />
              <p className="text-sm md:text-base leading-relaxed text-justify">敏锐洞察中高端白酒客群对「传统文化与交互体验」的深层需求，精准锁定市场空白。深度参与国宝贵轩敦煌文创酒全案营销，以“文旅+品鉴”为主线策划线下沉浸式大商行程；并统筹 H5 预热、无人机灯光秀及媒体矩阵发声，助力品牌实现线上线下联动与文化破圈。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoomedImg, setZoomedImg] = useState(null);
  const [gallery, setGallery] = useState({ isOpen: false, currentIndex: 0 });
  const [imcStamp, setImcStamp] = useState(null);

  const ceoImages = [
    'https://i.postimg.cc/59wMPGN2/image.png',
    'https://i.postimg.cc/rpdB5ZPT/image.png',
    'https://i.postimg.cc/HxXFhcHr/image.png',
    'https://i.postimg.cc/q7nmkPF6/image.png',
    'https://i.postimg.cc/brKDNBWR/image.png',
    'https://i.postimg.cc/dtPGF7Ft/image.png',
    'https://i.postimg.cc/kGZ8R46q/image.png'
  ];

  const openCeoGallery = (index) => setGallery({ isOpen: true, currentIndex: index });
  const closeGallery = () => setGallery({ ...gallery, isOpen: false });
  const nextImg = (e) => { e.stopPropagation(); setGallery(prev => ({ ...prev, currentIndex: (prev.currentIndex + 1) % ceoImages.length })); };
  const prevImg = (e) => { e.stopPropagation(); setGallery(prev => ({ ...prev, currentIndex: (prev.currentIndex - 1 + ceoImages.length) % ceoImages.length })); };

  const handleImcClick = (e) => {
    e.preventDefault();
    setImcStamp({ x: e.clientX, y: e.clientY });
    // 修正：更新为正确的 Canva 跳转链接
    setTimeout(() => {
      window.open('https://www.canva.com/design/DAGRG2vjPhE/x8p3de0aQaerxBa7VG1Xlg/view?utm_content=DAGRG2vjPhE&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hedf6726c7e#1', '_blank');
      setImcStamp(null);
    }, 400);
  };

  const pages = [
    {
      left: (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 opacity-60">
          <div className="w-32 h-32 border-4 border-dashed border-gray-400 rounded-full flex items-center justify-center font-handwriting text-3xl text-gray-500 rotate-[-15deg]">
            Keep <br /> Secret
          </div>
        </div>
      ),
      right: (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 relative text-center">
          <WashiTape color="white" angle="5deg" top="-top-4" left="left-1/2" width="w-32" />
          <h2 className="text-5xl md:text-6xl font-black mb-4 uppercase tracking-tighter" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>CEO PRO</h2>
          <div className="dymo-label text-xs md:text-sm mb-10 rotate-2">AI 驱动的求职辅导 SaaS 平台</div>

          <div className="w-40 h-40 md:w-48 md:h-48 bg-white p-2 border border-gray-300 shadow-lg transform -rotate-3 mb-8 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-contain grayscale contrast-150 mix-blend-multiply" alt="Gears collage" />
            <div className="absolute inset-0 bg-yellow-400/20 mix-blend-overlay"></div>
          </div>
          <p className="absolute bottom-6 right-6 font-handwriting text-xl md:text-2xl text-blue-800 -rotate-6">By FLQ, 2026.</p>
        </div>
      )
    },
    {
      left: (
        <div className="w-full h-full relative p-6 md:p-8 flex flex-col justify-evenly items-center gap-6">
          <NotebookPolaroid src={ceoImages[0]} alt="Welcome Flow" angle="rotate-0" className="w-[95%]" imgClassName="max-h-[240px]" onClick={() => openCeoGallery(0)} />
          <NotebookPolaroid src={ceoImages[1]} alt="User Dashboard" angle="rotate-0" className="w-[95%] z-10" imgClassName="max-h-[240px]" onClick={() => openCeoGallery(1)} />
        </div>
      ),
      right: (
        <div className="w-full h-full flex flex-col justify-center p-6 md:p-10 font-handwriting text-lg md:text-2xl text-gray-800 leading-relaxed md:leading-loose tracking-wide">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-black"><AnimatedHighlight type="underline" color="var(--neon-yellow)">模块一：双线启动与数据库</AnimatedHighlight></h3>
          <p className="mb-6">
            <span className="font-bold text-xl md:text-3xl">低门槛引入：</span><br />
            规划“旧简历解析”与“对话驱动”双线路径，降低新用户上手门槛，有效缓解与 AI 交互时的 <AnimatedHighlight type="circle" color="red">认知过载</AnimatedHighlight>。
          </p>
          <p>
            <span className="font-bold text-xl md:text-3xl">100% 数据掌控感：</span><br />
            针对大模型“记忆错乱”痛点，设计 Block-based 底层架构 (Master Vault)，让零散经历沉淀为 <span className="text-blue-700 font-bold border-b-2 border-blue-500">结构化资产</span>。
          </p>
        </div>
      )
    },
    {
      left: (
        <div className="w-full h-full relative p-6 md:p-8 flex flex-col justify-evenly items-center gap-6">
          <NotebookPolaroid src={ceoImages[2]} alt="JD Match" angle="rotate-0" className="w-[95%]" imgClassName="max-h-[240px]" onClick={() => openCeoGallery(2)} />
          <NotebookPolaroid src={ceoImages[3]} alt="ATS Report" angle="rotate-0" className="w-[95%] z-10" imgClassName="max-h-[240px]" onClick={() => openCeoGallery(3)} />
        </div>
      ),
      right: (
        <div className="w-full h-full flex flex-col justify-center p-6 md:p-10 font-handwriting text-lg md:text-2xl text-gray-800 leading-relaxed md:leading-loose tracking-wide">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-black"><AnimatedHighlight type="underline" color="var(--neon-blue)">模块二：精准匹配与诊断</AnimatedHighlight></h3>
          <p className="mb-6">
            <span className="font-bold text-xl md:text-3xl">ATS 级多维诊断：</span><br />
            支持绑定目标公司与具体 JD，从“关键词命中率”、“结构化程度”与“数据支撑”等多维度生成 <AnimatedHighlight type="circle" color="red">可视化诊断</AnimatedHighlight> 报告。
          </p>
          <p>
            <span className="font-bold text-xl md:text-3xl">结构化优化策略：</span><br />
            敏锐识别简历中的“致命缺失项”与“亮点”，为下一步的深度润色提供明确的 <span className="text-blue-700 font-bold border-b-2 border-blue-500">策略指导</span>。
          </p>
        </div>
      )
    },
    {
      left: (
        <div className="w-full h-full relative p-6 md:p-8 flex flex-col justify-evenly items-center gap-4">
          <NotebookPolaroid src={ceoImages[4]} alt="Highlight UI" angle="rotate-0" className="w-[95%]" imgClassName="max-h-[160px] md:max-h-[180px]" onClick={() => openCeoGallery(4)} />

          <div className="relative w-[95%] z-10 flex justify-center">
            <NotebookPolaroid src={ceoImages[5]} alt="AI Q&A Dialogue" angle="rotate-0" className="w-full" imgClassName="max-h-[160px] md:max-h-[180px]" onClick={() => openCeoGallery(5)} />
          </div>

          <NotebookPolaroid src={ceoImages[6]} alt="Vault Skeleton" angle="rotate-0" className="w-[95%] z-10" imgClassName="max-h-[160px] md:max-h-[180px]" onClick={() => openCeoGallery(6)} />
        </div>
      ),
      right: (
        <div className="w-full h-full relative flex flex-col justify-center p-6 md:p-10 font-handwriting text-lg md:text-2xl text-gray-800 leading-relaxed md:leading-loose tracking-wide">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-black"><AnimatedHighlight type="underline" color="var(--neon-pink)">模块三：预演与业务闭环</AnimatedHighlight></h3>
          <p className="mb-6">
            <span className="font-bold text-xl md:text-3xl">场景化面试预演：</span><br />
            创新划线交互，针对单条经历发起“防过度包装检查”。AI 化身资深 HR 发起 <AnimatedHighlight type="circle" color="red">压力测试</AnimatedHighlight>。
          </p>
          <p>
            <span className="font-bold text-xl md:text-3xl">动态留存闭环：</span><br />
            将 AI 优化的专属回答，一键 <span className="text-blue-700 font-bold border-b-2 border-blue-500">反向覆盖</span> 至底层库，实现从“面试复盘”到“资产更新”的完整链路。
          </p>

          {/* 新增：线圈本末页右下角滑动提示 */}
          <div className="absolute bottom-8 right-6 md:bottom-12 md:right-10 text-pink-600 font-bold text-sm md:text-lg animate-pulse flex items-center gap-2 bg-white px-3 py-1 md:px-4 md:py-2 border-2 border-black border-dashed shadow-[4px_4px_0px_rgba(0,0,0,1)] rotate-[-2deg] hover:rotate-0 transition-transform cursor-default z-30">
            请继续下滑页面 <span className="animate-bounce inline-block font-black text-xl">↓</span>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => { if (currentPage < pages.length - 1) setCurrentPage(prev => prev + 1); };
  const handlePrev = () => { if (currentPage > 0) setCurrentPage(prev => prev - 1); };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden p-4 md:p-16 relative scroll-smooth">
      {zoomedImg && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-sm transition-opacity" onClick={() => setZoomedImg(null)}>
          <div className="relative max-w-[95vw] max-h-[95vh] bg-white p-2 md:p-4 shadow-2xl border border-gray-300" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setZoomedImg(null)} className="absolute top-1 right-2 md:top-2 md:right-4 text-black text-4xl font-light hover:text-pink-500 z-[60] transition-colors leading-none cursor-pointer">&times;</button>
            <img src={zoomedImg} alt="Enlarged view" className="max-w-full max-h-[85vh] object-contain relative z-10" />
          </div>
        </div>
      )}
      {gallery.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md transition-opacity" onClick={closeGallery}>
          <div className="absolute inset-0 bg-[#111]/95 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:6px_6px]" />
          <div className="relative z-10 w-full max-w-6xl flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="relative bg-[#1a1a1a] p-2 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-gray-800 rounded-lg">
              <button onClick={closeGallery} className="absolute -top-12 right-0 md:-right-12 text-white text-4xl font-light hover:text-pink-500 z-[60] transition-colors leading-none cursor-pointer">&times;</button>
              <img src={ceoImages[gallery.currentIndex]} className="max-w-full max-h-[80vh] object-contain relative z-10 rounded shadow-inner" alt="Gallery" draggable="false" />
              <div className="absolute inset-y-0 left-0 w-1/3 cursor-prev z-20" onClick={prevImg}></div>
              <div className="absolute inset-y-0 right-0 w-1/3 cursor-next z-20" onClick={nextImg}></div>
            </div>
            <div className="mt-6 text-center">
              <p className="font-typewriter text-white tracking-widest bg-black/80 px-4 py-2 border-b-2 border-yellow-400 rounded text-sm">
                UI Gallery View <span className="text-gray-400 ml-4 font-bold bg-white/10 px-2 py-1 rounded text-xs">[ {gallery.currentIndex + 1} / {ceoImages.length} ]</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-[80vh] flex flex-col items-center justify-center pt-8 pb-16 relative z-20">
        <div className="w-full max-w-6xl h-[550px] md:h-[650px] relative perspective-[2000px]">
          <div className="absolute inset-0 bg-black/30 rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.4)] transform translate-y-4 scale-[0.98]"></div>
          <div className="relative w-full h-full flex bg-[#5c4d3c] rounded-md border-2 border-[#4a3d2e] shadow-inner p-1 md:p-2 z-10">
            <div key={`left-${currentPage}`} className="flex-1 h-full bg-white grid-paper rounded-l-sm relative overflow-hidden page-flip-enter-left z-10 border-r border-gray-300">
              <div className="absolute inset-0 shadow-[inset_-20px_0_30px_-10px_rgba(0,0,0,0.15)] pointer-events-none z-50"></div>
              {pages[currentPage].left}
              <span className="absolute bottom-4 left-6 font-typewriter text-xs text-gray-400 font-bold opacity-50">{currentPage * 2}</span>
            </div>
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 z-40 flex flex-col justify-evenly py-2 pointer-events-none drop-shadow-md">
              {[...Array(14)].map((_, i) => (
                <div key={i} className="w-8 h-3 bg-gradient-to-r from-gray-400 via-gray-100 to-gray-500 rounded-sm border border-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.4)] relative">
                  <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-2 h-2 bg-[#5c4d3c] rounded-full shadow-inner"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-2 h-2 bg-[#5c4d3c] rounded-full shadow-inner"></div>
                </div>
              ))}
            </div>
            <div key={`right-${currentPage}`} className="flex-1 h-full bg-white kraft-paper rounded-r-sm relative overflow-hidden page-flip-enter-right z-20 border-l border-gray-300">
              <div className="absolute inset-0 shadow-[inset_20px_0_30px_-10px_rgba(0,0,0,0.15)] pointer-events-none z-50"></div>
              {pages[currentPage].right}
              <span className="absolute bottom-4 right-6 font-typewriter text-xs text-gray-400 font-bold opacity-50">{currentPage * 2 + 1}</span>
            </div>
          </div>
          <div className="absolute -bottom-16 md:-bottom-20 left-0 right-0 flex justify-between items-center px-4 md:px-10">
            <button onClick={handlePrev} className={`font-handwriting text-2xl md:text-3xl flex items-center gap-2 hover:text-pink-600 transition-colors ${currentPage === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <span className="text-3xl md:text-4xl">←</span> 翻回前页
            </button>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map(idx => (
                <div key={idx} className={`w-2 h-2 md:w-3 md:h-3 rounded-full border-2 border-black ${currentPage === idx ? 'bg-black' : 'bg-transparent'}`}></div>
              ))}
            </div>
            <button onClick={handleNext} className={`font-handwriting text-2xl md:text-3xl flex items-center gap-2 hover:text-blue-600 transition-colors ${currentPage === pages.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              翻下一页 <span className="text-3xl md:text-4xl">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- IMC Project: Creative Dossier --- */}
      <div className="min-h-[80vh] flex flex-col justify-center scroll-section mt-24 md:mt-48 pt-10 pb-32 relative">
        <div className="w-full max-w-4xl mx-auto relative group cursor-inspect transition-transform duration-500" onClick={handleImcClick}>
          <div className="absolute top-4 left-0 right-0 mx-auto w-[92%] md:w-[96%] transition-all duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] transform rotate-1 group-hover:-translate-y-16 md:group-hover:-translate-y-32 group-hover:rotate-2 z-10">
            <img src="https://i.postimg.cc/qMX980tT/image.png" alt="Pitch Deck Snippet 1" className="shadow-[0_10px_25px_rgba(0,0,0,0.3)] border-2 border-[#F4F0E6] w-full h-auto object-contain" draggable="false" />
          </div>
          <div className="absolute top-8 left-0 right-0 mx-auto w-[92%] md:w-[96%] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform -rotate-1 group-hover:-translate-y-24 md:group-hover:-translate-y-48 group-hover:-rotate-2 z-0">
            <img src="https://i.postimg.cc/L5k0BB8b/image.png" alt="Pitch Deck Snippet 2" className="shadow-[0_10px_25px_rgba(0,0,0,0.3)] border-2 border-[#F4F0E6] w-full h-auto object-contain" draggable="false" />
          </div>
          <div className="relative bg-[#d4a373] border-[3px] border-[#8b5a2b] shadow-[0_25px_50px_rgba(0,0,0,0.35)] rounded-b-xl rounded-t-sm p-8 md:p-14 z-20 kraft-paper overflow-hidden group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-shadow duration-500">
            <div className="absolute top-0 left-0 w-full h-12 md:h-16 border-b-[3px] border-[#8b5a2b] bg-[#c39160] shadow-sm flex justify-center items-end pb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-[3px] border-[#8b5a2b] bg-[#e0b084] shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)] flex items-center justify-center relative translate-y-4">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gray-800"></div>
                <svg className="absolute -top-4 -left-6 w-20 h-20 text-yellow-100/60 pointer-events-none drop-shadow-sm" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M 50,50 Q 80,30 90,80 T 20,90 T 40,20" />
                </svg>
              </div>
            </div>
            <div className="absolute top-20 right-6 md:right-12 border-[4px] border-red-600/80 text-red-600/80 font-black text-2xl md:text-3xl px-4 py-1 rotate-[15deg] font-typewriter pointer-events-none shadow-sm mix-blend-multiply">APPROVED</div>
            <div className="absolute top-20 md:top-24 left-6 md:left-12 flex items-start z-20">
              <svg viewBox="0 0 12 40" className="w-5 h-10 md:w-6 md:h-12 text-[#6b6054] mr-2 -mt-4 z-20 drop-shadow-md transform -rotate-12">
                <path d="M6,2 L6,32 C6,35 8,37 10,37 C12,37 14,35 14,32 L14,6 C14,2 11,-1 7,-1 C3,-1 0,2 0,6 L0,34 C0,40 4,44 9,44 C14,44 18,40 18,34 L18,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <div className="bg-white px-3 py-1 md:px-4 md:py-2 border border-gray-300 shadow-sm rotate-[-2deg] font-typewriter text-[10px] md:text-xs font-bold text-gray-700">Client: Pash Non-alcoholic Beer</div>
            </div>
            <div className="mt-28 md:mt-32 max-w-2xl relative z-10">
              <h2 className="text-3xl md:text-4xl font-typewriter font-black text-black mb-4">墨尔本大学 IMC Project</h2>
              <h3 className="mb-8"><span className="neon-highlight neon-pink text-lg md:text-xl font-bold">整合营销传播与视觉创意统筹</span></h3>
              <p className="font-typewriter text-sm md:text-base text-gray-800 leading-relaxed md:leading-[2rem] text-justify tracking-wide">针对都市年轻群体，以「Good Times, All The Time」为核心主张，在 5 万澳元预算下，统筹策划涵盖澳网快闪、城市互动涂鸦及全域媒体矩阵的品牌大事件。主导全案视觉创意与物料设计，以强烈的波普涂鸦风格统一品牌调性，最终方案获客户高度认可。</p>
            </div>
            <div className="flex justify-end mt-12 md:mt-16 w-full relative z-20">
              <div className="bg-[#fffbe6] border-2 border-black border-dashed px-4 py-3 md:px-6 md:py-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] rotate-[-4deg] group-hover:rotate-0 group-hover:-translate-y-1 transition-all duration-300 inline-block max-w-[90%] md:max-w-full">
                <span className="font-typewriter text-base md:text-xl text-black font-bold block break-words">
                  [ Click to View Full Pitch Deck ↗ ]
                </span>
              </div>
            </div>
          </div>
          {imcStamp && (
            <div style={{ left: imcStamp.x, top: imcStamp.y }} className="fixed z-[999] text-red-600 border-[6px] border-red-600 font-typewriter text-5xl md:text-6xl px-6 py-2 font-black stamp-opened pointer-events-none mix-blend-multiply origin-center -translate-x-1/2 -translate-y-1/2">OPENED</div>
          )}
        </div>
      </div>
    </div>
  );
};

const OtherDesign = () => {
  const [zoomedImg, setZoomedImg] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    'https://i.postimg.cc/nrK839kT/13.jpg',
    'https://i.postimg.cc/br0XmST6/14.jpg',
    'https://i.postimg.cc/Wp0PNxPx/15.jpg',
    'https://i.postimg.cc/63XxnhV6/16.jpg',
    'https://i.postimg.cc/cHSGwc7v/17.jpg'
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden p-4 md:p-16 relative scroll-smooth">
      {zoomedImg && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-sm transition-opacity" onClick={() => setZoomedImg(null)}>
          <div className="absolute inset-0 bg-[#0a0a0a] bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:6px_6px]" />
          <div className="relative max-w-[95vw] max-h-[95vh] bg-black p-1 shadow-[15px_15px_0px_#FF1493] border-[4px] border-white" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setZoomedImg(null)} className="absolute -top-12 right-0 md:-right-12 text-white text-4xl font-black hover:text-[#00FFFF] z-[60] transition-colors leading-none cursor-pointer">&times;</button>
            <img src={zoomedImg} alt="Enlarged view" className="max-w-full max-h-[85vh] object-contain relative z-10 block" draggable="false" />
          </div>
        </div>
      )}

      <div className="space-y-32 pb-32">
        <div className="flex flex-col justify-center mt-12 max-w-6xl mx-auto w-full relative pt-10">

          <WashiTape color="white" angle="0deg" top="-top-4" left="left-10" width="w-48" extraClasses="!border-black !border-[4px] !opacity-100 !bg-gray-200" />

          <div
            className="w-full aspect-[4/3] md:aspect-video border-[4px] border-black shadow-[12px_12px_0px_#000] bg-[#e8e4d9] overflow-hidden flex relative cursor-inspect group z-10"
            onClick={() => setZoomedImg(images[currentSlide])}
          >
            <div
              className="flex w-full h-full transition-transform duration-[350ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {images.map((img, idx) => (
                <div key={idx} className="w-full h-full flex-shrink-0 flex items-center justify-center border-r-[4px] border-black bg-white p-4 md:p-8 relative">
                  <img src={img} alt={`Visual Slide ${idx + 1}`} className="w-full h-full object-contain block shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]" draggable="false" />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 border-[4px] border-transparent group-hover:border-[#FF1493] transition-colors pointer-events-none z-20"></div>
            <div className="absolute bottom-4 right-4 bg-black text-white font-typewriter text-xs px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-30 shadow-[4px_4px_0px_#FF1493]">
              * CLICK SLIDE TO EXPAND (点击放大审阅)
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-4 md:-mt-8 relative z-20 gap-8 md:gap-0 pl-2 md:pl-0">

            {/* 修复：优化标题行高 leading-tight 并允许自然换行 */}
            <div className="bg-[#FFFF00] border-[4px] border-black shadow-[10px_10px_0px_#000] p-6 md:p-8 w-[95%] md:w-auto md:max-w-xl md:-mt-4 relative z-30 transition-transform hover:-translate-y-1 mx-auto md:mx-0">
              <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tighter text-black uppercase leading-tight">
                VISUAL & MOTION<br />视觉边界探索
              </h2>
              <p className="font-typewriter text-sm md:text-base leading-relaxed text-black font-bold border-t-4 border-black pt-4">
                过往平面与物料设计作品。涵盖平面海报、杂志广告、线下物料模拟图，及运用 AIGC 工具进行的风格化探索。
              </p>
            </div>

            <div className="flex items-center gap-4 md:gap-6 pr-2 md:pr-4 mx-auto md:mx-0 md:mb-8">
              <button
                onClick={prevSlide}
                className="w-14 h-14 md:w-16 md:h-16 bg-white border-[4px] border-black shadow-[6px_6px_0px_#000] hover:bg-[#FF1493] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] flex items-center justify-center text-xl md:text-3xl font-black transition-all cursor-pointer"
              >
                ◀
              </button>
              <div className="font-typewriter text-lg md:text-2xl font-black tracking-widest bg-white border-[4px] border-black px-4 py-2 shadow-[6px_6px_0px_#000] flex items-center justify-center">
                <span className="text-[#FF1493]">{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className="mx-2">/</span>
                <span>{String(images.length).padStart(2, '0')}</span>
              </div>
              <button
                onClick={nextSlide}
                className="w-14 h-14 md:w-16 md:h-16 bg-white border-[4px] border-black shadow-[6px_6px_0px_#000] hover:bg-[#00FFFF] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] flex items-center justify-center text-xl md:text-3xl font-black transition-all cursor-pointer"
              >
                ▶
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState('about');
  const [showIntro, setShowIntro] = useState(true);
  const [introText, setIntroText] = useState('');
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const fullIntroText = 'welcome to my website.';

  useEffect(() => {
    if (!showIntro) return;
    let i = 0;
    const typingInterval = setInterval(() => {
      setIntroText(fullIntroText.slice(0, i + 1));
      i++;
      if (i > fullIntroText.length) {
        clearInterval(typingInterval);
        setTimeout(() => setShowIntro(false), 1200);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, [showIntro]);

  const navItems = [
    { id: 'about', label: 'ABOUT ME' },
    { id: 'internship', label: 'INTERNSHIP' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'design', label: 'OTHER DESIGN' }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      <div
        className={`fixed inset-0 z-[9999] bg-[#F4F0E6] flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)] ${showIntro ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
      >
        <h1 className="font-typewriter text-2xl md:text-5xl font-bold tracking-widest text-black flex items-center">
          {introText}
          <span className="w-3 h-8 md:h-12 bg-black ml-2 animate-blink inline-block"></span>
        </h1>
      </div>

      <div className={`flex h-screen w-full transition-opacity duration-1000 delay-500 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        <nav
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
          className={`
            bg-[#e8e4d9] border-r-4 border-black flex flex-col justify-center py-10 shadow-[5px_0_15px_rgba(0,0,0,0.1)] z-20 flex-shrink-0 relative
            transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isSidebarHovered ? 'w-64 sidebar-expanded' : 'w-20 md:w-24'}
          `}
        >
          <div className="absolute top-0 left-0 w-full h-4 bg-gray-800 border-b-2 border-black transition-all duration-500"></div>
          <div className="absolute bottom-0 left-0 w-full h-8 bg-gray-800 border-t-2 border-black transition-all duration-500"></div>
          <div className="absolute left-4 top-10 bottom-10 w-1 bg-black/10 rounded-full"></div>

          <div className="space-y-6 md:space-y-8 w-full">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    group w-full flex items-center gap-4 transition-all duration-300
                    ${isSidebarHovered ? 'justify-start px-6 md:px-8' : 'justify-center px-0'}
                    ${isActive ? 'translate-y-1' : 'hover:translate-y-[2px]'}
                  `}
                >
                  <div className={`
                    w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-black flex items-center justify-center flex-shrink-0
                    font-typewriter font-bold text-lg md:text-xl transition-all duration-200 relative z-10
                    ${isActive
                      ? 'bg-black text-white shadow-[inset_0_3px_6px_rgba(255,255,255,0.3)]'
                      : 'bg-[#f4ebd0] text-black shadow-[2px_4px_0px_#000] hover:shadow-[1px_2px_0px_#000]'
                    }
                  `}>
                    {item.label.charAt(0)}
                  </div>
                  <span className={`
                    nav-label font-typewriter font-bold tracking-wider uppercase text-left
                    ${isActive ? 'text-black underline decoration-4 underline-offset-4' : 'text-gray-500 group-hover:text-black'}
                  `}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <main className="flex-1 relative overflow-hidden bg-transparent">
          <div className="h-full w-full relative">
            {navItems.map(item => (
              <div
                key={`content-${item.id}`}
                className={`
                    absolute inset-0 w-full h-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${activeTab === item.id ? 'translate-y-0 opacity-100 z-10' : 'translate-y-24 opacity-0 pointer-events-none z-0'}
                 `}
              >
                {item.id === 'about' && <AboutMe />}
                {item.id === 'internship' && <Internship />}
                {item.id === 'projects' && <Projects />}
                {item.id === 'design' && <OtherDesign />}
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}