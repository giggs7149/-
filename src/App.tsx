/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { DeveloperState, AdStats } from "./types";
import PhoneSimulator from "./components/PhoneSimulator";
import DeveloperHub from "./components/DeveloperHub";
import { Sparkles, Terminal, BookOpen, Coins } from "lucide-react";

// Mock historic stats representation for database / analytics logs
const INITIAL_STATS: AdStats[] = [
  { date: "05-17", impressions: 3200, clicks: 240, ctr: 7.50, ecpm: 58.20, revenue: 186.24 },
  { date: "05-18", impressions: 3900, clicks: 312, ctr: 8.00, ecpm: 61.50, revenue: 239.85 },
  { date: "05-19", impressions: 4500, clicks: 380, ctr: 8.44, ecpm: 63.14, revenue: 284.15 },
  { date: "05-20", impressions: 5100, clicks: 423, ctr: 8.29, ecpm: 65.02, revenue: 331.62 },
  { date: "05-21", impressions: 4900, clicks: 410, ctr: 8.36, ecpm: 62.80, revenue: 307.72 },
  { date: "05-22", impressions: 5800, clicks: 520, ctr: 8.96, ecpm: 68.45, revenue: 397.01 },
];

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [cheatMode, setCheatMode] = useState(false);

  // Core WeChat simulation stats state
  const [devState, setDevState] = useState<DeveloperState>({
    appId: "wxe9955576f726",
    adUnitIdBanner: "adunit-f368924b22",
    adUnitIdVideo: "adunit-7c98b843d1",
    adUnitIdInterstitial: "adunit-a482b992f0",
    totalRevenue: 1746.59,
    todayImpressions: 1120,
    todayClicks: 94,
    todayRevenue: 85.92,
    statsHistory: INITIAL_STATS,
  });

  // Action hook triggered by simulated interaction inside Phone
  const handleAdTrigger = (type: "banner" | "video" | "interstitial", isClicked: boolean = false) => {
    setDevState((prev) => {
      let revenueIncrement = 0;
      let clickIncrement = isClicked ? 1 : 0;

      switch (type) {
        case "banner":
          // Clicks make substantial earnings, while simple banner impression adds smaller micro-earnings
          revenueIncrement = isClicked ? 1.20 : 0.05;
          break;
        case "video":
          // Rewarded videos are highly valuable to advertisers! Average ¥8.00 complete watch conversion
          revenueIncrement = 8.00;
          break;
        case "interstitial":
          // Clean intersitials between pages
          revenueIncrement = 2.50;
          break;
      }

      const nextImpressions = prev.todayImpressions + 1;
      const nextClicks = prev.todayClicks + clickIncrement;
      const nextRevenue = prev.todayRevenue + revenueIncrement;

      return {
        ...prev,
        todayImpressions: nextImpressions,
        todayClicks: nextClicks,
        todayRevenue: nextRevenue,
        totalRevenue: prev.totalRevenue + revenueIncrement,
      };
    });
  };

  // Reset statistical panel back to original values
  const handleResetStats = () => {
    setDevState((prev) => ({
      ...prev,
      todayImpressions: 0,
      todayClicks: 0,
      todayRevenue: 0.00,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* Visual Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-6 py-4.5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl leading-none animate-bounce-slow">🍏</span>
            <div>
              <h1 className="text-md font-black tracking-wide text-white flex items-center gap-1.5">
                微信小游戏开发套件 <span className="text-xs bg-emerald-500/25 border border-emerald-500 text-emerald-400 font-bold px-2 py-0.5 rounded-full">v1.0.4 激活</span>
              </h1>
              <p className="text-[10px] text-slate-500">
                消除闯关核心玩法演示 + 流量主对接方案 & 广告大盘实时集成模拟器
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs font-mono font-bold text-slate-400">
            <div className="flex items-center gap-1">
              <Coins size={12} className="text-yellow-500" />
              <span>累计收益: <strong className="text-rose-500">¥ {devState.totalRevenue.toFixed(2)}</strong></span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>WeChat API Sandbox Ready</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Two Column workspace layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Hand: Phone Simulator Frame (4 columns grid) */}
        <section className="lg:col-span-5 xl:col-span-4 flex justify-center">
          <PhoneSimulator 
            currentLevel={currentLevel}
            setCurrentLevel={setCurrentLevel}
            onAdTrigger={handleAdTrigger}
            cheatMode={cheatMode}
            setCheatMode={setCheatMode}
          />
        </section>

        {/* Right Hand: Developer Hub & Monetizer Console (8 columns grid) */}
        <section className="lg:col-span-7 xl:col-span-8 h-full">
          <DeveloperHub 
            devState={devState}
            resetStats={handleResetStats}
            cheatMode={cheatMode}
          />
        </section>

      </main>

      {/* Footer Area */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-5 text-center text-[10px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2.5">
          <p className="font-mono">
            © 2026 微信小游戏开发训练营. Designed for educational playables.
          </p>
          <div className="flex gap-4.5 items-center">
            <span className="hover:text-slate-300 transition cursor-pointer">微信开发者协议</span>
            <span className="hover:text-slate-300 transition cursor-pointer">流量主分成规则</span>
            <span className="hover:text-slate-300 transition cursor-pointer">反作弊守则</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
