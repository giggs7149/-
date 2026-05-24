/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  TrendingUp, 
  Code, 
  BookOpen, 
  Copy, 
  Check, 
  DollarSign, 
  Eye, 
  MousePointerClick, 
  Percent, 
  Award,
  BookMarked,
  Download,
  Terminal,
  Layers,
  Sparkles,
  RefreshCw,
  FileCode,
  AlertCircle
} from "lucide-react";
import { AdStats, DeveloperState } from "../types";

interface DeveloperHubProps {
  devState: DeveloperState;
  resetStats: () => void;
  cheatMode: boolean;
}

export default function DeveloperHub({
  devState,
  resetStats,
  cheatMode,
}: DeveloperHubProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "sdk" | "guide">("analytics");
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  // Copy code utility helper
  const handleCopyCode = (codeText: string, elementId: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedTextId(elementId);
    setTimeout(() => {
      setCopiedTextId(null);
    }, 2000);
  };

  // Code SDK Snippets definitions
  const sdkVideoAdCode = `// -------------------------------------------------------------
// 1. 微信小游戏 - 激励视频广告集成方案 (用于复活/免费获取道具)
// Documentation: https://developers.weixin.qq.com/minigame/dev/api/ad/wx.createRewardedVideoAd.html
// -------------------------------------------------------------

let rewardedVideoAd = null;

function initRewardedVideoAd() {
  if (wx.createRewardedVideoAd) {
    // 创建广告实例，写入您从微信小程序后台->流量主->广告管理拿到的 UnitId
    rewardedVideoAd = wx.createRewardedVideoAd({
      adUnitId: '${devState.adUnitIdVideo}'
    });

    // 监听广告加载成功
    rewardedVideoAd.onLoad(() => {
      console.log('微信激励视频广告加载成功');
    });

    // 监听广告播放错误事件
    rewardedVideoAd.onError((err) => {
      console.error('微信视频广告加载失败:', err);
      // 容错处理：比如直接为用户提供基础复活，或者提示重试
    });

    // 监听广告关闭事件 (核心要点：判定是否完整播放完，谨防刷票)
    rewardedVideoAd.onClose((res) => {
      if (res && res.isEnded) {
        // 真完播，解锁复活
        console.log('完播成功，发放道具奖励');
        wx.showToast({ title: '复活成功！', icon: 'success' });
        
        // 执行客户端游戏复活代码：清理棋盘、放宽槽位等
        gameEngine.revivePlayer();
      } else {
        // 用户中途关闭，不予发放奖励
        wx.showModal({
          title: '提示',
          content: '视频播放未完毕，无法发放奖励哦~',
          showCancel: false
        });
      }
    });
  }
}

// 在玩家点击“看广告复活”时触发调用
function showRewardVideo() {
  if (rewardedVideoAd) {
    rewardedVideoAd.show()
      .catch(() => {
        // 视频拉取失败，尝试重新加载再放映
        rewardedVideoAd.load()
          .then(() => rewardedVideoAd.show())
          .catch(err => {
            console.log('广告实例展示彻底失败:', err);
            // 可以切换为插屏广告或做其他弱降级
          });
      });
  } else {
    initRewardedVideoAd();
  }
}`;

  const sdkBannerAdCode = `// -------------------------------------------------------------
// 2. 微信小游戏 - Banner广告集成方案 (置于页面底栏/轻量变现)
// Documentation: https://developers.weixin.qq.com/minigame/dev/api/ad/wx.createBannerAd.html
// -------------------------------------------------------------

let bannerAd = null;

function showBottomBannerAd() {
  if (!wx.createBannerAd) return;

  // 获取微信小游戏环境内可用窗口尺寸
  const { windowWidth, windowHeight } = wx.getSystemInfoSync();

  bannerAd = wx.createBannerAd({
    adUnitId: '${devState.adUnitIdBanner}',
    style: {
      left: 10,
      top: windowHeight - 90, // 定位到偏上底部空白区域
      width: windowWidth - 20 // 响应式左右贴边宽度
    }
  });

  // 广告加载成功，可以放映出来
  bannerAd.onLoad(() => {
    console.log('Banner 广告拉取完成');
    bannerAd.show();
  });

  // 微信引擎会自动调整Banner最适配高度，需要实时纠正top属性，防止滑出界外
  bannerAd.onResize((size) => {
    bannerAd.style.top = windowHeight - size.height - 10;
  });

  // 错误监听
  bannerAd.onError((err) => {
    console.error('Banner广告渲染失败:', err);
  });
}

// 当玩家切出战场时，可调用 hide() 确保体验
function destoryBanner() {
  if (bannerAd) {
    bannerAd.destroy(); // 卸载或隐藏
  }
}`;

  const sdkInterstitialAdCode = `// -------------------------------------------------------------
// 3. 微信小游戏 - 插屏广告集成方案 (用于关卡切换/大厅暂停弹窗)
// Documentation: https://developers.weixin.qq.com/minigame/dev/api/ad/wx.createInterstitialAd.html
// -------------------------------------------------------------

let interstitialAd = null;

function showInterstitialAd() {
  if (wx.createInterstitialAd) {
    interstitialAd = wx.createInterstitialAd({
      adUnitId: '${devState.adUnitIdInterstitial}'
    });

    interstitialAd.onLoad(() => {
      console.log('插屏广告加载成功');
    });

    interstitialAd.onError((err) => {
      console.warn('插屏广告拉取异常:', err);
    });

    interstitialAd.onClose(() => {
      console.log('插屏关闭：继续游戏');
    });
  }

  // 展示插屏
  if (interstitialAd) {
    interstitialAd.show().catch((err) => {
      console.error('插屏投递失败:', err);
    });
  }
}`;

  const gameJsonCode = `{
  "deviceOrientation": "portrait",
  "showStatusBar": false,
  "networkTimeout": {
    "request": 5000,
    "connectSocket": 5000,
    "uploadFile": 5000,
    "downloadFile": 5000
  },
  "subpackages": [],
  "plugins": {}
}`;

  // Interactive calculations for averages
  const avgCTR = devState.todayImpressions > 0 
    ? ((devState.todayClicks / devState.todayImpressions) * 100).toFixed(2) 
    : "8.45";

  const avgECPM = devState.todayImpressions > 0
    ? ((devState.todayRevenue / devState.todayImpressions) * 1000).toFixed(2)
    : "64.20";

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl text-slate-100 font-sans">
      
      {/* Upper header */}
      <div className="bg-slate-950 px-6 py-4.5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold">微信小游戏开发者中心</span>
          </div>
          <h2 className="text-base font-black text-white mt-1 flex items-center gap-1.5 tracking-wide">
            山海萌兽：啵啵消消大国战 • 核心流量主对接控制台
          </h2>
        </div>

        <div className="flex gap-2 shrink-0">
          <button 
            onClick={resetStats}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all rounded-xl text-xs font-bold text-slate-300 border border-slate-700 cursor-pointer"
          >
            <RefreshCw size={12} /> 重置今日统计
          </button>
        </div>
      </div>

      {/* Tabs navigation list */}
      <div className="bg-slate-950/40 border-b border-slate-800 flex px-4">
        
        {/* Analytics Tab button */}
        <button 
          onClick={() => setActiveTab("analytics")}
          className={`py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === "analytics" 
              ? "text-emerald-400 border-emerald-400 font-extrabold bg-emerald-500/5" 
              : "text-slate-400 border-transparent hover:text-slate-200"
          }`}
        >
          <TrendingUp size={13} /> 流量主收益大盘 (数据实时联动)
        </button>

        {/* SDK Tab button */}
        <button 
          onClick={() => setActiveTab("sdk")}
          className={`py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === "sdk" 
              ? "text-emerald-400 border-emerald-400 font-extrabold bg-emerald-500/5" 
              : "text-slate-400 border-transparent hover:text-slate-200"
          }`}
        >
          <Code size={13} /> 微信 SDK 源码注入
        </button>

        {/* Guide Tab button */}
        <button 
          onClick={() => setActiveTab("guide")}
          className={`py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === "guide" 
              ? "text-emerald-400 border-emerald-400 font-extrabold bg-emerald-500/5" 
              : "text-slate-400 border-transparent hover:text-slate-200"
          }`}
        >
          <BookOpen size={13} /> 发包与流量主指南
        </button>

      </div>

      {/* Tab Contents Area */}
      <div className="flex-1 overflow-y-auto p-5 text-slate-300">
        
        {/* PAGE 1: Analytics and Live Dials */}
        {activeTab === "analytics" && (
          <div className="space-y-5 animate-fade-in">
            
            {/* Upper Info Prompt */}
            <div className="bg-teal-950/30 border border-teal-500/20 p-4.5 rounded-2xl flex items-start gap-3">
              <Sparkles className="text-teal-400 shrink-0 mt-0.5 animate-bounce-slow" size={16} />
              <div className="text-xs leading-relaxed">
                <p className="font-bold text-teal-300">💡 模拟真机联动变现特性：</p>
                <p className="text-slate-300/90 mt-1">
                  左侧微信小游戏模拟器中发生的任何广告变现操作（如：**看视频复活**、**观看或点击水果拼团 Banner 广告**、**进入新关卡触发插屏**）都会为您累加真实的预计收益。您可以通过操作游戏来看到今日点击、曝光和每日收入以极具可信度的动态幅度上涨！
                </p>
              </div>
            </div>

            {/* Simulated Live Grid Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Stat 1: Today Revenue */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between items-start text-slate-400">
                  <span className="text-[10px] font-black tracking-widest uppercase">今日总收益 (RMB)</span>
                  <div className="h-6 w-6 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 text-xs">
                    ¥
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-xl font-mono font-black text-rose-500">
                    ¥ {devState.todayRevenue.toFixed(2)}
                  </h3>
                  <p className="text-[9px] text-emerald-400 font-bold mt-1.5 flex items-center gap-0.5">
                    ▲ +12.4% 比昨日同期
                  </p>
                </div>
              </div>

              {/* Stat 2: Impressions */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between items-start text-slate-400">
                  <span className="text-[10px] font-black tracking-widest uppercase">广告曝光量 (次)</span>
                  <Eye size={14} className="text-sky-400" />
                </div>
                <div className="mt-3">
                  <h3 className="text-xl font-mono font-black text-stone-100">
                    {devState.todayImpressions.toLocaleString()}
                  </h3>
                  <p className="text-[9px] text-slate-500 mt-1.5">
                    今日展现的各形态广告实例
                  </p>
                </div>
              </div>

              {/* Stat 3: Clicks */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between items-start text-slate-400">
                  <span className="text-[10px] font-black tracking-widest uppercase">有效点击数 (次)</span>
                  <MousePointerClick size={14} className="text-yellow-400" />
                </div>
                <div className="mt-3">
                  <h3 className="text-xl font-mono font-black text-stone-100">
                    {devState.todayClicks}
                  </h3>
                  <p className="text-[9px] text-emerald-400 mt-1.5 font-bold">
                    CTR 点击率: <span className="font-mono">{avgCTR}%</span>
                  </p>
                </div>
              </div>

              {/* Stat 4: eCPM */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between items-start text-slate-400">
                  <span className="text-[10px] font-black tracking-widest uppercase">广告每千次造价 eCPM</span>
                  <Percent size={14} className="text-teal-400" />
                </div>
                <div className="mt-3">
                  <h3 className="text-xl font-mono font-black text-teal-400">
                    ¥ {avgECPM}
                  </h3>
                  <p className="text-[9px] text-slate-400 mt-1.5">
                    千次视频/插屏曝光期望价值
                  </p>
                </div>
              </div>

            </div>

            {/* Income Graph Visual representation (Raw SVG responsive chart) */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xs font-black text-slate-200 tracking-wider">🗓️ 微信流量主 - 近七日收益趋势曲线</h4>
                  <p className="text-[9px] text-slate-500">模拟展现的视频收益 (RMB) 与 IP 流量</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 font-mono">2026年5月 中旬数据表</span>
              </div>

              {/* Responsive custom SVG Line & Area charts to bypass library complexity */}
              <div className="relative h-44 w-full bg-slate-900/40 rounded-xl px-1 py-2 flex flex-col justify-between">
                
                {/* SVG Graph rendering */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#334155" strokeWidth="0.5" strokeDasharray="3" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="#334155" strokeWidth="0.5" strokeDasharray="3" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#334155" strokeWidth="0.5" strokeDasharray="3" />

                  {/* Shaded Area area under trendline */}
                  <path 
                    d="M 10 120 L 80 110 L 160 85 L 240 95 L 320 60 L 400 35 L 490 15 L 490 140 L 10 140 Z" 
                    fill="url(#areaGrad)" 
                  />

                  {/* Main Trend Line path */}
                  <path 
                    d="M 10 120 L 80 110 L 160 85 L 240 95 L 320 60 L 400 35 L 490 15" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />

                  {/* Solid circles on coordinates */}
                  <circle cx="10" cy="120" r="4.5" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
                  <circle cx="80" cy="110" r="4.5" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
                  <circle cx="160" cy="85" r="4.5" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
                  <circle cx="240" cy="95" r="4.5" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
                  <circle cx="320" cy="60" r="4.5" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
                  <circle cx="400" cy="35" r="4.5" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
                  <circle cx="490" cy="15" r="4.5" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
                </svg>

                {/* Simulated Values popups above charts */}
                <div className="absolute top-[85px] left-[150px] bg-slate-950 border border-slate-700 text-[8px] font-bold text-slate-300 py-0.5 px-1.5 rounded-md scale-90 shadow-lg">
                  5/19: ¥284.15
                </div>

                <div className="absolute top-[35px] right-[70px] bg-slate-950 border border-slate-700 text-[8px] font-bold text-emerald-400 py-0.5 px-1.5 rounded-md scale-90 shadow-lg">
                  今日预计: ¥{devState.todayRevenue.toFixed(1)}
                </div>

                {/* Bottom X labels */}
                <div className="flex justify-between items-end w-full h-full text-[9px] font-bold text-slate-500 font-mono z-10 select-none px-2 pointer-events-none">
                  <span>05-17 (周一)</span>
                  <span>05-18 (周二)</span>
                  <span>05-19 (周三)</span>
                  <span>05-20 (周四)</span>
                  <span>05-21 (周五)</span>
                  <span>05-22 (周六)</span>
                  <span>今日实时</span>
                </div>

              </div>
            </div>

            {/* WeChat Ad unit info blocks */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <h4 className="text-xs font-black text-slate-200 tracking-wider flex items-center gap-1 mb-3">
                🔌 微信后台广告单元配置单 (Developer UnitIDs)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                    <span>BANNER_AD</span>
                    <span className="text-emerald-400">有效</span>
                  </div>
                  <p className="text-[10px] font-bold text-white mt-1">拼团推荐 Banner 广告屏</p>
                  <p className="text-[9px] font-mono text-slate-400 mt-1 bg-slate-950 py-1 px-2 rounded border border-slate-850 truncate">
                    {devState.adUnitIdBanner}
                  </p>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                    <span>REWARD_VIDEO_AD</span>
                    <span className="text-emerald-400">完整回调保护</span>
                  </div>
                  <p className="text-[10px] font-bold text-white mt-1">复活看广告单元</p>
                  <p className="text-[9px] font-mono text-slate-400 mt-1 bg-slate-950 py-1 px-2 rounded border border-slate-850 truncate">
                    {devState.adUnitIdVideo}
                  </p>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                    <span>INTERSTITIAL_AD</span>
                    <span className="text-emerald-400">随机过渡拉取</span>
                  </div>
                  <p className="text-[10px] font-bold text-white mt-1">关卡过渡插屏广告</p>
                  <p className="text-[9px] font-mono text-slate-400 mt-1 bg-slate-950 py-1 px-2 rounded border border-slate-850 truncate">
                    {devState.adUnitIdInterstitial}
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* PAGE 2: SDK Codes Integration */}
        {activeTab === "sdk" && (
          <div className="space-y-4.5 animate-fade-in text-xs">
            
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5 select-none text-left">
                📦 微信小游戏官方流量主 API 调用详解
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal text-left">
                以下为您在<b>微信开发者工具 IDE (微信小程序官方编辑器)</b>中使用原生 API 或 Cocos/Laya/Egret 打包发布时，注入小游戏底层让广告生效的经典实现模板。支持代码安全剪切！
              </p>
            </div>

            {/* BLOCK 1: Rewarded Video */}
            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 flex flex-col">
              <div className="bg-slate-900 py-2.5 px-4.5 border-b border-rose-500/20 flex justify-between items-center select-none text-left">
                <span className="font-bold text-rose-400 flex items-center gap-1">🎥 1. 激励视频接口 (RewardedVideoAd)</span>
                <button 
                  onClick={() => handleCopyCode(sdkVideoAdCode, "reward")}
                  className="py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 hover:text-white transition flex items-center gap-1 scale-90 cursor-pointer text-[10px] text-slate-300 font-bold border border-slate-700"
                >
                  {copiedTextId === "reward" ? <Check size={12} className="text-green-400 animate-pulse" /> : <Copy size={12} />}
                  {copiedTextId === "reward" ? "已复制！" : "复制源码"}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto font-mono text-[10px] text-slate-300 leading-relaxed max-h-64 bg-slate-950 text-left">
                <code>{sdkVideoAdCode}</code>
              </pre>
            </div>

            {/* BLOCK 2: Banner Ads */}
            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 flex flex-col">
              <div className="bg-slate-900 py-2.5 px-4.5 border-b border-sky-500/20 flex justify-between items-center select-none text-left">
                <span className="font-bold text-sky-400 flex items-center gap-1">📊 2. 横幅底栏接口 (BannerId)</span>
                <button 
                  onClick={() => handleCopyCode(sdkBannerAdCode, "banner")}
                  className="py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 hover:text-white transition flex items-center gap-1 scale-90 cursor-pointer text-[10px] text-slate-300 font-bold border border-slate-700"
                >
                  {copiedTextId === "banner" ? <Check size={12} className="text-green-400 animate-pulse" /> : <Copy size={12} />}
                  {copiedTextId === "banner" ? "已复制！" : "复制源码"}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto font-mono text-[10px] text-slate-300 leading-relaxed max-h-56 bg-slate-950 text-left">
                <code>{sdkBannerAdCode}</code>
              </pre>
            </div>

            {/* BLOCK 3: Interstitial Ads */}
            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 flex flex-col">
              <div className="bg-slate-900 py-2.5 px-4.5 border-b border-emerald-500/20 flex justify-between items-center select-none text-left">
                <span className="font-bold text-emerald-400 flex items-center gap-1">🖼️ 3. 转场插屏接口 (InterstitialAd)</span>
                <button 
                  onClick={() => handleCopyCode(sdkInterstitialAdCode, "inter")}
                  className="py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 hover:text-white transition flex items-center gap-1 scale-90 cursor-pointer text-[10px] text-slate-300 font-bold border border-slate-700"
                >
                  {copiedTextId === "inter" ? <Check size={12} className="text-green-400 animate-pulse" /> : <Copy size={12} />}
                  {copiedTextId === "inter" ? "已复制！" : "复制源码"}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto font-mono text-[10px] text-slate-300 leading-relaxed max-h-56 bg-slate-950 text-left">
                <code>{sdkInterstitialAdCode}</code>
              </pre>
            </div>

          </div>
        )}

        {/* PAGE 3: Mini Program Publishing Steps and Secrets */}
        {activeTab === "guide" && (
          <div className="space-y-4 animate-fade-in text-xs leading-relaxed text-left">
            
            {/* Step-by-step WeChat publishing checklist */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5 pb-2 border-b border-slate-800">
                <BookMarked className="text-emerald-400" size={16} /> 2026 微信可爱消除小游戏发版与盈利全速指南
              </h3>

              <div className="space-y-4">
                
                {/* Step 1 */}
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-black shrink-0 flex items-center justify-center text-[10px]">
                    01
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">注册微信小游戏账号</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      登录 <b>微信公众平台 (mp.weixin.qq.com)</b>，点击右上角【立即注册】。选择账号类型为 <b>【小程序】</b>。在基本资料中将服务类目配置为 <b>【游戏 - 休闲/消除】</b>，注册成功即会为您发放核心 AppID。
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-black shrink-0 flex items-center justify-center text-[10px]">
                    02
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">配置小游戏运行元文件 (game.json)</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      在微信 IDE 项目树根目录，确保包含正确的 <b>game.json</b> 文件，用以控制小游戏设备的初始像素旋转方向、导航或状态栏展示。
                    </p>
                    
                    {/* Tiny game.json copy */}
                    <div className="mt-2 border border-slate-800 rounded-lg overflow-hidden relative">
                      <div className="bg-slate-900 px-3 py-1 border-b border-slate-800 flex justify-between items-center text-[8px] text-slate-500 select-none">
                        <span>配置文件: game.json</span>
                        <span className="cursor-pointer hover:text-white" onClick={() => handleCopyCode(gameJsonCode, "json")}>
                          {copiedTextId === "json" ? "已复制！" : "复制"}
                        </span>
                      </div>
                      <pre className="p-2.5 bg-slate-950 font-mono text-[9px] text-slate-300 max-h-24 overflow-y-auto">
                        <code>{gameJsonCode}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-black shrink-0 flex items-center justify-center text-[10px]">
                    03
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">达成广告主人气门槛：1000 Independent UV</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      根据腾讯官方规定，当小程序游戏累计的<b>独立访问用户(UV)达到 1000 人</b>时，微信公众平台后台左侧导航栏【流量主】便会自动亮起解锁！
                    </p>
                    {/* Checklist info to reach UVs */}
                    <div className="mt-2.5 bg-slate-900/50 p-3 rounded-xl border border-dashed border-slate-800 flex flex-col gap-1.5 text-slate-400 text-[10px]">
                      <span className="font-bold text-slate-300">💡 消除大省及裂变吸粉技巧：</span>
                      <span>1. <b>分享裂变机制</b>: 比如在游戏内槽位满时，除了看视频复活，增加“分享到群组可立即移除3叠卡牌”奖励接口。</span>
                      <span>2. <b>好友排行榜PK</b>: 利用微信原生开放数据域，建立好友排行榜。激发用户攀比心理，让UV快速裂变破千。</span>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-black shrink-0 flex items-center justify-center text-[10px]">
                    04
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">审核上架与后台提现</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      在小程序管理后台绑定银行账户。腾讯会在每月的 1 号和 15 号自动结算上个周期由流量主广告带来的分成直接入账，并自动扣缴个人所得税。极客玩家单款爆款消消乐游戏日收益可达<b>上万元人民币（¥10,000+）</b>！
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Warning caution message box */}
            <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-4 flex gap-3 text-slate-400">
              <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={15} />
              <div className="text-[10px] leading-relaxed">
                <span className="font-bold text-amber-300 block">⚠️ 关键合规说明：</span>
                微信小游戏广告联盟有极为严格的防刷作弊系统，千万不要在客户端试图劫持和伪造完播 `onClose` 事件的分发放，必须由腾讯的底层安全 SDK 完播回调触发。客户端请务必对广告单元事件进行完备的 `try/catch` 守护，防止网络连接失败导致逻辑卡死。
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
