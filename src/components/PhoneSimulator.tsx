/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Shuffle, 
  LogOut, 
  Play, 
  Award, 
  RefreshCw, 
  Sparkles, 
  Tv, 
  X, 
  HelpCircle,
  Smartphone,
  CheckCircle2,
  Lock,
  Flame,
  Snowflake,
  Clock,
  Zap,
  MapPin,
  Trophy,
  Activity
} from "lucide-react";
import { GameTile, generateLevelTiles, updateTileLocks, PETS_POOL } from "../utils/gameEngine";
import { audio } from "../utils/audio";
import { CanvasConfetti } from "./CanvasConfetti";

// Beautiful themed skin configurations for referral levels! Each maps the base symbols securely
export const SKIN_THEMES: Record<string, Record<string, { symbol: string; label: string; bgColor: string; textColor: string }>> = {
  cyber: {
    "🐱": { symbol: "🤖", label: "赛博重装喵", bgColor: "bg-indigo-950/90 border-cyan-400 text-cyan-300 font-extrabold ring-1 ring-cyan-400/50 shadow-sm", textColor: "text-cyan-200" },
    "🐰": { symbol: "👾", label: "电子朋克兔", bgColor: "bg-fuchsia-950/90 border-fuchsia-400 text-fuchsia-300 font-extrabold ring-1 ring-fuchsia-400/50 shadow-sm", textColor: "text-fuchsia-200" },
    "🐸": { symbol: "🛸", label: "核聚变跳蛙", bgColor: "bg-slate-900/90 border-teal-400 text-teal-300 font-extrabold ring-1 ring-teal-400/50 shadow-sm", textColor: "text-teal-200" },
    "🦊": { symbol: "🛰️", label: "红外侦测狐", bgColor: "bg-orange-950/95 border-amber-400 text-amber-300 font-extrabold ring-1 ring-amber-400/50 shadow-sm", textColor: "text-amber-200" },
    "🐷": { symbol: "🔋", label: "智脑充能猪", bgColor: "bg-purple-950/95 border-pink-400 text-pink-300 font-extrabold ring-1 ring-pink-400/50 shadow-sm", textColor: "text-pink-200" },
    "🐼": { symbol: "👓", label: "夜视眼镜熊", bgColor: "bg-zinc-950/95 border-zinc-400 text-zinc-350 font-extrabold ring-1 ring-zinc-400/50 shadow-sm", textColor: "text-zinc-200" },
    "🐥": { symbol: "🧀", label: "高能原电鸡", bgColor: "bg-yellow-950/90 border-yellow-400 text-yellow-350 font-extrabold ring-1 ring-yellow-400/50 shadow-sm", textColor: "text-yellow-250" },
    "🐨": { symbol: "💿", label: "磁吸休眠熊", bgColor: "bg-emerald-950/90 border-emerald-400 text-emerald-300 font-extrabold ring-1 ring-emerald-400/50 shadow-sm", textColor: "text-emerald-250" },
    "🐵": { symbol: "🚀", label: "推进喷射猴", bgColor: "bg-sky-950/90 border-sky-400 text-sky-305 font-extrabold ring-1 ring-sky-400/50 shadow-sm", textColor: "text-sky-200" },
    "🦁": { symbol: "⚡", label: "阿尔法暴狮", bgColor: "bg-red-950/90 border-red-455 text-red-350 font-extrabold ring-1 ring-red-400/50 shadow-sm", textColor: "text-red-200" },
  },
  candy: {
    "🐱": { symbol: "🍩", label: "草莓甜甜圈", bgColor: "bg-rose-100/95 border-rose-300 text-rose-600 font-sans shadow-xs", textColor: "text-rose-700 font-sans" },
    "🐰": { symbol: "🍦", label: "缤纷圣代杯", bgColor: "bg-pink-100/95 border-pink-300 text-pink-600 font-sans shadow-xs", textColor: "text-pink-700 font-sans" },
    "🐸": { symbol: "🍿", label: "爆汁爆米花", bgColor: "bg-orange-100/95 border-orange-300 text-orange-600 font-sans shadow-xs", textColor: "text-orange-700 font-sans" },
    "🦊": { symbol: "🍬", label: "流沙水果糖", bgColor: "bg-purple-100/95 border-purple-300 text-purple-600 font-sans shadow-xs", textColor: "text-purple-700 font-sans" },
    "🐷": { symbol: "🧁", label: "奶香纸杯糕", bgColor: "bg-amber-100/85 border-amber-350 text-amber-700 font-sans shadow-xs", textColor: "text-amber-800 font-sans" },
    "🐼": { symbol: "🍪", label: "夹心巧克饼", bgColor: "bg-neutral-100/95 border-zinc-400 text-neutral-700 font-sans shadow-xs", textColor: "text-neutral-800 font-sans" },
    "🐥": { symbol: "🥞", label: "枫糖舒芙蕾", bgColor: "bg-yellow-100/95 border-yellow-350 text-yellow-650 font-sans shadow-xs", textColor: "text-yellow-700 font-sans" },
    "🐨": { symbol: "🍧", label: "椰浆宇治冰", bgColor: "bg-violet-100/95 border-violet-250 text-violet-650 font-sans shadow-xs", textColor: "text-violet-700 font-sans" },
    "🐵": { symbol: "🧉", label: "金桔百香果", bgColor: "bg-yellow-50/95 border-amber-250 text-amber-605 font-sans shadow-xs", textColor: "text-amber-700 font-sans" },
    "🦁": { symbol: "🍰", label: "芒芒千层排", bgColor: "bg-yellow-105/95 border-yellow-350 text-yellow-600 font-sans shadow-xs", textColor: "text-yellow-700 font-sans" },
  },
  mythic: {
    "🐱": { symbol: "🐲", label: "九天瑞泽神龙", bgColor: "bg-amber-100/95 border-amber-355 text-amber-805 font-black ring-1 ring-amber-300/40 shadow-sm", textColor: "text-amber-900" },
    "🐰": { symbol: "🦊", label: "青丘九尾仙狐", bgColor: "bg-rose-100/95 border-rose-355 text-rose-605 font-black ring-1 ring-rose-300/40 shadow-sm", textColor: "text-rose-900" },
    "🐸": { symbol: "🐢", label: "北冥万寿灵龟", bgColor: "bg-teal-100/95 border-teal-355 text-teal-705 font-black ring-1 ring-teal-300/40 shadow-sm", textColor: "text-teal-900" },
    "🦊": { symbol: "🦅", label: "昆仑大鹏灵尊", bgColor: "bg-purple-100/95 border-purple-355 text-purple-605 font-black ring-1 ring-purple-350/45 shadow-sm", textColor: "text-purple-900" },
    "🐷": { symbol: "🐯", label: "赤焰吞天金虎", bgColor: "bg-orange-100/95 border-orange-355 text-orange-605 font-black ring-1 ring-orange-300/40 shadow-sm", textColor: "text-orange-900" },
    "🐼": { symbol: "🦄", label: "紫霄七彩瑞麟", bgColor: "bg-indigo-100/95 border-indigo-355 text-indigo-705 font-black ring-1 ring-indigo-300/40 shadow-sm", textColor: "text-indigo-900" },
    "🐥": { symbol: "🦜", label: "神庭离火朱雀", bgColor: "bg-red-100/95 border-red-355 text-red-605 font-black ring-1 ring-red-300/40 shadow-sm", textColor: "text-red-900" },
    "🐨": { symbol: "🦌", label: "瑶池步步祥鹿", bgColor: "bg-emerald-100/95 border-emerald-355 text-emerald-705 font-black ring-1 ring-emerald-300/40 shadow-sm", textColor: "text-emerald-900" },
    "🐵": { symbol: "🦚", label: "五彩孔雀明王", bgColor: "bg-cyan-100/95 border-cyan-355 text-cyan-705 font-black ring-1 ring-cyan-300/40 shadow-sm", textColor: "text-cyan-900" },
    "🦁": { symbol: "🏮", label: "山海伏魔辟邪", bgColor: "bg-rose-100/95 border-rose-355 text-rose-605 font-black ring-1 ring-rose-300/40 shadow-sm", textColor: "text-rose-900" },
  }
};

// Applies the specified skins to the items collection
export const applySkinToTiles = (tiles: GameTile[], skin: string): GameTile[] => {
  if (skin === "classic" || !SKIN_THEMES[skin]) {
    return tiles.map(t => {
      const baseSymbol = t.originalSymbol || t.symbol;
      const basePet = PETS_POOL.find(p => p.symbol === baseSymbol);
      if (basePet) {
        return {
          ...t,
          symbol: baseSymbol,
          label: basePet.label,
          bgColor: basePet.bgColor,
          textColor: basePet.textColor
        };
      }
      return t;
    });
  }
  const theme = SKIN_THEMES[skin];
  return tiles.map(t => {
    const baseSymbol = t.originalSymbol || t.symbol;
    const mapped = theme[baseSymbol];
    if (mapped) {
      return {
        ...t,
        symbol: mapped.symbol,
        label: mapped.label,
        bgColor: mapped.bgColor,
        textColor: mapped.textColor,
        originalSymbol: baseSymbol,
      };
    }
    return t;
  });
};

interface PhoneSimulatorProps {
  currentLevel: number;
  setCurrentLevel: (lvl: number) => void;
  onAdTrigger: (type: "banner" | "video" | "interstitial", isClicked?: boolean) => void;
  cheatMode: boolean;
  setCheatMode: (enabled: boolean) => void;
}

// All 34 Chinese provinces and administrative regions
const PROVINCES = [
  "北京市", "上海市", "天津市", "重庆市",
  "广东省", "四川省", "浙江省", "江苏省", "山东省", "福建省",
  "湖北省", "湖南省", "陕西省", "河南省", "安徽省", "辽宁省",
  "吉林省", "黑龙江省", "河北省", "山西省", "江西省", "海南省",
  "贵州省", "云南省", "甘肃省", "青海省", "台湾省",
  "内蒙古自治区", "广西壮族自治区", "西藏自治区", "宁夏回族自治区", "新疆维吾尔自治区",
  "香港特别行政区", "澳门特别行政区"
];

const PROVINCE_AVATARS: Record<string, string> = {
  "北京市": "🏰", "上海市": "🗼", "天津市": "🎡", "重庆市": "🍲",
  "广东省": "🦁", "四川省": "🐼", "浙江省": "🍵", "江苏省": "⛵", "山东省": "⛰️", "福建省": "🦪",
  "湖北省": "🦅", "湖南省": "🌶️", "陕西省": "🏺", "河南省": "🥋", "安徽省": "🖌️", "辽宁省": "⚙️",
  "吉林省": "🌲", "黑龙江省": "🐯", "河北省": "🏹", "山西省": "🧱", "江西省": "🦢", "海南省": "🥥",
  "贵州省": "🍷", "云南省": "🐘", "甘肃省": "🐪", "青海省": "🐄", "台湾省": "🧋",
  "内蒙古自治区": "🐎", "广西壮族自治区": "🛶", "西藏自治区": "🏔️", "宁夏回族自治区": "🍇", "新疆维吾尔自治区": "🍈",
  "香港特别行政区": "🏙️", "澳门特别行政区": "🥮"
};

interface LevelSpec {
  id: number;
  title: string;
  icon: string;
  desc: string;
  borderColor: string;
  textColor: string;
  bgColor: string;
  iconBg: string;
  isHidden?: boolean;
}

const LEVEL_SPECS: LevelSpec[] = [
  { id: 1, title: "1. 萌新学堂", icon: "🐣", desc: "🐣 极简消除热手 • 基础萌宠趣味消除测试", borderColor: "border-yellow-200", textColor: "text-yellow-600", bgColor: "hover:bg-yellow-50/10", iconBg: "bg-yellow-105" },
  { id: 2, title: "2. 冰封魔域 (极限挑战)", icon: "❄️", desc: "🔥 萌新试炼场！通过率仅 0.1%！通关即可代表省份登顶星光殿堂 🏆", borderColor: "border-blue-200", textColor: "text-blue-500", bgColor: "hover:bg-blue-50/10", iconBg: "bg-blue-105" },
  { id: 3, title: "3. 幻光幻境", icon: "⏳", desc: "⏳ 无限周期变色幻兽混淆视听，考验大脑高速运转极限", borderColor: "border-pink-200", textColor: "text-pink-500", bgColor: "hover:bg-pink-50/10", iconBg: "bg-pink-105" },
  { id: 4, title: "4. 双重狂飙", icon: "🌀", desc: "🌀 寒冰重锁与幻彩魔兽双重狙击，手脑并用的折磨美学", borderColor: "border-orange-200", textColor: "text-orange-500", bgColor: "hover:bg-orange-50/10", iconBg: "bg-orange-105" },
  { id: 5, title: "5. 八阵奇图", icon: "🏰", desc: "🏰 玄铁厚甲阵层层重叠，深度抗压，需要绝顶聪明的棋局解法", borderColor: "border-teal-200", textColor: "text-teal-600", bgColor: "hover:bg-teal-50/10", iconBg: "bg-teal-105" },
  { id: 6, title: "6. 地区捍卫战", icon: "🛡️", desc: "🛡️ 战况已到白热化！通关直接为家乡省份战力值注入 +1500！", borderColor: "border-purple-200", textColor: "text-purple-600", bgColor: "hover:bg-purple-50/10", iconBg: "bg-purple-105" },
  { id: 7, title: "7. 灵能潮汐", icon: "🌊", desc: "🌊 赛场风云席卷！卡数翻倍，消解百千层神秘浪潮屏障", borderColor: "border-cyan-200", textColor: "text-cyan-600", bgColor: "hover:bg-cyan-50/10", iconBg: "bg-cyan-105" },
  { id: 8, title: "8. 星火璀璨", icon: "🔥", desc: "🔥 碎裂棋盘红莲火光飞舞！神级操作才能绝处逢生的精妙对局", borderColor: "border-red-200", textColor: "text-red-500", bgColor: "hover:bg-red-50/10", iconBg: "bg-red-105" },
  { id: 9, title: "9. 龙腾神州", icon: "🐉", desc: "🐉 龙头高耸，神兽盘旋！错综复杂的千古残局，你能看透几步？", borderColor: "border-emerald-200", textColor: "text-emerald-600", bgColor: "hover:bg-emerald-50/10", iconBg: "bg-emerald-105" },
  { id: 10, title: "10. 九霄神殿", icon: "⚡", desc: "⚡ 雷鸣震耳，电闪雷鸣！极速降温与幻化闪速，挑战人类脑力上限", borderColor: "border-indigo-200", textColor: "text-indigo-600", bgColor: "hover:bg-indigo-50/10", iconBg: "bg-indigo-105" },
  { id: 11, title: "11. 傲世至臻", icon: "⚔️", desc: "⚔️ 豪强天梯局！棋局奇妙一招落错满盘皆输，谋定而后动的益智神作", borderColor: "border-amber-200", textColor: "text-amber-600", bgColor: "hover:bg-amber-50/10", iconBg: "bg-amber-105" },
  { id: 12, title: "12. 巅峰封神大决战", icon: "👑", desc: "👑 终极封神无双战！胜率仅万分之一，通关者在本省直接享受真龙登顶特效 🌟", borderColor: "border-rose-300", textColor: "text-rose-600", bgColor: "hover:bg-rose-50/10", iconBg: "bg-rose-105" },
  { id: 13, title: "13. 🌸 迷失桃花源", icon: "🌸", desc: "270张卡牌 • 樱意朦胧幻境，极速变色层叠大挑战", borderColor: "border-fuchsia-300", textColor: "text-fuchsia-600", bgColor: "hover:bg-fuchsia-50/10", iconBg: "bg-fuchsia-100", isHidden: true },
  { id: 14, title: "14. 🌌 混沌太极星", icon: "🌌", desc: "330张卡牌 • 阴阳八卦两极双重冰封，考验极致手速", borderColor: "border-violet-300", textColor: "text-violet-600", bgColor: "hover:bg-violet-50/10", iconBg: "bg-violet-100", isHidden: true },
  { id: 15, title: "15. 👑 极萌无极神域", icon: "🦄", desc: "360张卡牌 • 诸神黄昏之无极神域，唯有极高悟性可破", borderColor: "border-emerald-300", textColor: "text-emerald-600", bgColor: "hover:bg-emerald-50/10", iconBg: "bg-emerald-100", isHidden: true }
];

interface CleanParticle {
  id: string;
  x: number;
  y: number;
  symbol: string;
  vx: number;
  vy: number;
  rotate: number;
  scale: number;
}

export default function PhoneSimulator({
  currentLevel,
  setCurrentLevel,
  onAdTrigger,
  cheatMode,
  setCheatMode
}: PhoneSimulatorProps) {
  // Game states
  const [gameState, setGameState] = useState<"welcome" | "loading" | "lobby" | "playing" | "ad_watching" | "victory" | "gameover" | "revive_prompt">("welcome");
  const [lobbyTab, setLobbyTab] = useState<"levels" | "pvp_lobby" | "ranking" | "profile">("levels");
  
  // Timer Challenge state configuration
  const [timerChallengeEnabled, setTimerChallengeEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120);
  const [maxTime, setMaxTime] = useState(120);
  const [failReason, setFailReason] = useState<"tray_full" | "time_out">("tray_full");

  // Personal & Province ranking records
  const [rankingSubTab, setRankingSubTab] = useState<"province" | "personal">("province");
  const [userNickname, setUserNickname] = useState("单手解万难");
  const [isWechatLoggedIn, setIsWechatLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState("🦊");
  const [showWechatLoginPrompt, setShowWechatLoginPrompt] = useState(false);
  const [tempWechatNickname, setTempWechatNickname] = useState("");
  const [tempWechatAvatar, setTempWechatAvatar] = useState("🐰");

  const prepareWechatPrompt = () => {
    try { audio.playTap(); } catch (e) {}
    const defaultNicknames = ["仙品萌兔神", "极地消消喵", "元气流心兔", "芝士甜心熊", "保命元气橙", "无敌消除王", "金牌消消师", "全村希望派"];
    const cuteEmojis = ["🦊", "🐰", "🐼", "🐹", "🥑", "🐯", "🐱", "🐨", "🦁", "🐧"];
    const randomNick = defaultNicknames[Math.floor(Math.random() * defaultNicknames.length)] + " " + cuteEmojis[Math.floor(Math.random() * cuteEmojis.length)];
    setTempWechatNickname(randomNick);
    setTempWechatAvatar(cuteEmojis[Math.floor(Math.random() * cuteEmojis.length)]);
    setShowWechatLoginPrompt(true);
  };

  const claimStreakMilestone = (id: string, name: string) => {
    try { audio.playTap(); } catch (e) {}
    setClaimedMilestones(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem("wechat_pvp_claimed_milestones", JSON.stringify(next));
      return next;
    });
    // Trigger celebratory sound if possible
    try { audio.playAdComplete(); } catch (e) {}
    showWechatToast(`🎉 成功领受天梯大奖！您已正式获得并穿戴特典【${name}】！`);
  };

  const claimDailyQuest = (id: string, name: string) => {
    try { audio.playTap(); } catch (e) {}
    setClaimedDailyQuests(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem("wechat_claimed_daily_quests", JSON.stringify(next));
      return next;
    });
    try { audio.playAdComplete(); } catch (e) {}

    if (id === "q1") {
      setUndoCount(prev => prev + 1);
      setFreezeTimeCount(prev => prev + 1);
      showWechatToast(`🎉 已成功领受【${name}】大奖！获得：撤销道具 x1, 冻结时钟 x1！`);
    } else if (id === "q2") {
      setOutCount(prev => prev + 1);
      setShuffleCount(prev => prev + 1);
      showWechatToast(`🎉 已成功领受【${name}】大奖！获得：移出工具 x1, 洗牌道具 x1！`);
    } else if (id === "q3") {
      setAddTimeCount(prev => prev + 2);
      setShareReviveLeft(prev => prev + 1);
      showWechatToast(`🎉 已成功领受【${name}】大奖！获得：高能加时沙漏 x2, 免费复活机会 +1！`);
    }
  };

  const resetDailyQuests = () => {
    try { audio.playTap(); } catch (e) {}
    setDailyTilesEliminated(0);
    setClaimedDailyQuests([]);
    localStorage.setItem("wechat_daily_tiles_eliminated", "0");
    localStorage.setItem("wechat_claimed_daily_quests", "[]");
    showWechatToast("🔄 每日修行任务数据已测试重置！快去大厅接收星光洗礼吧！");
  };
  const [userBestScore, setUserBestScore] = useState(0);
  const [userBestTime, setUserBestTime] = useState(0); // Best completion speed in seconds
  const [userBestLevel, setUserBestLevel] = useState(0); // Best level number
  const [levelStartTimestamp, setLevelStartTimestamp] = useState<number>(0);
  const [drawnFortune, setDrawnFortune] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // PVP Win Streak States for Fostering Competitive Spirit
  const [pvpWinStreak, setPvpWinStreak] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("wechat_pvp_win_streak");
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [pvpMaxStreak, setPvpMaxStreak] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("wechat_pvp_max_streak");
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [claimedMilestones, setClaimedMilestones] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("wechat_pvp_claimed_milestones");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [hasUsedMilestoneReviveToday, setHasUsedMilestoneReviveToday] = useState(false);

  // Daily Quests system for rewarding Golden Fingers & Revives
  const [dailyTilesEliminated, setDailyTilesEliminated] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("wechat_daily_tiles_eliminated");
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [claimedDailyQuests, setClaimedDailyQuests] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("wechat_claimed_daily_quests");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCameraShaking, setIsCameraShaking] = useState(false);

  const triggerCameraShake = () => {
    setIsCameraShaking(true);
    setTimeout(() => {
      setIsCameraShaking(false);
    }, 500);
  };

  const [personalLeaderboard, setPersonalLeaderboard] = useState(() => [
    { name: "终极消霸熊猫", province: "四川省", avatar: "🐼", level: 5, score: 3200, timeInSeconds: 38 },
    { name: "火辣小灵猴", province: "重庆市", avatar: "🍲", level: 4, score: 2450, timeInSeconds: 41 },
    { name: "大湾区消神", province: "广东省", avatar: "🦁", level: 4, score: 2200, timeInSeconds: 45 },
    { name: "极速手速狂魔", province: "浙江省", avatar: "🍵", level: 3, score: 1850, timeInSeconds: 34 },
    { name: "爱消消的小李", province: "北京市", avatar: "🏰", level: 3, score: 1500, timeInSeconds: 52 },
    { name: "无敌兔兔侠", province: "辽宁省", avatar: "⚙️", level: 3, score: 1320, timeInSeconds: 59 },
    { name: "王牌排雷大兵", province: "黑龙江省", avatar: "🐯", level: 2, score: 850, timeInSeconds: 28 },
    { name: "分秒必消客", province: "台湾省", avatar: "🧋", level: 2, score: 620, timeInSeconds: 49 },
    { name: "神速小浣熊", province: "湖北省", avatar: "🦅", level: 1, score: 250, timeInSeconds: 15 },
  ]);

  const [provinceAvgTimes, setProvinceAvgTimes] = useState<Record<string, number>>(() => {
    const times: Record<string, number> = {};
    PROVINCES.forEach(prov => {
      times[prov] = Math.floor(Math.random() * 55) + 55;
    });
    times["广东省"] = 52;
    times["四川省"] = 55;
    times["北京市"] = 59;
    times["上海市"] = 61;
    return times;
  });
  
  // PvP Multi-battle State Engine
  const [isPvPMode, setIsPvPMode] = useState(false);
  const [pvpState, setPvpState] = useState<"idle" | "searching" | "found" | "playing" | "victory" | "defeated">("idle");
  const [pvpSearchTimer, setPvpSearchTimer] = useState(0);
  const [pvpOpponent, setPvpOpponent] = useState<any>(null);
  const [opponentProgress, setOpponentProgress] = useState(0); // 0 to 100%
  const [pvpFeeds, setPvpFeeds] = useState<string[]>([]);
  const [userActiveEmoji, setUserActiveEmoji] = useState<{ emoji: string; id: number } | null>(null);
  const [opponentActiveEmoji, setOpponentActiveEmoji] = useState<{ emoji: string; id: number } | null>(null);
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number; isOpponent: boolean }[]>([]);
  const [friendRoomInput, setFriendRoomInput] = useState<string>("");
  const [inviteRoomPassword, setInviteRoomPassword] = useState<string | null>(null);

  // Referral Rewards / "Invite Friends" state trackers
  const [referralsCount, setReferralsCount] = useState<number>(() => {
    return Number(localStorage.getItem("wechat_referrals_count") || "0");
  });
  const [invitedFriendsList, setInvitedFriendsList] = useState<{ name: string; avatar: string; date: string }[]>(() => {
    try {
      const saved = localStorage.getItem("wechat_invited_list");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeSkinTheme, setActiveSkinTheme] = useState<string>(() => {
    return localStorage.getItem("wechat_active_skin") || "classic";
  });
  const [showReferralDialog, setShowReferralDialog] = useState(false);

  // Game field tiles & containers
  const [activeTiles, setActiveTiles] = useState<GameTile[]>([]);
  const [tray, setTray] = useState<GameTile[]>([]);
  const [holder, setHolder] = useState<GameTile[]>([]); // "移出" powerup floor holding up to 3 tiles
  const [history, setHistory] = useState<{ active: GameTile[]; tray: GameTile[]; holder: GameTile[] }[]>([]);
  
  // High energy visual notifications
  const [blastNotice, setBlastNotice] = useState<string | null>(null);
  const [comboCount, setComboCount] = useState(0);

  // Dynamic visual states for ultra-satisfying tile matches
  const [eliminatingTileIds, setEliminatingTileIds] = useState<string[]>([]);
  const [matchingParticles, setMatchingParticles] = useState<CleanParticle[]>([]);

  // Regional rankings state with high fidelity initializer covering all 34 units
  const [selectedProvince, setSelectedProvince] = useState("广东省");
  const [provinceScores, setProvinceScores] = useState<Record<string, number>>(() => {
    const scores: Record<string, number> = {};
    const presets: Record<string, number> = {
      "广东省": 184560,
      "四川省": 152340,
      "北京市": 139120,
      "上海市": 128450,
      "浙江省": 115200,
      "山东省": 98400,
      "江苏省": 89130,
      "台湾省": 85400,
      "香港特别行政区": 78200,
      "澳门特别行政区": 72100,
      "湖北省": 76540,
      "湖南省": 62410,
      "陕西省": 54120
    };
    PROVINCES.forEach(prov => {
      scores[prov] = presets[prov] !== undefined ? presets[prov] : Math.floor(Math.random() * 35000) + 12000;
    });
    return scores;
  });

  const [battleFeeds, setBattleFeeds] = useState<string[]>([
    "📢 广东省 网友刚才战胜了第3关【极地冰封】，为家乡 +150 战绩信仰点！",
    "📢 四川省 追赶势头极其猛烈，省份积分直逼广东省！",
    "📢 台湾省 网友刚刚打出 5 连消，为家乡奉献星火积分！",
    "📢 香港特别行政区 网友使用'随机洗乱'成功破局，积分攀升！"
  ]);

  // Powerup counts
  const [undoCount, setUndoCount] = useState(2);
  const [shuffleCount, setShuffleCount] = useState(2);
  const [outCount, setOutCount] = useState(2);
  const [addTimeCount, setAddTimeCount] = useState(2);
  const [freezeTimeCount, setFreezeTimeCount] = useState(2);
  const [timeFreezeLeft, setTimeFreezeLeft] = useState(0);
  const [shareReviveLeft, setShareReviveLeft] = useState(3);

  // Audio mute status
  const [isMuted, setIsMuted] = useState(false);

  // Ad simulation properties
  const [adTimer, setAdTimer] = useState(15);
  const [adPurpose, setAdPurpose] = useState<"revive" | "powerup_undo" | "powerup_shuffle" | "powerup_out">("revive");
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Selected tile ref to lock clicks during match animation
  const [isAnimating, setIsAnimating] = useState(false);

  // Share & Adorable Invites UI States
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payTier, setPayTier] = useState<"trial" | "weekly" | "monthly" | "season">("monthly");
  const [isVVIP, setIsVVIP] = useState(false); // VIP Tycoon title/wings
  const [sharePresetType, setSharePresetType] = useState<"poster" | "family" | "friend" | "help">("poster");
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [shareFeedbackMsg, setShareFeedbackMsg] = useState("");

  // Time for WeChat clock
  const [phoneTime, setPhoneTime] = useState("10:00");
  const [wechatToast, setWechatToast] = useState<string | null>(null);

  const showWechatToast = (message: string) => {
    setWechatToast(message);
    setTimeout(() => {
      setWechatToast(prev => prev === message ? null : prev);
    }, 3200);
  };

  // WeChat Top Bar Clock
  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      setPhoneTime(`${h}:${m}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  // Update mute state initially
  useEffect(() => {
    setIsMuted(audio.getMuted());
  }, []);

  // Live regional updates interval simulation to make database/contest feel real-time & viral!
  useEffect(() => {
    if (gameState !== "lobby") return;
    const interval = setInterval(() => {
      // Pick a random province to update
      const randomProv = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
      const bonusScore = Math.floor(Math.random() * 4 + 1) * 30;
      
      setProvinceScores(prev => ({
        ...prev,
        [randomProv]: (prev[randomProv] || 1000) + bonusScore
      }));

      // Generate realistic log feed strings
      const actions = [
        `刚才成功突破了第 ${Math.floor(Math.random() * 4) + 1} 关，积分 +${bonusScore}！`,
        `使用 3 次绿色能量复活在消除边缘疯狂试探，累计奉献了 +${bonusScore} 战绩！`,
        `刚刚打出 ${Math.floor(Math.random() * 3) + 3} 连消合体技，引爆省份星火！`,
        `贡献了完播能效，助力家乡夺冠声威！`
      ];
      const feedStr = `📢 ${randomProv} 网友${actions[Math.floor(Math.random() * actions.length)]}`;
      
      setBattleFeeds(prev => [feedStr, ...prev.slice(0, 4)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [gameState]);

  // Chameleon Shifting Effect clock (Every 3.5 seconds, all chameleon pets shape-shift dynamically!)
  useEffect(() => {
    if (gameState !== "playing") return;
    
    const interval = setInterval(() => {
      // Find out if we have any active chameleon tiles
      const containsChameleons = activeTiles.some(t => t.isChameleon);
      if (!containsChameleons) return;

      // To guarantee 100% mathematical solvability (saving total counts in multiples of 3),
      // we permute the symbols and lookups of all active chameleon tiles on the board.
      // This swaps their faces while strictly conserving the overall count of each species!
      setActiveTiles(prev => {
        const chameleons = prev.filter(t => t.isChameleon);
        if (chameleons.length <= 1) return prev;

        // Gather all current visual asset packages
        const assets = chameleons.map(t => ({
          symbol: t.symbol,
          label: t.label,
          bgColor: t.bgColor,
          textColor: t.textColor
        }));

        // Perform standard secure Fischer-Yates shuffle on the assets
        for (let i = assets.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = assets[i];
          assets[i] = assets[j];
          assets[j] = temp;
        }

        // Project the shuffled assets back onto the chameleon tiles
        let chamIndex = 0;
        const nextTiles = prev.map(tile => {
          if (tile.isChameleon) {
            const asset = assets[chamIndex++];
            return {
              ...tile,
              symbol: asset.symbol,
              label: asset.label,
              bgColor: asset.bgColor,
              textColor: asset.textColor
            };
          }
          return tile;
        });

        return updateTileLocks(nextTiles);
      });

      // Play a quick subtle spatial shuffle tone to notify player
      if (!isMuted) {
        try {
          audio.playSlide();
        } catch {}
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [gameState, activeTiles, isMuted]);

  // Level countdown timer for the Timer Challenge!
  useEffect(() => {
    if (gameState !== "playing" || isPvPMode || !timerChallengeEnabled) return;

    const timer = setInterval(() => {
      setTimeFreezeLeft(prevFreeze => {
        if (prevFreeze > 0) {
          return prevFreeze - 1;
        } else {
          setTimeLeft(prevTime => {
            if (prevTime <= 1) {
              clearInterval(timer);
              // Time matches 0! Fire gameover or revive prompt due to timeout
              setFailReason("time_out");
              setGameState("revive_prompt");
              if (!isMuted) {
                try {
                  audio.playGameOver();
                } catch {}
              }
              return 0;
            }
            return prevTime - 1;
          });
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, isPvPMode, timerChallengeEnabled, isMuted]);

  // PvP Live Matchmaking & Battle Simulation Timer Engine
  useEffect(() => {
    let searchInterval: NodeJS.Timeout | null = null;
    if (pvpState === "searching") {
      setPvpSearchTimer(0);
      searchInterval = setInterval(() => {
        setPvpSearchTimer(prev => {
          const next = prev + 1;
          if (next >= 2) { // 2 seconds rapid scanning
            clearInterval(searchInterval!);
            
            // Generate randomized Chinese province & nickname
            const filterPool = PROVINCES.filter(p => p !== selectedProvince);
            const randomProv = filterPool[Math.floor(Math.random() * filterPool.length)] || "台湾省";
            const nicknames = ["火辣小灵猴", "终极消霸熊猫", "大湾区消神", "极速手速狂魔", "王牌排雷大兵", "无敌兔兔侠", "爱消消的小李", "单手解万难", "元素合体法仙", "闪击特工"];
            const randNickname = nicknames[Math.floor(Math.random() * nicknames.length)];
            const opponent = {
              name: `『${randNickname}』`,
              province: randomProv,
              avatar: PROVINCE_AVATARS[randomProv] || "🐼",
              score: Math.floor(Math.random() * 85000) + 21000,
            };
            
            setPvpOpponent(opponent);
            setPvpState("found");
            audio.playAdComplete(); // successful match noise

            // Switch to game battle in 1.8 seconds
            setTimeout(() => {
              setPvpState("playing");
              // PvP standard difficulty layout
              const tiles = applySkinToTiles(generateLevelTiles(4), activeSkinTheme); 
              setActiveTiles(tiles);
              setTray([]);
              setHolder([]);
              setHistory([]);
              setUndoCount(2);
              setShuffleCount(2);
              setOutCount(2);
              setComboCount(0);
              setBlastNotice(null);
              setOpponentProgress(0);
              setPvpFeeds(["⚔️ 精彩对决战鼓已擂！全力爆破，誓为家乡争夺荣誉天梯！"]);
              setUserActiveEmoji(null);
              setOpponentActiveEmoji(null);
            }, 1800);
            return 2;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (searchInterval) clearInterval(searchInterval);
    };
  }, [pvpState, selectedProvince]);

  // Opponent Live Chess progress ticks and automatic magic attack simulator
  useEffect(() => {
    let opponentInterval: NodeJS.Timeout | null = null;
    if (pvpState === "playing") {
      opponentInterval = setInterval(() => {
        setOpponentProgress(prev => {
          // Progress speed escalation
          const progressStep = Math.floor(Math.random() * 5) + 3; // gains 3%-7% progress
          const next = Math.min(prev + progressStep, 100);

          if (next >= 100) {
            clearInterval(opponentInterval!);
            audio.playGameOver();
            setPvpState("defeated");
            
            // Reset Win Streak
            setPvpWinStreak(0);
            localStorage.setItem("wechat_pvp_win_streak", "0");
            showWechatToast("💔 天梯败北，连胜已被终结！振作起来重新征战！");

            setBattleFeeds(pf => [
              `💔 【惜败】在1v1天梯对战中，由于对手先人一步，我省 ${selectedProvince} 代表败给了来自 ${pvpOpponent?.province} 的选手 ${pvpOpponent?.name}！`,
              ...pf.slice(0, 3)
            ]);
            return 100;
          }

          // 30% frequency of opponent casting interactive combat spell!
          if (Math.random() < 0.3) {
            const spellBook = [
              { name: "寒霜冰块", desc: "把你的 1 个活动宠兽冻成了坚冰！", type: "ice" },
              { name: "暗黑帷幕", desc: "发动黑暗烟消遮挡了你的视界！", type: "blind" },
              { name: "灵力推击", desc: "晃动了你的卡牌布局！", type: "shake" }
            ];
            const spell = spellBook[Math.floor(Math.random() * spellBook.length)];
            
            setPvpFeeds(f => [
              `⚠️ 对手对你施展了【${spell.name}】！${spell.desc}`,
              ...f.slice(0, 3)
            ]);

            if (spell.type === "ice") {
              // Lock a random top level user tile inside ice block!
              setActiveTiles(prevTiles => {
                const unfrozenOnTop = prevTiles.filter(t => !t.isLocked && !t.isFrozen);
                if (unfrozenOnTop.length > 0) {
                  const pick = unfrozenOnTop[Math.floor(Math.random() * unfrozenOnTop.length)];
                  return prevTiles.map(t => t.id === pick.id ? { ...t, isFrozen: true } : t);
                }
                return prevTiles;
              });
              setBlastNotice(`⚠️ 危险！受对手【${spell.name}】轰炸，你的 1 个顶层宠兽被坚冰封印！`);
              setTimeout(() => setBlastNotice(null), 2500);
            } else if (spell.type === "blind") {
              setBlastNotice(`⚠️ 障眼尘土！对手丢下了【暗黑帷幕】重霾干扰，冷静视察！`);
              setTimeout(() => setBlastNotice(null), 2500);
            }
          } else {
            const logs = [
              "对手正在拼命解冰...",
              "对手打出一组 3 连消兔子...",
              "对方触发双击解谜，进度极其凶猛！",
              "对手面临槽位蓄满危机，使用前三置换化险为夷！",
              "对手正在规划变色动物的抓捕顺序..."
            ];
            setPvpFeeds(f => [
              `💬 ${pvpOpponent?.name}: ${logs[Math.floor(Math.random() * logs.length)]}`,
              ...f.slice(0, 3)
            ]);
          }

          return next;
        });
      }, 3500);
    }
    return () => {
      if (opponentInterval) clearInterval(opponentInterval);
    };
  }, [pvpState, pvpOpponent, selectedProvince]);

  const handleStartPvP = (type: "random" | "friend_create" | "friend_join") => {
    audio.playTap();
    setIsPvPMode(true);
    
    if (type === "random") {
      setPvpState("searching");
      setGameState("playing");
    } else if (type === "friend_create") {
      const roomNum = Math.floor(1001 + Math.random() * 8990).toString();
      setInviteRoomPassword(roomNum);
      setPvpState("idle");
    } else if (type === "friend_join") {
      setPvpState("searching");
      setGameState("playing");
    }
  };

  const sendPvpEmoji = (emoji: string) => {
    audio.playTap();
    const id = Date.now();
    setUserActiveEmoji({ emoji, id });
    
    // Spawn a beautiful floating cute emoji for the User
    const userFloatId = id;
    setFloatingEmojis(prev => [
      ...prev,
      {
        id: userFloatId,
        emoji,
        x: 10 + Math.random() * 25, // float on the user side (left-of-center)
        isOpponent: false
      }
    ]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(item => item.id !== userFloatId));
    }, 1800);

    // Auto-clear player's emoji bubble after 2 seconds
    setTimeout(() => {
      setUserActiveEmoji(curr => curr && curr.id === id ? null : curr);
    }, 2000);

    const opponentMocks: Record<string, { emoji: string; text: string }[]> = {
      "😄": [
        { emoji: "😂", text: "嘲笑我是吧？看我的！" },
        { emoji: "🤪", text: "哼哼，比你还年轻，看我的手速！" },
        { emoji: "😎", text: "爱笑的孩子运气不会差，但我实力更强！" }
      ],
      "😂": [
        { emoji: "😤", text: "可恶，敢笑我卡槽快满了！" },
        { emoji: "🤪", text: "哈哈，同乐同乐，大家一起来消！" },
        { emoji: "😎", text: "稳住，这波我绝对能反杀！" }
      ],
      "🤪": [
        { emoji: "😤", text: "略略略！气死我了，等我放大招！" },
        { emoji: "😱", text: "哇，这得意的表情，你是不是快通关了！" },
        { emoji: "😎", text: "别皮了，有种手速上见真章！" }
      ],
      "😤": [
        { emoji: "😂", text: "哎呀呀，急了急了！别气呀！" },
        { emoji: "😎", text: "淡定！生气是解不开这局棋的哦！" },
        { emoji: "🤪", text: "略略略，就不顺心了？那我就先消喽！" }
      ],
      "😱": [
        { emoji: "😄", text: "哈哈，是不是被我的闪电连消惊呆了！" },
        { emoji: "😎", text: "不用惊讶，这只是我本省名将的常规操作。" },
        { emoji: "🤪", text: "淡定点老铁，等会儿还有更绝的呢！" }
      ],
      "😎": [
        { emoji: "🤪", text: "装什么王牌呀！看我马上追上你的进度！" },
        { emoji: "😤", text: "哼！不要太骄傲，乾坤未定，你我皆是黑马！" },
        { emoji: "😱", text: "嘶……高手，这消除思路确实牛！" }
      ],
      "🥳": [
        { emoji: "🎉", text: "哇哦，提前弹冠相庆了嘛！" },
        { emoji: "😎", text: "好耶！两队一起冲，咱们都是家乡的骄傲！" },
        { emoji: "🤪", text: "同喜同喜，看咱们谁先消出金色烟花！" }
      ],
      "😭": [
        { emoji: "🤗", text: "别哭别哭，消不过我很正常的啦！" },
        { emoji: "👍", text: "摸摸头，其实你的底子很棒，只是卡槽满了！" },
        { emoji: "🤪", text: "哭唧唧什么，快打起精神连消扳回一局！" }
      ],
      "😮": [
        { emoji: "😄", text: "哈哈！是不是被我的三重消除惊掉了下巴！" },
        { emoji: "🔥", text: "不要太震惊，这可是我的黄金手速！" }
      ],
      "👿": [
        { emoji: "😤", text: "哇，好凶恶！我才不怕你的攻势呢！" },
        { emoji: "🤪", text: "小调皮，等我一个双重连消来化解你的煞气！" }
      ],
      "👍": [
        { emoji: "🤝", text: "谢老铁点赞！咱们高山流水，实力见真章！" },
        { emoji: "😎", text: "识货！不过接下来我可不会手下留情哦！" }
      ],
      "🔥": [
        { emoji: "🌊", text: "火气很旺啊！看我来一招冰封大解冻降降温！" },
        { emoji: "🔥", text: "战火熊熊！来，看谁的消除手速燃烧到最后！" }
      ]
    };

    const reactionPool = opponentMocks[emoji] || [
      { emoji: "😄", text: "打得不错，加油啊！" },
      { emoji: "😎", text: "实力较量，谁能笑到最后呢？" }
    ];

    // Opponent responds with random delay of 0.7s to 1.4s
    const delay = 700 + Math.random() * 700;
    setTimeout(() => {
      if (pvpState === "playing" && pvpOpponent) {
        const choice = reactionPool[Math.floor(Math.random() * reactionPool.length)];
        const oppId = Date.now();
        setOpponentActiveEmoji({ emoji: choice.emoji, id: oppId });
        
        // Spawn a beautiful floating cute emoji for the Opponent
        const oppFloatId = oppId;
        setFloatingEmojis(prev => [
          ...prev,
          {
            id: oppFloatId,
            emoji: choice.emoji,
            x: 55 + Math.random() * 25, // float on the opponent side (right-of-center)
            isOpponent: true
          }
        ]);
        setTimeout(() => {
          setFloatingEmojis(prev => prev.filter(item => item.id !== oppFloatId));
        }, 1800);

        setPvpFeeds(f => [
          `💬 ${pvpOpponent.name}: ${choice.emoji} ${choice.text}`,
          ...f.slice(0, 3)
        ]);

        // Auto-clear opponent's emoji bubble after 2 seconds
        setTimeout(() => {
          setOpponentActiveEmoji(curr => curr && curr.id === oppId ? null : curr);
        }, 2000);
      }
    }, delay);
  };

  const handleMuteToggle = () => {
    const mute = audio.toggleMute();
    setIsMuted(mute);
  };

  // Launch simulated WeChat mini game
  const handleLaunchGame = () => {
    audio.playTap();
    setGameState("loading");
    setLoadingProgress(0);
  };

  useEffect(() => {
    if (gameState === "loading") {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setGameState("lobby");
              audio.playLevelUp();
            }, 500);
            return 100;
          }
          return prev + Math.floor(Math.random() * 18) + 8;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  // Load level tiles
  const startLevel = (levelId: number) => {
    audio.playItem();
    setCurrentLevel(levelId);
    setLevelStartTimestamp(Date.now());
    setHasUsedMilestoneReviveToday(false);
    const tiles = applySkinToTiles(generateLevelTiles(levelId), activeSkinTheme);
    setActiveTiles(tiles);
    setTray([]);
    setHolder([]);
    setHistory([]);
    setUndoCount(levelId === 1 ? 5 : 2);
    setShuffleCount(levelId === 1 ? 5 : 2);
    setOutCount(levelId === 1 ? 5 : 2);
    setAddTimeCount(levelId <= 3 ? 1 : 2);
    setFreezeTimeCount(levelId <= 3 ? 1 : 2);
    setTimeFreezeLeft(0);
    setGameState("playing");
    setIsAnimating(false);
    setComboCount(0);
    setBlastNotice(null);

    // Dynamic progressive time-attack timer initialization (Level 1: 10s, Level 2: 20s, Level 3: 30s, increases by 10s up to max 60s)
    const levelDuration = Math.min(60, levelId * 10);
    
    setTimeLeft(levelDuration);
    setMaxTime(levelDuration);
    setFailReason("tray_full");

    // Trigger Interstitial ad simulated on level transition (35% chance)
    if (Math.random() < 0.35) {
      setTimeout(() => {
        onAdTrigger("interstitial");
      }, 800);
    }
  };

  // Reset/Replay current level
  const handleReplay = () => {
    startLevel(currentLevel);
  };

  // Click on a tile
  const handleTileClick = (tile: GameTile) => {
    if (gameState !== "playing" || tile.isLocked || isAnimating || tray.length >= 7) return;

    // Creative Rule 1: Ice-shattering Mechanic ("冰封阻碍")
    if (tile.isFrozen) {
      audio.playTap();
      // break standard ice state but don't move card to tray yet!
      setActiveTiles(prev => {
        const next = prev.map(t => t.id === tile.id ? { ...t, isFrozen: false } : t);
        return updateTileLocks(next);
      });
      // Show cool notice
      setBlastNotice(`❄️ 冰霜破碎！成功解锁 [${tile.label}]`);
      setTimeout(() => setBlastNotice(null), 1500);
      return;
    }

    audio.playTap();

    // Spawn custom mini tactile click sparkles at the clicked item's position
    const clickX = 160 + (tile.gridX * 18);
    const clickY = 160 + (tile.gridY * 18); 
    const clickSparkles: CleanParticle[] = [];
    const sparkleEmojis = ["✨", "🌟", "💫", "🌸", "💖"];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.random() * 0.5;
      const speed = Math.random() * 2.5 + 1.5;
      clickSparkles.push({
        id: `click-p-${Date.now()}-${i}-${Math.random()}`,
        x: clickX,
        y: clickY,
        symbol: sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)] || "✨",
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5, // float up slightly
        rotate: Math.random() * 180,
        scale: Math.random() * 0.45 + 0.4
      });
    }
    setMatchingParticles(prev => [...prev, ...clickSparkles]);
    setTimeout(() => {
      setMatchingParticles(prev => prev.filter(p => !clickSparkles.find(c => c.id === p.id)));
    }, 1200);
    
    // Save state history for UNDO ability
    setHistory(prev => [...prev, {
      active: JSON.parse(JSON.stringify(activeTiles)),
      tray: JSON.parse(JSON.stringify(tray)),
      holder: JSON.parse(JSON.stringify(holder))
    }]);

    // Remove tile from active board
    const nextActive = activeTiles.filter(t => t.id !== tile.id);
    const updatedBoard = updateTileLocks(nextActive);
    setActiveTiles(updatedBoard);

    // Push tile to bottom tray
    const nextTray = [...tray, tile];
    
    // Group similar tiles together to make it neat
    const groupedTray: GameTile[] = [];
    const symbolCounts: Record<string, number> = {};
    nextTray.forEach(t => {
      symbolCounts[t.symbol] = (symbolCounts[t.symbol] || 0) + 1;
    });

    const symbols = Array.from(new Set(nextTray.map(t => t.symbol)));
    symbols.forEach(symbol => {
      const matches = nextTray.filter(t => t.symbol === symbol);
      groupedTray.push(...matches);
    });

    setTray(groupedTray);
    audio.playSlide();

    // Trigger match check
    checkMatch(groupedTray, updatedBoard);
  };

  // Check if there is 3 of a kind in the tray
  const checkMatch = (currentTray: GameTile[], currentBoard: GameTile[]) => {
    const counts: Record<string, number> = {};
    let matchedSymbol: string | null = null;
    let matchedLabel: string = "萌宠";

    currentTray.forEach(t => {
      counts[t.symbol] = (counts[t.symbol] || 0) + 1;
      if (counts[t.symbol] === 3) {
        matchedSymbol = t.symbol;
        matchedLabel = t.label;
      }
    });

    if (matchedSymbol) {
      setIsAnimating(true);
      const symbolToMatch = matchedSymbol!;
      const matchingTiles = currentTray.filter(t => t.symbol === symbolToMatch);
      const matchingTileIds = matchingTiles.map(t => t.id);
      
      // Set the temporary elimination flag so they flash and scale up
      setEliminatingTileIds(matchingTileIds);
      
      // Spawn bursts of cute flying particles from the center matching coordinates
      const newParticles: CleanParticle[] = [];
      const symbols = ["✨", "💖", "🌸", "⭐", symbolToMatch, "🔥", "🌈", "🎈", "🎉", "🍬", "🍭", "🍀", "💫", "🍿", "🌟"];
      for (let i = 0; i < 26; i++) {
        const angle = (i / 26) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
        const speed = Math.random() * 7 + 5;
        newParticles.push({
          id: `p-${Date.now()}-${i}-${Math.random()}`,
          x: 160 + (Math.random() * 50 - 25), // tray center roughly
          y: 430, // tray vertical coordinate inside container (adjusted to match tray layer better)
          symbol: symbols[Math.floor(Math.random() * symbols.length)] || "⭐",
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (Math.random() * 5 + 4), // drift up beautifully!
          rotate: Math.random() * 360,
          scale: Math.random() * 0.8 + 0.6
        });
      }
      setMatchingParticles(prev => [...prev, ...newParticles]);

      setTimeout(() => {
        const remainingInTray = currentTray.filter(t => t.symbol !== symbolToMatch);
        setTray(remainingInTray);
        setEliminatingTileIds([]); // clear animation lock
        setIsAnimating(false);
        audio.playMatch();
        setComboCount(prev => prev + 1);
        
        // Track daily eliminated tiles for quests
        setDailyTilesEliminated(prev => {
          const next = prev + 3;
          try {
            localStorage.setItem("wechat_daily_tiles_eliminated", next.toString());
          } catch (e) {}
          return next;
        });
        
        // Clean up old match particles after 1.5 seconds to avoid performance footprints
        setTimeout(() => {
          setMatchingParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 1500);

        // Randomly drop a time booster item (25% chance of discovery)
        let dropNotice = "";
        if (Math.random() < 0.25) {
          const isFreezeItem = Math.random() < 0.5;
          if (isFreezeItem) {
            setFreezeTimeCount(prev => prev + 1);
            dropNotice = "🎁 拾得【冰冻时钟】！";
          } else {
            setAddTimeCount(prev => prev + 1);
            dropNotice = "🎁 拾得【加时沙漏】！";
          }
        }

        // Creative Rule 2: Fusion Combo Shockwave / Magic Barrier Pierce! ("合体破魔震荡")
        // To guarantee 100% mathematical solvability (divisible by 1), we DO NOT destroy cards!
        // Instead, we unleash a magical energy ripple that cracks ice overlays and lifts up to 2 locked tiles,
        // elevating them to Layer 0 to instantly release/unlock them for easy click-access!
        let thowedCount = 0;
        let unlockedCount = 0;
        
        // 1. Thaw up to 2 frozen blocks on the board
        const deicedBoard = currentBoard.map(t => {
          if (t.isFrozen && thowedCount < 2) {
            thowedCount++;
            return { ...t, isFrozen: false };
          }
          return t;
        });

        // 2. Lift up to 2 blocked/locked tiles to Layer 0
        const currentlyLocked = deicedBoard.filter(t => t.isLocked);
        const postBlastBoard = deicedBoard.map(t => {
          if (t.isLocked && currentlyLocked.slice(0, 2).some(lt => lt.id === t.id)) {
            unlockedCount++;
            return { ...t, layer: 0 }; // Lift up straight to surface layer
          }
          return t;
        });

        const updatedPostBlast = updateTileLocks(postBlastBoard);
        setActiveTiles(updatedPostBlast);
        currentBoard = updatedPostBlast;

        if (thowedCount > 0 || unlockedCount > 0 || dropNotice) {
          const mainBlast = (thowedCount > 0 || unlockedCount > 0)
            ? `🔮 触发【合体密奥义】！融化了 ${thowedCount} 处立式玄冰，成功破壁 ${unlockedCount} 灵宠！`
            : "🎉 巧手萌宠消除！";
          setBlastNotice(`${dropNotice ? dropNotice + " " : ""}${mainBlast}`);
          setTimeout(() => setBlastNotice(null), 3200);
        }

        // PvP Interactive Counter-attack
        if (isPvPMode && pvpState === "playing") {
          setOpponentProgress(prev => Math.max(0, prev - 4)); // Slow down opponent progress
          setPvpFeeds(prevFeeds => [
            `⚡ 你击出 3 连消宠兽合体！向对手倾泻[连消击退弹]，击退对方进度 4%！`,
            ...prevFeeds.slice(0, 3)
          ]);
        }

        // Check victory condition
        if (currentBoard.length === 0 && remainingInTray.length === 0 && holder.length === 0) {
          // Compute exact completion time taken
          const durationSecs = levelStartTimestamp > 0 
            ? Math.floor((Date.now() - levelStartTimestamp) / 1000) 
            : Math.floor(Math.random() * 20) + 40;

          // Adjust province average speed dynamically
          setProvinceAvgTimes(prev => {
            const prevAvg = prev[selectedProvince] || 75;
            const newAvg = Math.max(10, Math.floor((prevAvg * 4 + durationSecs) / 5));
            return { ...prev, [selectedProvince]: newAvg };
          });

          // Update user achievements
          if (isPvPMode) {
            const scoreReward = 1200;
            setUserBestScore(prev => Math.max(prev, scoreReward));
            setUserBestLevel(prev => Math.max(prev, currentLevel));
            setUserBestTime(prev => prev === 0 ? durationSecs : Math.min(prev, durationSecs));
          } else {
            const scoreReward = currentLevel * 250;
            if (currentLevel > userBestLevel) {
              setUserBestLevel(currentLevel);
              setUserBestScore(scoreReward);
              setUserBestTime(durationSecs);
            } else if (currentLevel === userBestLevel) {
              setUserBestScore(prev => Math.max(prev, scoreReward));
              setUserBestTime(prev => prev === 0 ? durationSecs : Math.min(prev, durationSecs));
            }
          }

          if (isPvPMode) {
            setPvpState("victory");
            audio.playLevelUp();
            const scoreReward = 1200; // PvP massive bonus points
            setProvinceScores(prev => ({
              ...prev,
              [selectedProvince]: (prev[selectedProvince] || 0) + scoreReward
            }));

            // Increment Win Streak and save to localStorage
            setPvpWinStreak(prev => {
              const next = prev + 1;
              localStorage.setItem("wechat_pvp_win_streak", next.toString());
              setPvpMaxStreak(maxPrev => {
                const newMax = Math.max(maxPrev, next);
                localStorage.setItem("wechat_pvp_max_streak", newMax.toString());
                return newMax;
              });
              showWechatToast(`🔥 连胜神绩！PVP 已砍下 ${next} 连胜！进入个人中心领取专属天梯里程碑大奖吧！`);
              return next;
            });

            setBattleFeeds(prev => [
              `🏆 【荣耀捷报】我省代表在1v1天梯赛中战战百胜，狂斩 [${pvpOpponent?.name}]！斩获 +${scoreReward} 荣耀积分！`,
              ...prev.slice(0, 3)
            ]);
          } else {
            setGameState("victory");
            audio.playLevelUp();
            
            // Boost chosen province score massively based on difficulty tier
            const scoreReward = currentLevel * 250;
            setProvinceScores(prev => ({
              ...prev,
              [selectedProvince]: (prev[selectedProvince] || 0) + scoreReward
            }));

            // Add user custom milestone to province ticker activity
            setBattleFeeds(prev => [
              `🎉 【捷报】我代表的 ${selectedProvince} 网友在 ${durationSecs} 秒内成功突破第 ${currentLevel} 关，为家乡 +${scoreReward} 点信仰声望！`,
              ...prev.slice(0, 3)
            ]);

            if (currentLevel < 15) {
              setCurrentLevel(currentLevel + 1);
            }
          }
        }
      }, 350);
    } else {
      // No match, check if tray is full (7 cards)
      if (currentTray.length >= 7) {
        setTimeout(() => {
          setComboCount(0);
          setGameState("revive_prompt");
          audio.playGameOver();
        }, 300);
      }
    }
  };

  // === Powerups IMPLEMENTATION ===

  // 1. Undo Powerup
  const handleUndo = () => {
    if (undoCount <= 0 && !cheatMode) {
      triggerRewardedAdPopup("powerup_undo");
      return;
    }
    if (history.length === 0) return;

    audio.playItem();
    const lastHistory = history[history.length - 1];
    setActiveTiles(lastHistory.active);
    setTray(lastHistory.tray);
    setHolder(lastHistory.holder);
    setHistory(prev => prev.slice(0, -1));

    if (!cheatMode) {
      setUndoCount(prev => prev - 1);
    }
  };

  // 2. Shuffle Powerup
  const handleShuffle = () => {
    if (shuffleCount <= 0 && !cheatMode) {
      triggerRewardedAdPopup("powerup_shuffle");
      return;
    }
    if (activeTiles.length === 0) return;

    audio.playItem();
    // Scramble locations randomly
    const scrambled = [...activeTiles].map((tile) => {
      const rx = (Math.random() * 3.4 - 1.7);
      const ry = (Math.random() * 3.4 - 1.7);
      return {
        ...tile,
        gridX: rx,
        gridY: ry,
      };
    });

    const updated = updateTileLocks(scrambled);
    setActiveTiles(updated);
    
    if (!cheatMode) {
      setShuffleCount(prev => prev - 1);
    }
  };

  // 3. Remove/Out Placement Powerup
  const handleOut = () => {
    if (outCount <= 0 && !cheatMode) {
      triggerRewardedAdPopup("powerup_out");
      return;
    }
    if (tray.length < 3) return; // Need at least some tiles to move out

    audio.playItem();
    const tilesToMove = tray.slice(0, 3);
    const remainingTray = tray.slice(3);

    setTray(remainingTray);
    setHolder(prev => [...prev, ...tilesToMove]);

    if (!cheatMode) {
      setOutCount(prev => prev - 1);
    }
  };

  // Back from hold storage area
  const handleHolderTileClick = (tile: GameTile) => {
    if (tray.length >= 7 || isAnimating) return;
    audio.playTap();

    setHolder(prev => prev.filter(t => t.id !== tile.id));
    const nextTray = [...tray, tile];
    setTray(nextTray);

    checkMatch(nextTray, activeTiles);
  };

  // === WeChat AD MONETIZATION SIMULATORS ===
  const triggerRewardedAdPopup = (purpose: "revive" | "powerup_undo" | "powerup_shuffle" | "powerup_out") => {
    setAdPurpose(purpose);
    setGameState("ad_watching");
    setAdTimer(15);
    audio.playAdStart();
    onAdTrigger("video"); // Notify Dashboard
  };

  // Ad watcher simulation tick countdown
  useEffect(() => {
    let adInterval: NodeJS.Timeout | null = null;
    if (gameState === "ad_watching" && adTimer > 0) {
      adInterval = setInterval(() => {
        setAdTimer(prev => prev - 1);
      }, 1000);
    } else if (gameState === "ad_watching" && adTimer === 0) {
      handleAdRewardSuccess();
    }
    return () => {
      if (adInterval) clearInterval(adInterval);
    };
  }, [gameState, adTimer]);

  const handleAdRewardSuccess = () => {
    audio.playAdComplete();
    
    if (adPurpose === "revive") {
      if (failReason === "time_out") {
        setTimeLeft(maxTime); // Give another round of full level time
      } else {
        const tilesToRevive = tray.slice(0, 3);
        setTray(tray.slice(3));
        setHolder(prev => [...prev, ...tilesToRevive]);
        // Also extend countdown time to at least 50% of level maximum (minimum 10 seconds)
        setTimeLeft(prev => Math.max(prev, Math.max(10, Math.floor(maxTime * 0.5))));
      }
      setGameState("playing");
    } else if (adPurpose === "powerup_undo") {
      setUndoCount(prev => prev + 1);
      setGameState("playing");
    } else if (adPurpose === "powerup_shuffle") {
      setShuffleCount(prev => prev + 1);
      setGameState("playing");
    } else if (adPurpose === "powerup_out") {
      setOutCount(prev => prev + 1);
      setGameState("playing");
    }
  };

  const handleCloseAdPrematurely = () => {
    audio.playTap();
    showWechatToast("⚠️ 广告中途退出，本轮未能获得复活或补给特权！");
    if (adPurpose === "revive") {
      setGameState("gameover");
    } else {
      setGameState("playing");
    }
  };

  const handleMilestoneFreeRevive = () => {
    try { audio.playAdComplete(); } catch (e) {} 
    setHasUsedMilestoneReviveToday(true);
    
    // Revive Logic matching original mechanics
    if (failReason === "time_out") {
      setTimeLeft(maxTime); // Give another round of full level time
    } else {
      const tilesToRevive = tray.slice(0, 3);
      setTray(tray.slice(3));
      setHolder(prev => [...prev, ...tilesToRevive]);
      setTimeLeft(prev => Math.max(prev, Math.max(10, Math.floor(maxTime * 0.5))));
    }
    
    setGameState("playing");
    setBlastNotice("🔥 【齐天大消】5连胜至尊特权已触发！已免看视频直接原地安全复活！");
    setTimeout(() => setBlastNotice(null), 3600);
  };

  const handleShareRevive = () => {
    if (shareReviveLeft <= 0 && !cheatMode) {
      showWechatToast("提示: 您今天的免费分享复活额度（3次）已用完，可以通过观看视频或寻友求助获得复活特权哦。");
      return;
    }
    
    // Process the simulated WeChat/Moments share animation success
    audio.playAdComplete(); // Play lovely validation sound
    if (!cheatMode) {
      setShareReviveLeft(prev => prev - 1);
    }
    
    // Revive Logic matching handleAdRewardSuccess
    if (failReason === "time_out") {
      setTimeLeft(maxTime); // Give another round of full level time
    } else {
      const tilesToRevive = tray.slice(0, 3);
      setTray(tray.slice(3));
      setHolder(prev => [...prev, ...tilesToRevive]);
      // Also extend countdown time to at least 50% of level maximum (minimum 10 seconds)
      setTimeLeft(prev => Math.max(prev, Math.max(10, Math.floor(maxTime * 0.5))));
    }
    
    setGameState("playing");
    setBlastNotice("🎉 一键分享成功！已免除出局惩罚并原地复活！");
    setTimeout(() => setBlastNotice(null), 3500);
  };

  const toggleCheat = () => {
    audio.playItem();
    if (cheatMode) {
      // Toggle off directly if already on
      setCheatMode(false);
      setIsVVIP(false);
      setBlastNotice("🔌 极速辅助特权已关闭，回归普通关卡挑战！");
      setTimeout(() => setBlastNotice(null), 2500);
    } else {
      // Open simulate billing gate to upgrade to Golden Finger!
      setPayModalOpen(true);
    }
  };

  // Dynamic Skin Themes & Referral Tracker methods
  const changeSkinTheme = (newTheme: string) => {
    setActiveSkinTheme(newTheme);
    localStorage.setItem("wechat_active_skin", newTheme);
    
    // Update active arrays to apply skins dynamically on current screen!
    setActiveTiles(prev => applySkinToTiles(prev, newTheme));
    setTray(prev => applySkinToTiles(prev, newTheme));
    setHolder(prev => applySkinToTiles(prev, newTheme));

    // Notice confirmation
    let themeName = "经典萌宠";
    if (newTheme === "cyber") themeName = "赛博霓虹科幻外观";
    if (newTheme === "candy") themeName = "缤纷甜品糖果皮肤";
    if (newTheme === "mythic") themeName = "山海神话国战守护兽";
    
    setWechatToast(`🎭 皮肤装扮成功切换为：【${themeName}】！`);
    setTimeout(() => {
      setWechatToast(null);
    }, 3000);
  };

  // Click on "模拟分享" button
  const triggerInviteShare = () => {
    audio.playTap();
    setWechatToast("📡 分享专属小程序卡片到群聊中...");
    setTimeout(() => {
      setWechatToast("✅ 邀请链接已送达！等待好友点击，也可一键【模拟好友加入】哦～");
      setTimeout(() => setWechatToast(null), 4000);
    }, 1200);
  };

  const simulateNewReferral = () => {
    audio.playAdComplete(); // success sound
    const debugNames = ["消消超算特工", "麻薯控喵酱", "全服天梯大佬", "吃瓜群众小明", "广东鸭嘴兽", "糖果守卫兵", "山海九荒仙灵", "考拉冲浪家"];
    const debugAvatars = ["🐼", "🐱", "🐰", "🦊", "🐯", "🐨", "🐸", "🦁"];
    
    const randomName = debugNames[Math.floor(Math.random() * debugNames.length)] + ` #${Math.floor(Math.random() * 900 + 100)}`;
    const randomAvatar = debugAvatars[Math.floor(Math.random() * debugAvatars.length)];
    
    const timestampStr = new Date().toLocaleTimeString("zh-CN", { hour: '2-digit', minute: '2-digit' }) + " 助力";
    const newFriend = {
      name: randomName,
      avatar: randomAvatar,
      date: timestampStr
    };

    const nextCount = referralsCount + 1;
    const nextList = [newFriend, ...invitedFriendsList];

    setReferralsCount(nextCount);
    setInvitedFriendsList(nextList);
    
    localStorage.setItem("wechat_referrals_count", String(nextCount));
    localStorage.setItem("wechat_invited_list", JSON.stringify(nextList));

    setWechatToast(`🎉 成功邀请好友 [${randomName}]，获得 1 点专属助力！`);
    setTimeout(() => setWechatToast(null), 4300);
  };

  // Sorted list of provinces for leaders with statistics like score, average time and pass rate
  const sortedProvincesOutput = PROVINCES.map(name => {
    const score = provinceScores[name] || 0;
    const avgTime = provinceAvgTimes[name] || 75;
    const avatar = PROVINCE_AVATARS[name] || "🏅";
    const passRate = Math.min(88, Math.max(5, Math.floor((score / 230000) * 100)));
    return { name, score, avgTime, avatar, passRate };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col items-center">
      
      {/* Phone Shell Header */}
      <div className="text-center mb-2 hidden md:block">
        <h3 className="text-xs font-mono font-medium text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Smartphone size={12} /> Playable WeChat Game (Creative Edition)
        </h3>
        <p className="text-[10px] text-slate-500 mt-1">
          创意玩法：合体爆破、冰封解除及变幻幻境。右侧查看实时变现后台！
        </p>
      </div>

      {/* Physical Simulator */}
      <div className={`relative w-full max-w-[400px] h-[755px] bg-slate-950 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 ring-10 ring-slate-900/40 select-none overflow-hidden flex flex-col transition-transform ${isCameraShaking ? "animate-camera-shake" : ""}`}>
        
        {/* Physical Camera Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-5 bg-black rounded-full z-50 flex items-center justify-center gap-1">
          <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full border border-zinc-800"></div>
          <div className="w-8 h-1 bg-zinc-900 rounded-full"></div>
        </div>

        {/* WeChat Native Status Bar */}
        <div className="flex justify-between items-center px-5 pt-3 pb-1 text-[11px] font-sans font-semibold text-zinc-100 z-40 bg-linear-to-b from-black/30 to-transparent">
          <span>{phoneTime}</span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <div className="w-4.5 h-2.5 rounded-[3px] border border-zinc-400 p-[1px] flex items-center">
              <div className="w-full h-full bg-emerald-400 rounded-[1px]"></div>
            </div>
            <span className="text-[9px]">5G</span>
            <span>📶</span>
          </div>
        </div>

        {/* Screen Content Container */}
        <div className="relative flex-1 bg-slate-50 rounded-2xl overflow-hidden flex flex-col text-slate-800">
          
          {/* WeChat Applet Header */}
          <div className="h-10 border-b border-zinc-100 bg-white/95 backdrop-blur-md px-3 flex justify-between items-center shrink-0 z-30">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400 text-xs">🏠</span>
              <span className="font-bold text-[11px] tracking-wide text-zinc-800 truncate max-w-[130px]">山海萌兽：啵啵消消大国战</span>
            </div>
            
            {/* WeChat Top capsule menu */}
            <div className="flex items-center gap-2 bg-zinc-100/90 hover:bg-zinc-200/90 transition-colors border border-zinc-200/50 py-1 px-2.5 rounded-full text-zinc-900 text-[10px] font-bold">
              <span className="cursor-pointer" onClick={() => { audio.playTap(); showWechatToast("微信开发者说明:\n此圆点代表微信胶囊菜单。你可以点击它退出小游戏或配置分享参数推广到各大地区群。"); }}>● ● ●</span>
              <div className="h-2.5 w-[1px] bg-zinc-300"></div>
              <span className="cursor-pointer text-xs leading-none" onClick={() => { audio.playTap(); setGameState("lobby") }}>☉</span>
            </div>
          </div>

          {/* Main Game Frame Container */}
          <div className="flex-1 relative flex flex-col bg-zinc-50 overflow-hidden">

            {/* WeChat Simulated Permission Dialog bottom sheet */}
            <AnimatePresence>
              {/* === REFERRAL REWARDS DIALOG (邀请好友得专属绝版皮肤) === */}
              {showReferralDialog && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-3.5 select-none font-sans text-zinc-900 leading-normal">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.4 }}
                    className="bg-gradient-to-b from-indigo-50 via-white to-rose-50 rounded-[28px] border border-white/40 w-full max-h-[92%] flex flex-col shadow-2xl relative overflow-hidden text-zinc-900"
                  >
                    {/* Header Banner Background Pattern */}
                    <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 p-4 shrink-0 text-white relative text-left select-none">
                      <div className="absolute right-4 top-2 text-2xl opacity-25 font-sans animate-pulse">✨</div>
                      <div className="absolute left-1/2 top-1 text-xs opacity-15 font-sans">🎁</div>
                      
                      <button 
                        onClick={() => {
                          audio.playTap();
                          setShowReferralDialog(false);
                        }}
                        className="absolute right-3.5 top-3 w-7 h-7 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all outline-none cursor-pointer"
                      >
                        ✕
                      </button>

                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl leading-none animate-bounce">🎁</span>
                        <div>
                          <h4 className="text-sm font-black tracking-wide">邀新有礼 • 绝版卡牌橱窗</h4>
                          <p className="text-[8.5px] text-pink-50/90 mt-0.5 font-bold">呼帮助友助力，赢取全套赛博与神话限定萌宠！</p>
                        </div>
                      </div>
                    </div>

                    {/* Scrollable Contents */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-left min-h-0">
                      {/* STATS OVERVIEW */}
                      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-zinc-200/50 flex justify-between items-center shadow-xs">
                        <div className="leading-tight">
                          <p className="text-[9px] text-zinc-400 font-bold">当前已成功邀约活跃好友：</p>
                          <p className="text-xl font-mono font-black text-rose-600 mt-1 flex items-baseline gap-1 leading-none">
                            {referralsCount} <span className="text-[10px] text-zinc-500 font-bold font-sans">位萌新加入</span>
                          </p>
                        </div>

                        {/* Interactive Reset Tool to play/test unlimited times */}
                        <button 
                          onClick={() => {
                            audio.playTap();
                            setReferralsCount(0);
                            setInvitedFriendsList([]);
                            localStorage.setItem("wechat_referrals_count", "0");
                            localStorage.setItem("wechat_invited_list", "[]");
                            changeSkinTheme("classic");
                            setWechatToast("🧹 数据已清零！关卡皮肤回复经典，可重新开始邀友测试～");
                            setTimeout(() => setWechatToast(null), 3000);
                          }}
                          className="px-2 py-1 bg-zinc-150 hover:bg-zinc-200 text-zinc-500 rounded-lg text-[8.5px] font-bold cursor-pointer"
                          title="测试清零"
                        >
                          🔄 重置测试
                        </button>
                      </div>

                      {/* MILESTONES PROGRESION LIST */}
                      <div className="space-y-3">
                        <p className="text-[9.5px] font-black text-zinc-400 tracking-wider uppercase">🌟 邀人里程碑及绝版皮肤大奖：</p>

                        {/* TIER 1: CYBER SKIN */}
                        {(() => {
                          const isUnlocked = referralsCount >= 1;
                          const isEquipped = activeSkinTheme === "cyber";
                          return (
                            <div className={`p-3 rounded-2xl border transition-all flex items-center justify-between shadow-xs ${
                              isEquipped 
                                ? "bg-indigo-950/90 border-cyan-400 text-white" 
                                : isUnlocked 
                                  ? "bg-white border-zinc-200/50 hover:bg-zinc-50 text-zinc-900"
                                  : "bg-zinc-100/50 border-zinc-250 opacity-80 text-zinc-900"
                            }`}>
                              <div className="flex gap-2.5 items-center min-w-0">
                                <span className={`text-2.5xl leading-none w-11 h-11 rounded-xl flex items-center justify-center shadow-xs shrink-0 ${
                                  isEquipped 
                                    ? "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40" 
                                    : "bg-indigo-50 border border-indigo-100 text-zinc-900"
                                }`}>
                                  🤖
                                </span>
                                <div className="leading-tight min-w-0">
                                  <h5 className={`text-[10.5px] font-black ${isEquipped ? "text-cyan-300" : "text-zinc-800"}`}>
                                    第一重礼：赛博重装喵 / 电子朋克兔组合
                                  </h5>
                                  <p className={`text-[8px] mt-0.5 font-bold ${isEquipped ? "text-cyan-200" : "text-slate-400"}`}>
                                    需求: 邀请 <span className="font-mono text-rose-500 font-black">1</span> 名好友助威 • 【100%全卡牌重塑霓虹画画】
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 pl-1.5">
                                {isUnlocked ? (
                                  <button
                                    onClick={() => changeSkinTheme(isEquipped ? "classic" : "cyber")}
                                    className={`px-2.5 py-1.5 rounded-lg text-[8.5px] font-black shadow-xs transition-colors cursor-pointer ${
                                      isEquipped 
                                        ? "bg-cyan-400 text-slate-900 border border-cyan-305" 
                                        : "bg-zinc-800 text-white hover:bg-zinc-700"
                                    }`}
                                  >
                                    {isEquipped ? "卸下" : "装扮"}
                                  </button>
                                ) : (
                                  <div className="bg-zinc-200 text-zinc-500 border border-zinc-250 font-bold px-2 py-1 rounded-lg text-[8px] tracking-wide shrink-0">
                                    🔒 邀1人
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* TIER 2: CANDY SKIN */}
                        {(() => {
                          const isUnlocked = referralsCount >= 2;
                          const isEquipped = activeSkinTheme === "candy";
                          return (
                            <div className={`p-3 rounded-2xl border transition-all flex items-center justify-between shadow-xs ${
                              isEquipped 
                                ? "bg-rose-50 border-rose-350 text-zinc-900" 
                                : isUnlocked 
                                  ? "bg-white border-zinc-200/50 hover:bg-zinc-50 text-zinc-900"
                                  : "bg-zinc-100/50 border-zinc-250 opacity-80 text-zinc-900"
                            }`}>
                              <div className="flex gap-2.5 items-center min-w-0">
                                <span className={`text-2.5xl leading-none w-11 h-11 rounded-xl flex items-center justify-center shadow-xs shrink-0 ${
                                  isEquipped 
                                    ? "bg-rose-100/80 text-rose-500 ring-1 ring-rose-300" 
                                    : "bg-rose-50 border border-rose-100 text-zinc-900"
                                }`}>
                                  🍩
                                </span>
                                <div className="leading-tight min-w-0">
                                  <h5 className={`text-[10.5px] font-black ${isEquipped ? "text-rose-650" : "text-zinc-800"}`}>
                                    第二重礼：缤纷甜品糖果系列外观
                                  </h5>
                                  <p className={`text-[8px] mt-0.5 font-bold ${isEquipped ? "text-rose-500" : "text-slate-400"}`}>
                                    需求: 邀请 <span className="font-mono text-rose-500 font-black">2</span> 名好友助威 • 【美味草莓甜圈/舒芙蕾系列】
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 pl-1.5">
                                {isUnlocked ? (
                                  <button
                                    onClick={() => changeSkinTheme(isEquipped ? "classic" : "candy")}
                                    className={`px-2.5 py-1.5 rounded-lg text-[8.5px] font-black shadow-xs transition-colors cursor-pointer ${
                                      isEquipped 
                                        ? "bg-rose-500 text-white" 
                                        : "bg-zinc-800 text-white hover:bg-zinc-700"
                                    }`}
                                  >
                                    {isEquipped ? "卸下" : "装扮"}
                                  </button>
                                ) : (
                                  <div className="bg-zinc-200 text-zinc-500 border border-zinc-250 font-bold px-2 py-1 rounded-lg text-[8px] tracking-wide shrink-0">
                                    🔒 邀2人
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* TIER 3: MYTHIC SKIN */}
                        {(() => {
                          const isUnlocked = referralsCount >= 3;
                          const isEquipped = activeSkinTheme === "mythic";
                          return (
                            <div className={`p-3 rounded-2xl border transition-all flex items-center justify-between shadow-xs ${
                              isEquipped 
                                ? "bg-amber-50 border-yellow-405 text-zinc-900" 
                                : isUnlocked 
                                  ? "bg-white border-zinc-200/50 hover:bg-zinc-50 text-zinc-900"
                                  : "bg-zinc-100/50 border-zinc-250 opacity-80 text-zinc-900"
                            }`}>
                              <div className="flex gap-2.5 items-center min-w-0">
                                <span className={`text-2.5xl leading-none w-11 h-11 rounded-xl flex items-center justify-center shadow-xs shrink-0 ${
                                  isEquipped 
                                    ? "bg-amber-100 text-amber-600 ring-2 ring-yellow-400/40" 
                                    : "bg-amber-50 border border-amber-100 text-zinc-900"
                                }`}>
                                  🐲
                                </span>
                                <div className="leading-tight min-w-0">
                                  <h5 className={`text-[10.5px] font-black ${isEquipped ? "text-amber-700" : "text-zinc-800"}`}>
                                    终极大礼：山海神兽•九天瑞龙外观
                                  </h5>
                                  <p className={`text-[8px] mt-0.5 font-bold ${isEquipped ? "text-amber-600" : "text-slate-400"}`}>
                                    需求: 邀请 <span className="font-mono text-rose-500 font-black">3</span> 名好友助威 • 【国风朱雀玄武尊享古籍神兽】
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 pl-1.5">
                                {isUnlocked ? (
                                  <button
                                    onClick={() => changeSkinTheme(isEquipped ? "classic" : "mythic")}
                                    className={`px-2.5 py-1.5 rounded-lg text-[8.5px] font-black shadow-xs transition-colors cursor-pointer ${
                                      isEquipped 
                                        ? "bg-amber-500 text-white" 
                                        : "bg-zinc-800 text-white hover:bg-zinc-700"
                                    }`}
                                  >
                                    {isEquipped ? "卸下" : "装扮"}
                                  </button>
                                ) : (
                                  <div className="bg-zinc-200 text-zinc-500 border border-zinc-250 font-bold px-2 py-1 rounded-lg text-[8px] tracking-wide shrink-0">
                                    🔒 邀3人
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* GAME CHANGER ACTION BUTTON GROUP */}
                      <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-3 space-y-2">
                        <p className="text-[9px] font-black text-amber-800 tracking-wide">🎮 邀请与测试仿真控制台：</p>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={triggerInviteShare}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-2 rounded-xl text-[10px] font-black shadow-xs hover:shadow-md transition-all duration-200 outline-none flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>💬</span> 发送邀请卡片
                          </button>
                          
                          <button
                            onClick={simulateNewReferral}
                            className="w-full bg-linear-to-r from-pink-500 to-rose-500 hover:brightness-105 text-white py-2 px-2 rounded-xl text-[10px] font-black shadow-xs hover:shadow-md transition-all duration-200 outline-none flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>⚡</span> 模拟好友加入
                          </button>
                        </div>
                        <p className="text-[8px] text-zinc-400 font-medium leading-relaxed italic text-center">
                          由于演示系统处于闭环沙盒状态，点击【发送邀请卡片】将为您拉起群聊分享，点击【模拟好友加入】可以仿真新用户助力，从而瞬间达成契约解锁全部重装国风外观！
                        </p>
                      </div>

                      {/* MY REFERRALS LIST */}
                      <div className="bg-white rounded-2xl p-3 border border-zinc-200 shadow-inner">
                        <p className="text-[9px] font-black text-zinc-500 mb-2 flex justify-between items-center">
                          <span>👥 已加入的好友 ({invitedFriendsList.length})</span>
                          <span className="text-[7.5px] text-emerald-500 font-bold flex items-center gap-0.5">
                            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span> Live 实时
                          </span>
                        </p>
                        
                        {invitedFriendsList.length === 0 ? (
                          <div className="text-center py-4 text-zinc-400 leading-normal">
                            <span className="text-xl inline-block mb-1 font-sans">🦁</span>
                            <p className="text-[8px] font-bold">暂无邀请记录，快去点击上方模拟加入吧！</p>
                          </div>
                        ) : (
                          <div className="max-h-[105px] overflow-y-auto space-y-1.5 pr-0.5 select-none">
                            {invitedFriendsList.map((friend, index) => (
                              <div key={index} className="flex justify-between items-center bg-zinc-50 border border-zinc-150 p-2 rounded-xl text-left">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-lg leading-none p-1 bg-white border border-zinc-200 rounded-lg shadow-2xs shrink-0 flex items-center justify-center w-7 h-7 font-sans">
                                    {friend.avatar}
                                  </span>
                                  <div className="leading-tight min-w-0">
                                    <h6 className="text-[9px] font-black text-zinc-800 truncate">{friend.name}</h6>
                                    <p className="text-[7.5px] font-bold text-emerald-500 flex items-center gap-0.5 mt-0.5">
                                      已成功绑定服务器助力
                                    </p>
                                  </div>
                                </div>
                                <span className="text-[7.5px] text-zinc-400 font-mono font-bold shrink-0">{friend.date}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-2.5 bg-zinc-50 border-t border-zinc-250 shrink-0 text-center select-none rounded-b-[28px]">
                      <p className="text-[7.5px] text-zinc-400 font-sans tracking-wide">
                        🔐 所有邀请徽章与皮肤状态均在浏览器本地高保真安全存盘。
                      </p>
                    </div>
                  </motion.div>
                </div>
              )}

              {showWechatLoginPrompt && (
                <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end select-none">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white rounded-t-[28px] border-t border-zinc-200/50 p-4 pb-6 flex flex-col gap-3 max-h-[92%] overflow-y-auto text-left shadow-2xl relative"
                  >
                    {/* Top cute decor pull bar */}
                    <div className="w-10 h-1 bg-zinc-300 rounded-full mx-auto shrink-0 mb-1"></div>
                    
                    {/* Header */}
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💬</span>
                      <div>
                        <h4 className="text-[11px] font-black text-zinc-900 leading-tight">微信登录及公开授权</h4>
                        <p className="text-[8px] text-zinc-400 mt-0.5 font-sans">由微信安全沙盒协议支持</p>
                      </div>
                    </div>
                    
                    <div className="h-[1px] bg-zinc-100 my-0.5 shrink-0"></div>

                    {/* Permission text */}
                    <div>
                      <p className="text-[10px] font-extrabold text-zinc-700 leading-snug">
                        <strong>「山海萌兽：啵啵消消大国战」</strong>申请合规使用您的微信公开资料，以便实时载入地区总榜以及好友天梯对战：
                      </p>
                    </div>

                    {/* Customizing profile preview card */}
                    <div className="bg-zinc-50 border border-zinc-200/60 p-2.5 rounded-2xl flex flex-col gap-2">
                      <span className="text-[8px] text-zinc-400 font-extrabold block">👀 授权使用的微信名片预览：</span>
                      
                      <div className="flex items-center gap-3 bg-white border border-zinc-200 p-2 rounded-xl">
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-amber-50 rounded-xl border border-rose-250 flex items-center justify-center text-2xl relative shadow-inner shrink-0">
                          {tempWechatAvatar}
                          <span className="absolute -bottom-1 -right-1 text-[8.5px] bg-emerald-500 rounded-full p-0.5 text-white leading-none">✓</span>
                        </div>
                        
                        {/* Nickname input */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[7.5px] text-zinc-400 block font-sans">我的公开昵称</span>
                          <div className="flex gap-1 items-center mt-1">
                            <input 
                              type="text"
                              value={tempWechatNickname}
                              onChange={(e) => setTempWechatNickname(e.target.value.slice(0, 15))}
                              maxLength={12}
                              className="flex-1 bg-zinc-50 font-black text-[10px] text-zinc-800 px-1.5 py-0.5 rounded border border-zinc-300 focus:outline-emerald-400"
                              placeholder="微信名号..."
                            />
                            
                            <button
                              onClick={() => {
                                try { audio.playTap(); } catch(e){}
                                const prefixes = ["糖醋", "芝士", "焦糖", "抹茶", "草莓", "麻椰", "布丁", "流心", "爆浆", "香芋"];
                                const bodies = ["开心兔", "霸王猫", "大头熊", "憨憨鼠", "呆萌企鹅", "暴走犬", "多肉考拉", "大眼狗"];
                                const emojis = ["🐰", "🦊", "🐼", "🐹", "🐱", "🐯", "🐨", "🥑", "🦁", "🐧"];
                                const randPre = prefixes[Math.floor(Math.random() * prefixes.length)];
                                const randBod = bodies[Math.floor(Math.random() * bodies.length)];
                                const randEmo = emojis[Math.floor(Math.random() * emojis.length)];
                                setTempWechatNickname(`${randPre}${randBod} ${randEmo}`);
                                setTempWechatAvatar(randEmo);
                              }}
                              className="px-2 py-1 bg-rose-50 text-[8.5px] border border-rose-200 hover:bg-rose-100 rounded-lg font-black text-rose-600 cursor-pointer shrink-0"
                            >
                              🎲 随机
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Select Avatar Tray */}
                      <div className="space-y-1">
                        <span className="text-[7.5px] text-zinc-400 block leading-none">挑选您的本命萌宠头像：</span>
                        <div className="flex justify-between gap-1.5 pt-0.5 pb-1 overflow-x-auto">
                          {["🐰", "🦊", "🐼", "🐹", "🐱", "🐯", "🐨", "🦁", "🐧", "🥑"].map((emo) => (
                            <button
                              key={emo}
                              onClick={() => {
                                try { audio.playTap(); } catch(e){}
                                setTempWechatAvatar(emo);
                              }}
                              className={`w-7.5 h-7.5 rounded-lg text-lg flex items-center justify-center transition border ${tempWechatAvatar === emo ? 'border-rose-500 bg-rose-100/50 scale-110' : 'border-zinc-200 bg-white hover:bg-zinc-100'} cursor-pointer shrink-0`}
                            >
                              {emo}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Operational row buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-1.5 shrink-0">
                      <button
                        onClick={() => {
                          try { audio.playTap(); } catch(e){}
                          setShowWechatLoginPrompt(false);
                          setUserNickname("匿名游客朋友");
                          setUserAvatar("🐰");
                          setIsWechatLoggedIn(false);
                          handleLaunchGame();
                          showWechatToast("🐾 已以游客玩家身份登录，可随时在个人中心开启微信登录！");
                        }}
                        className="py-2.5 bg-zinc-150 hover:bg-zinc-250 text-zinc-650 font-extrabold rounded-2xl text-[10px] text-center border border-zinc-200 cursor-pointer"
                      >
                        拒绝
                      </button>
                      
                      <button
                        onClick={() => {
                          try { audio.playTap(); audio.playLevelUp(); } catch(e){}
                          setShowWechatLoginPrompt(false);
                          setIsWechatLoggedIn(true);
                          if (tempWechatNickname.trim()) {
                            setUserNickname(tempWechatNickname.trim());
                          } else {
                            setUserNickname("消消小灵兽");
                          }
                          setUserAvatar(tempWechatAvatar);
                          handleLaunchGame();
                        }}
                        className="py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl text-[10px] text-center border border-emerald-600 cursor-pointer animate-pulse shadow-md shadow-emerald-500/25"
                      >
                        允许并登录游戏
                      </button>
                    </div>

                    <p className="text-[7px] text-zinc-400 text-center leading-normal font-sans">
                      授权完成后，您的战历将直接计入微信排行榜中，并自动获得「派对新星」特色认证标识。
                    </p>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* LOBBY / MAIN WELCOME VIEW */}
            {gameState === "welcome" && (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-gradient-to-b from-pink-50 via-white to-amber-50 flex flex-col p-6 items-center justify-between"
              >
                {/* Visual background dynamic symbols */}
                <div className="absolute inset-0 z-10 pointer-events-none opacity-30 select-none overflow-hidden">
                  <span className="absolute top-[10%] left-[8%] text-3xl animate-bounce delay-100">🥑</span>
                  <span className="absolute top-[28%] left-[15%] text-2xl animate-pulse delay-300">🐱</span>
                  <span className="absolute bottom-[20%] left-[10%] text-2xl animate-pulse delay-200">🦁</span>
                  <span className="absolute top-[15%] right-[8%] text-3xl animate-bounce delay-500">🌟</span>
                  <span className="absolute bottom-[15%] right-[15%] text-2xl animate-pulse">☁️</span>
                  <span className="absolute top-[50%] right-[12%] text-2xl animate-bounce">🎈</span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center mt-6 relative z-15">
                  {/* Multi-pet animated bouncing mascot */}
                  <div className="relative mb-3 select-none">
                    <motion.div
                      animate={{ 
                        y: [0, -14, 0],
                        rotate: [-3, 3, -3]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2.4, 
                        ease: "easeInOut" 
                      }}
                      className="text-8xl drop-shadow-xl relative"
                    >
                      🦊
                      <span className="absolute -top-1 -right-1 text-4xl animate-pulse">👑</span>
                      <span className="absolute -bottom-1 -left-2 text-4xl animate-bounce">🐰</span>
                    </motion.div>
                    
                    {/* Aura shadow underneath mascot */}
                    <div className="w-16 h-2 bg-rose-900/10 rounded-full mx-auto blur-[2px] mt-1.5 animate-pulse"></div>
                  </div>
                  
                  <h1 className="text-xl font-black text-rose-600 tracking-wider flex flex-col items-center justify-center gap-1 font-sans">
                    <span className="scale-75 text-2xl">🌈</span>山海萌兽：啵啵消消大国战
                  </h1>
                  
                  <div className="py-0.5 px-3 bg-rose-500/10 rounded-full border border-pink-200 mt-1 max-w-[250px]">
                    <p className="text-[9px] font-black text-pink-700 tracking-widest leading-relaxed">
                      🔥 啵啵超燃合体 • 全民萌宠消消大国战 🔥
                    </p>
                  </div>

                  <p className="text-[10px] text-rose-800/80 px-4 mt-3 leading-relaxed max-w-[260px] font-medium font-sans">
                    点击啵啵爆萌宠，觉醒究极合体超能元素气场！快快点击微信授权登录，加入您的省市为国战荣耀加冕吧！🎐
                  </p>
                </div>

                {/* Interactive Action Forms */}
                <div className="w-full space-y-2 mb-4 relative z-20 select-none">
                  {/* Simulated WeChat Autologin buttons */}
                  <button 
                    onClick={prepareWechatPrompt}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-600 active:scale-95 transition-all text-white font-black rounded-2xl shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 text-xs cursor-pointer animate-pulse"
                  >
                    <span className="text-sm">💬</span> 微信一键安全授权登录
                  </button>
                  
                  <button 
                    onClick={() => {
                      audio.playTap();
                      setUserNickname("匿名消消萌友");
                      setUserAvatar("🐰");
                      setIsWechatLoggedIn(false);
                      handleLaunchGame();
                      showWechatToast("🐾 已以游客玩家身份登录，可随时在个人中心开启微信登录！");
                    }}
                    className="w-full py-2 px-4 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 active:scale-95 transition-all text-white font-black rounded-xl shadow-xs flex items-center justify-center gap-1 text-[11px] cursor-pointer text-amber-50"
                  >
                    <span>⚡</span> 游客快捷直接免登录进入
                  </button>
                  
                  <div className="flex items-center justify-center gap-1.5 text-[8.5px] text-zinc-400 pt-1 font-sans">
                    <input type="checkbox" defaultChecked className="rounded border-zinc-300 text-rose-500 focus:ring-0 cursor-pointer" id="agree-terms" />
                    <label htmlFor="agree-terms" className="cursor-pointer">同意《萌宠隐私保护认证》及《微信平台规则》</label>
                  </div>
                </div>
              </motion.div>
            )}

              {/* LOADER */}
              {gameState === "loading" && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-b from-pink-50 via-white to-amber-50 flex flex-col items-center justify-between p-8"
                >
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative w-20 h-20 mb-5">
                      {/* Nested double spinning circles in cute rose/emerald colors */}
                      <div className="absolute inset-0 border-4 border-pink-100 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-rose-400 rounded-full border-t-transparent animate-spin duration-1000"></div>
                      <div className="absolute inset-2 border-2 border-emerald-100 rounded-full"></div>
                      <div className="absolute inset-2 border-2 border-emerald-400 rounded-full border-b-transparent animate-spin duration-700 reverse-spin"></div>
                      <span className="absolute inset-0 flex items-center justify-center text-3xl animate-bounce">
                        {userAvatar || "🦊"}
                      </span>
                    </div>
                    
                    <h4 className="text-xs font-black text-rose-600 tracking-wider flex items-center gap-1 animate-pulse">
                      ✨ 萌宠集结完毕 ✨
                    </h4>
                    
                    <p className="text-[9px] text-zinc-500 mt-1 font-sans font-bold">
                      正在为您同步微信安全信息汇入全服排行榜 ({loadingProgress}%)
                    </p>
                    <p className="text-[8px] text-zinc-400/80 mt-1 text-center max-w-[200px] leading-relaxed">
                      💡 提示：将小游戏分享到群聊，可直接与微信好友在线天梯PK，更有保命气场福袋！
                    </p>
                  </div>

                  <div className="w-full mb-8">
                    <div className="w-full bg-zinc-100 h-2 rounded-full p-[1px] border border-zinc-250 select-none overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-pink-400 via-rose-500 to-emerald-500 h-full rounded-full transition-all duration-100"
                        style={{ width: `${loadingProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* LOBBY WITH DUAL TABS */}
              {gameState === "lobby" && (
                <motion.div 
                  key="lobby"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-teal-50 to-rose-50 p-3 flex flex-col justify-between"
                >
                  
                  {/* Province Selector Header */}
                  <div className="shrink-0 bg-white/80 backdrop-blur-md rounded-2xl p-2.5 border border-zinc-200/50 shadow-xs mb-1">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1">
                        <MapPin size={11} className="text-rose-500 animate-bounce" /> 代表我的本命出战：
                      </span>
                      
                      {/* Audio switch */}
                      <button 
                        onClick={handleMuteToggle}
                        className="p-1 bg-zinc-105 hover:bg-zinc-205 rounded-lg text-zinc-600"
                      >
                        {isMuted ? <VolumeX size={11} /> : <Volume2 size={11} />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <select 
                        value={selectedProvince}
                        onChange={(e) => {
                          audio.playTap();
                          setSelectedProvince(e.target.value);
                        }}
                        className="flex-1 text-xs font-bold bg-zinc-50 border border-zinc-200 p-1.5 rounded-xl text-zinc-805 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        {PROVINCES.map(prov => (
                          <option key={prov} value={prov}>
                            {PROVINCE_AVATARS[prov] || "🛡️"} {prov}
                          </option>
                        ))}
                      </select>

                      <div className="bg-rose-50 border border-rose-200 px-2 py-1.5 rounded-xl text-center self-stretch flex items-center">
                        <span className="text-[10px] font-black font-mono text-rose-600 block leading-tight">
                          战绩 {provinceScores[selectedProvince] || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Quadruple Tabs Headers */}
                  <div className="shrink-0 flex bg-zinc-200/60 rounded-xl p-0.5 gap-0.5 my-1.5">
                    <button 
                      onClick={() => { audio.playTap(); setLobbyTab("levels"); }}
                      className={`flex-1 py-1.5 text-[9px] sm:text-[9.5px] font-black rounded-lg transition-all ${
                        lobbyTab === "levels" 
                          ? "bg-white text-zinc-800 shadow-xs" 
                          : "text-zinc-500 hover:text-zinc-700"
                      }`}
                    >
                      🎯 关卡挑战
                    </button>
                    <button 
                      onClick={() => { audio.playTap(); setLobbyTab("pvp_lobby"); }}
                      className={`flex-1 py-1.5 text-[9px] sm:text-[9.5px] font-black rounded-lg transition-all relative ${
                        lobbyTab === "pvp_lobby" 
                          ? "bg-white text-zinc-800 shadow-xs" 
                          : "text-zinc-500 hover:text-zinc-700"
                      }`}
                    >
                      ⚔️ 1v1排位
                      <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5 font-sans">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                    </button>
                    <button 
                      onClick={() => { audio.playTap(); setLobbyTab("ranking"); }}
                      className={`flex-1 py-1.5 text-[9px] sm:text-[9.5px] font-black rounded-lg transition-all ${
                        lobbyTab === "ranking" 
                          ? "bg-white text-zinc-805 shadow-xs" 
                          : "text-zinc-500 hover:text-zinc-700"
                      }`}
                    >
                      🏆 全国天梯
                    </button>
                    <button 
                      onClick={() => { audio.playTap(); setLobbyTab("profile"); }}
                      className={`flex-1 py-1.5 text-[9px] sm:text-[9.5px] font-black rounded-lg transition-all ${
                        lobbyTab === "profile" 
                          ? "bg-white text-zinc-800 shadow-xs" 
                          : "text-zinc-500 hover:text-zinc-700"
                      }`}
                    >
                      👤 个人中心
                    </button>
                  </div>

                  {/* TAB CONTENT DECISION LAYER */}
                  <div className="flex-1 overflow-y-auto pr-1 space-y-2 select-none">
                    {lobbyTab === "levels" ? (
                      <div className="space-y-3.5 text-left text-zinc-900">
                        {/* REFERRAL REWARDS PROMOTIONAL BANNER */}
                        <div 
                          onClick={() => {
                            audio.playTap();
                            setShowReferralDialog(true);
                          }}
                          className="relative overflow-hidden rounded-2xl p-3 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white min-h-[60px] flex items-center justify-between shadow-xs cursor-pointer border border-pink-400/25 hover:brightness-105 active:scale-[0.99] transition-all group select-none"
                        >
                          <div className="absolute -right-1 -bottom-2 text-5xl opacity-20 group-hover:scale-110 transition-transform duration-300 pointer-events-none font-sans">
                            🎁
                          </div>
                          
                          <div className="flex-1 flex items-center gap-2.5 z-10 min-w-0">
                            <span className="text-2xl leading-none animate-bounce shrink-0 p-1 rounded-xl bg-white/20 font-sans">
                              🎁
                            </span>
                            <div className="leading-tight min-w-0">
                              <h4 className="text-[10.5px] font-black tracking-wide flex items-center gap-1.5">
                                邀人得限量绝版皮肤
                                <span className="bg-white/20 text-[6.5px] text-zinc-50 font-sans py-0.5 px-1 rounded-sm uppercase tracking-wider scale-90 block animate-pulse shrink-0">限定限量</span>
                              </h4>
                              <p className="text-[8px] text-pink-100/95 mt-0.5 font-bold truncate">
                                呼朋唤友助力通关，免费领取【赛博重装】【山海圣兽】等萌物！
                              </p>
                            </div>
                          </div>
                          
                          <div className="shrink-0 flex flex-col items-end z-10 pl-2">
                            <span className="bg-yellow-400 font-sans font-black text-[8.5px] text-rose-800 px-2 py-1 rounded-lg shadow-sm">
                              领特权 ➔
                            </span>
                            <span className="text-[7.5px] text-white/80 font-mono mt-1 font-bold">已助力: {referralsCount}人</span>
                          </div>
                        </div>

                        {/* NEW: GAME LOBBY DAILY QUESTS */}
                        <div className="bg-gradient-to-br from-indigo-50/45 via-white to-purple-50/45 border border-indigo-200/50 rounded-2xl p-3 shadow-xs space-y-2.5">
                          <div className="flex justify-between items-center select-none">
                            <span className="text-[10px] sm:text-[10.5px] font-black text-indigo-900 flex items-center gap-1">
                              📅 每日修行任务 (Daily Quests)
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[7px] text-zinc-400 font-mono font-bold bg-white px-1.5 py-0.5 border border-zinc-200 rounded-lg">
                                已领: {claimedDailyQuests.length}/3
                              </span>
                              <button
                                onClick={resetDailyQuests}
                                className="text-[7px] sm:text-[7.5px] text-zinc-500 hover:text-indigo-600 font-bold px-1.5 py-0.5 rounded border border-zinc-200 hover:bg-zinc-100 transition active:scale-95 flex items-center gap-0.5 bg-white scale-95"
                                title="测试: 重置每日任务"
                              >
                                🔄 重置
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {/* Quest 1 */}
                            {(() => {
                              const q1Goal = 15;
                              const q1Progress = Math.min(q1Goal, dailyTilesEliminated);
                              const q1Pct = Math.round((q1Progress / q1Goal) * 100);
                              const q1Completed = dailyTilesEliminated >= q1Goal;
                              const q1Claimed = claimedDailyQuests.includes("q1");

                              return (
                                <div className={`p-2 rounded-xl border transition ${
                                  q1Claimed 
                                    ? "bg-zinc-50/70 border-zinc-200 text-zinc-400" 
                                    : q1Completed 
                                      ? "bg-emerald-50/40 border-emerald-300 text-zinc-805 ring-1 ring-emerald-300/20" 
                                      : "bg-white border-zinc-150 text-zinc-805"
                                }`}>
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="text-left leading-tight min-w-0 flex-1">
                                      <p className="text-[9.5px] font-black flex items-center gap-1.5 text-zinc-800">
                                        <span>🎯</span> 小试身手
                                        {q1Claimed && <span className="text-[6.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-250 px-1 rounded-sm leading-none shrink-0">已完成领受</span>}
                                      </p>
                                      <p className="text-[7.5px] text-slate-500 font-semibold mt-0.5">
                                        任务：今日在关卡中累计消除 {q1Goal} 张卡牌。
                                      </p>
                                      <p className="text-[7.5px] text-indigo-700 font-black mt-1">
                                        奖励：撤销道具 x1、冻结时钟 x1
                                      </p>
                                    </div>

                                    <div className="shrink-0 flex flex-col items-end gap-1 select-none">
                                      {q1Claimed ? (
                                        <span className="text-[7.5px] text-zinc-400 font-black">✔ 已领</span>
                                      ) : q1Completed ? (
                                        <button
                                          onClick={() => claimDailyQuest("q1", "小试身手")}
                                          className="text-[7.5px] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold px-2 py-0.7 rounded-lg shadow-xs transition active:scale-95 animate-pulse cursor-pointer"
                                        >
                                          🎁 领道具
                                        </button>
                                      ) : (
                                        <span className="text-[7.5px] text-zinc-400 font-mono font-black bg-zinc-100 border border-zinc-250 px-1.5 py-0.5 rounded-lg leading-none">
                                          未达成
                                        </span>
                                      )}
                                      <p className="text-[7.5px] font-mono font-bold text-zinc-500">{q1Progress}/{q1Goal} ({q1Pct}%)</p>
                                    </div>
                                  </div>

                                  {/* Progress bar */}
                                  {!q1Claimed && (
                                    <div className="w-full bg-zinc-100 h-1 rounded-full mt-2 overflow-hidden border border-zinc-200/50">
                                      <div 
                                        className="bg-gradient-to-r from-indigo-400 to-purple-500 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${q1Pct}%` }}
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })()}

                            {/* Quest 2 */}
                            {(() => {
                              const q2Goal = 45;
                              const q2Progress = Math.min(q2Goal, dailyTilesEliminated);
                              const q2Pct = Math.round((q2Progress / q2Goal) * 100);
                              const q2Completed = dailyTilesEliminated >= q2Goal;
                              const q2Claimed = claimedDailyQuests.includes("q2");

                              return (
                                <div className={`p-2 rounded-xl border transition ${
                                  q2Claimed 
                                    ? "bg-zinc-50/70 border-zinc-200 text-zinc-400" 
                                    : q2Completed 
                                      ? "bg-emerald-50/40 border-emerald-300 text-zinc-805 ring-1 ring-emerald-300/20" 
                                      : "bg-white border-zinc-150 text-zinc-805"
                                }`}>
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="text-left leading-tight min-w-0 flex-1">
                                      <p className="text-[9.5px] font-black flex items-center gap-1.5 text-zinc-800">
                                        <span>⚡</span> 消消达人
                                        {q2Claimed && <span className="text-[6.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-250 px-1 rounded-sm leading-none shrink-0">已完成领受</span>}
                                      </p>
                                      <p className="text-[7.5px] text-slate-500 font-semibold mt-0.5">
                                        任务：今日在关卡中累计消除 {q2Goal} 张卡牌。
                                      </p>
                                      <p className="text-[7.5px] text-indigo-700 font-black mt-1">
                                        奖励：移出工具 x1、洗牌道具 x1
                                      </p>
                                    </div>

                                    <div className="shrink-0 flex flex-col items-end gap-1 select-none">
                                      {q2Claimed ? (
                                        <span className="text-[7.5px] text-zinc-400 font-black">✔ 已领</span>
                                      ) : q2Completed ? (
                                        <button
                                          onClick={() => claimDailyQuest("q2", "消消达人")}
                                          className="text-[7.5px] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold px-2 py-0.7 rounded-lg shadow-xs transition active:scale-95 animate-pulse cursor-pointer"
                                        >
                                          🎁 领道具
                                        </button>
                                      ) : (
                                        <span className="text-[7.5px] text-zinc-400 font-mono font-black bg-zinc-100 border border-zinc-250 px-1.5 py-0.5 rounded-lg leading-none">
                                          未达成
                                        </span>
                                      )}
                                      <p className="text-[7.5px] font-mono font-bold text-zinc-500">{q2Progress}/{q2Goal} ({q2Pct}%)</p>
                                    </div>
                                  </div>

                                  {/* Progress bar */}
                                  {!q2Claimed && (
                                    <div className="w-full bg-zinc-100 h-1 rounded-full mt-2 overflow-hidden border border-zinc-200/50">
                                      <div 
                                        className="bg-gradient-to-r from-indigo-400 to-purple-500 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${q2Pct}%` }}
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })()}

                            {/* Quest 3 */}
                            {(() => {
                              const q3Goal = 2;
                              const maxStreakPossible = Math.max(pvpWinStreak, pvpMaxStreak);
                              const q3Progress = Math.min(q3Goal, maxStreakPossible);
                              const q3Pct = Math.round((q3Progress / q3Goal) * 100);
                              const q3Completed = maxStreakPossible >= q3Goal;
                              const q3Claimed = claimedDailyQuests.includes("q3");

                              return (
                                <div className={`p-2 rounded-xl border transition ${
                                  q3Claimed 
                                    ? "bg-zinc-50/70 border-zinc-200 text-zinc-400" 
                                    : q3Completed 
                                      ? "bg-emerald-50/40 border-emerald-300 text-zinc-805 ring-1 ring-emerald-300/20" 
                                      : "bg-white border-zinc-150 text-zinc-805"
                                }`}>
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="text-left leading-tight min-w-0 flex-1">
                                      <p className="text-[9.5px] font-black flex items-center gap-1.5 text-zinc-800">
                                        <span>🔥</span> 天梯自豪
                                        {q3Claimed && <span className="text-[6.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-250 px-1 rounded-sm leading-none shrink-0">已完成领受</span>}
                                      </p>
                                      <p className="text-[7.5px] text-slate-500 font-semibold mt-0.5">
                                        任务：今日在 1v1 天梯赛中累计斩获至少 {q3Goal} 连胜。
                                      </p>
                                      <p className="text-[7.5px] text-indigo-700 font-black mt-1">
                                        奖励：加时沙漏 x2、免费复活机会 +1
                                      </p>
                                    </div>

                                    <div className="shrink-0 flex flex-col items-end gap-1 select-none">
                                      {q3Claimed ? (
                                        <span className="text-[7.5px] text-zinc-400 font-black">✔ 已领</span>
                                      ) : q3Completed ? (
                                        <button
                                          onClick={() => claimDailyQuest("q3", "天梯自豪")}
                                          className="text-[7.5px] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold px-2 py-0.7 rounded-lg shadow-xs transition active:scale-95 animate-pulse cursor-pointer"
                                        >
                                          🎁 领道具
                                        </button>
                                      ) : (
                                        <span className="text-[7.5px] text-zinc-400 font-mono font-black bg-zinc-100 border border-zinc-250 px-1.5 py-0.5 rounded-lg leading-none">
                                          未达成
                                        </span>
                                      )}
                                      <p className="text-[7.5px] font-mono font-bold text-zinc-500">{q3Progress}/{q3Goal} ({q3Pct}%)</p>
                                    </div>
                                  </div>

                                  {/* Progress bar */}
                                  {!q3Claimed && (
                                    <div className="w-full bg-zinc-100 h-1 rounded-full mt-2 overflow-hidden border border-zinc-200/50">
                                      <div 
                                        className="bg-gradient-to-r from-orange-400 to-rose-500 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${q3Pct}%` }}
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                        {/* SECTION 1: STANDARD LEVELS */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black text-rose-500 bg-rose-50 border border-rose-100 rounded px-1.5 py-0.5 select-none leading-none">
                              ⚔️ 荣耀晋级星光挑战 (Standard Battles)
                            </span>
                            <span className="text-[8px] text-zinc-400 font-mono font-bold leading-none">进度: {Math.min(12, currentLevel)}/12</span>
                          </div>
                          
                          <div className="space-y-2">
                            {LEVEL_SPECS.filter(spec => !spec.isHidden).map(spec => {
                              const isUnlocked = currentLevel >= spec.id;
                              return (
                                <div 
                                  key={spec.id}
                                  onClick={() => {
                                    if (isUnlocked) {
                                      setIsPvPMode(false); // regular level mode trigger
                                      startLevel(spec.id);
                                    }
                                  }}
                                  className={`p-2.5 rounded-2xl border transition-all text-left flex items-center justify-between shadow-xs cursor-pointer ${
                                    isUnlocked 
                                      ? `bg-white ${spec.borderColor} ${spec.bgColor}` 
                                      : "bg-zinc-100/60 border-zinc-200 opacity-60 pointer-events-none"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className={`text-2xl shrink-0 p-1 rounded-xl ${spec.iconBg}`}>{spec.icon}</span>
                                    <div className="leading-tight">
                                      <h4 className="text-[11px] font-black text-slate-800 flex items-center gap-1">
                                        {spec.title}
                                        {!isUnlocked && <Lock size={9} className="text-zinc-400" />}
                                      </h4>
                                      <p className="text-[9px] text-slate-400 mt-0.5">{spec.desc}</p>
                                    </div>
                                  </div>
                                  <span className={`text-[10px] font-bold ${isUnlocked ? spec.textColor : "text-zinc-400"}`}>
                                    {isUnlocked ? "进入 ➔" : "未解锁"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* SECTION 2: THE AMAZING HIDDEN CELESTIAL LEVELS */}
                        <div className="space-y-2 pt-2 border-t border-zinc-150">
                          <div className="bg-linear-to-r from-purple-500 to-indigo-600 rounded-xl p-2.5 text-white flex justify-between items-center shadow-xs">
                            <div className="text-left leading-none">
                              <span className="text-[8px] bg-white/20 text-indigo-50 font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                SECRET SANCTUMS
                              </span>
                              <h4 className="text-[11px] font-black mt-1 flex items-center gap-1">
                                🌸 极萌异域天门 • 隐藏神战关卡
                              </h4>
                            </div>
                            <span className="text-[14px]">🔮</span>
                          </div>

                          <div className="space-y-2">
                            {LEVEL_SPECS.filter(spec => spec.isHidden).map(spec => {
                              // Hidden levels unlock if user completed level 12 (i.e. highest unlocked is >= 13) or if cheatMode is enabled
                              const isSecretUnlocked = currentLevel >= spec.id || cheatMode;
                              
                              return (
                                <div 
                                  key={spec.id}
                                  onClick={() => {
                                    if (isSecretUnlocked) {
                                      setIsPvPMode(false);
                                      startLevel(spec.id);
                                    }
                                  }}
                                  className={`p-2.5 rounded-2xl border transition-all text-left flex items-center justify-between shadow-xs ${
                                    isSecretUnlocked 
                                      ? `bg-white ${spec.borderColor} ${spec.bgColor} cursor-pointer` 
                                      : "bg-radial from-zinc-50 to-zinc-100 border-zinc-250 opacity-70 cursor-not-allowed select-none relative"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className={`text-2xl shrink-0 p-1 rounded-xl bg-zinc-200/50 ${isSecretUnlocked ? spec.iconBg : "grayscale filter"}`}>
                                      {isSecretUnlocked ? spec.icon : "🔒"}
                                    </span>
                                    <div className="leading-tight">
                                      <h4 className={`text-[11px] font-black flex items-center gap-1 ${isSecretUnlocked ? "text-slate-800" : "text-zinc-550"}`}>
                                        {spec.title}
                                        {!isSecretUnlocked && (
                                          <span className="text-[6.5px] bg-purple-500 text-white rounded px-1 py-[0.5px] font-black uppercase tracking-wide leading-none select-none scale-90">
                                            神秘封印
                                          </span>
                                        )}
                                      </h4>
                                      <p className="text-[9px] text-zinc-400 mt-0.5">
                                        {isSecretUnlocked ? spec.desc : `通关『第12关』或开启金手指即可开启秘境`}
                                      </p>
                                    </div>
                                  </div>
                                  <span className={`text-[10px] font-bold ${isSecretUnlocked ? spec.textColor : "text-zinc-400"}`}>
                                    {isSecretUnlocked ? "探秘 ➔" : "封印中"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : lobbyTab === "pvp_lobby" ? (
                      <div className="space-y-3 p-0.5">
                        {/* Immersive Cover Plate */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-800 p-3 text-white shadow-md text-left">
                          <div className="absolute top-1 right-2 opacity-15 text-7xl font-mono select-none">⚔️</div>
                          <div className="relative z-10">
                            <span className="text-[7.5px] bg-red-500 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">LIVE SEASONS</span>
                            <h4 className="text-[12px] font-black mt-1">全服首创 • 1v1天梯赛区阁</h4>
                            <p className="text-[9px] text-zinc-200 mt-1 leading-normal">
                              即时联机！打出 3 连消可触发【合体解压奥义】自动抵消并干扰对手进展。积分助力本省，冲击省份之巅！
                            </p>
                          </div>
                        </div>

                        {/* Matchmaking Segment */}
                        <div className="bg-white border border-zinc-200 rounded-2xl p-3 shadow-xs text-left">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[11px] font-black text-slate-800 flex items-center gap-1">
                              📡 智能天梯排位大厅
                            </span>
                            <span className="text-[8.5px] text-emerald-600 font-bold flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                              当前在线 28,409人
                            </span>
                          </div>
                          
                          <p className="text-[9.5px] text-slate-500 leading-normal mb-3">
                            随机为您匹配在其他赛区比拼的高手，胜者直接赢得 <strong>+1,200</strong> 家乡天梯总分的荣誉积攒！
                          </p>

                          <button
                            onClick={() => handleStartPvP("random")}
                            className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-98 transition text-white font-black rounded-xl text-xs shadow-md tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            ⚡ 开启天梯极速排位 (PK)
                          </button>
                        </div>

                        {/* Friend matching invite segment */}
                        <div className="bg-white border border-zinc-200 rounded-2xl p-3 shadow-xs text-left space-y-2">
                          <span className="text-[11px] font-black text-slate-800">
                            👥 微信死党/好友密室切磋
                          </span>
                          <p className="text-[9.5px] text-slate-500 leading-normal">
                            创建专属微房发口令给群聊好友，或者粘贴好友的房号代码直接狙击PK！
                          </p>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => handleStartPvP("friend_create")}
                              className="py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-[9.5px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                            >
                              🔑 创开房对战房
                            </button>

                            <div className="flex gap-1">
                              <input
                                type="text"
                                maxLength={4}
                                placeholder="输入4字房号"
                                value={friendRoomInput}
                                onChange={(e) => setFriendRoomInput(e.target.value.replace(/\D/g, ""))}
                                className="w-18 bg-zinc-50 border border-zinc-250 text-center rounded-xl text-[9.5px] text-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                              />
                              <button
                                onClick={() => {
                                  if (!friendRoomInput || friendRoomInput.length < 4) {
                                    showWechatToast("⚠️ 请先在输入框填入4位纯数字的房间口令！");
                                    return;
                                  }
                                  handleStartPvP("friend_join");
                                }}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-900 text-white rounded-xl text-[9.5px] font-bold flex items-center justify-center cursor-pointer"
                              >
                                加入
                              </button>
                            </div>
                          </div>

                          {inviteRoomPassword && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-yellow-50 border border-yellow-250/60 p-2 rounded-xl text-center"
                            >
                              <p className="text-[9px] text-amber-800 font-bold leading-none">你的专用微信开房PK口令已创:</p>
                              <div className="text-sm font-black text-amber-600 mt-1 font-mono">
                                🔑 {inviteRoomPassword}
                              </div>
                              <p className="text-[8px] text-zinc-400 mt-1 leading-normal">
                                复制给好友。好友输入该 <strong>{inviteRoomPassword}</strong> 后即可进入对局！
                              </p>
                              <button
                                onClick={() => {
                                  audio.playTap();
                                  setFriendRoomInput(inviteRoomPassword);
                                  setInviteRoomPassword(null);
                                  setTimeout(() => {
                                    audio.playAdComplete();
                                    handleStartPvP("friend_join");
                                  }, 850);
                                }}
                                className="mt-2 w-full py-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[9px] rounded-lg transition-all"
                              >
                                🛰️ 免等待！直接召唤智能机器人陪练PK
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    ) : lobbyTab === "ranking" ? (
                      
                      // TAB 2: LIVE REGIONAL LEADERBOARD BATTLE
                      <div className="space-y-2 select-none">
                        {/* Sub-Tabs selectors to toggle between province standings or personal scores */}
                        <div className="flex bg-zinc-200/80 rounded-xl p-0.5 gap-0.5 w-full shrink-0 border border-zinc-250/20">
                          <button 
                            onClick={() => { audio.playTap(); setRankingSubTab("province"); }}
                            className={`flex-1 py-1 text-[9.5px] font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              rankingSubTab === "province" 
                                ? "bg-white text-zinc-800 shadow-xs" 
                                : "text-zinc-500 hover:text-zinc-700"
                            }`}
                          >
                            🦁 省份风云榜
                          </button>
                          <button 
                            onClick={() => { audio.playTap(); setRankingSubTab("personal"); }}
                            className={`flex-1 py-1 text-[9.5px] font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              rankingSubTab === "personal" 
                                ? "bg-white text-zinc-800 shadow-xs" 
                                : "text-zinc-500 hover:text-zinc-700"
                            }`}
                          >
                            🦁 个人核心榜
                          </button>
                        </div>

                        {rankingSubTab === "province" ? (
                          <div className="space-y-2 select-none">
                            <div className="p-2.5 border border-rose-100 text-left bg-rose-50/40 rounded-2xl flex flex-col gap-1.5 shrink-0 shadow-xs">
                              <span className="text-xs text-rose-650 font-black flex items-center gap-1.5 select-none font-sans">
                                <Activity size={12} className="animate-pulse text-rose-500" />
                                📢 实时全国赛区趣味比拼大厅
                              </span>
                              
                              {/* Live message scroller log container */}
                              <div className="bg-slate-950 border border-slate-900 p-2.5 rounded-xl text-[10.5px] font-bold text-amber-300 space-y-2 h-[88px] overflow-y-auto font-mono flex flex-col justify-start shadow-inner">
                                {battleFeeds.map((feed, idx) => (
                                  <div key={idx} className="whitespace-normal break-words select-none leading-relaxed border-b border-white/5 pb-1.5 last:border-hidden last:pb-0">
                                    {feed}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Provincial Chart Bars */}
                            <div className="space-y-1.5 max-h-[145px] overflow-y-auto pr-0.5">
                              {sortedProvincesOutput.map((item, index) => {
                                // find percentage based on top element (first element since sorted)
                                const topScore = sortedProvincesOutput[0].score || 1;
                                const pct = (item.score / topScore) * 100;
                                const isUserSelected = item.name === selectedProvince;

                                return (
                                  <div 
                                    key={item.name} 
                                    className={`p-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                                      isUserSelected 
                                        ? "bg-rose-50 border-rose-300/60 ring-1 ring-rose-300" 
                                        : "bg-white border-zinc-250/50 hover:bg-zinc-50/40"
                                    }`}
                                  >
                                    <span className={`text-[10px] font-black font-mono w-4 block text-center shrink-0 ${
                                      index === 0 ? "text-amber-500 font-extrabold" : "text-zinc-500"
                                    }`}>
                                      {index + 1}
                                    </span>
                                    <span className="text-[11px] shrink-0 select-none">{item.avatar}</span>
                                    
                                    <div className="flex-1 text-left leading-none min-w-0 pr-1">
                                      <div className="flex justify-between items-center mb-1 gap-1">
                                        <span className={`text-[9.5px] font-black truncate max-w-[80px] ${isUserSelected ? "text-rose-600" : "text-zinc-700"}`}>
                                          {item.name} {isUserSelected && "⭐"}
                                        </span>
                                        <div className="flex gap-1.5 text-[8.5px] font-mono text-zinc-550 font-bold shrink-0">
                                          <span>得: <strong className="text-zinc-800">{item.score.toLocaleString()}</strong></span>
                                          <span className="text-teal-600 font-sans font-bold">🕒 {item.avgTime}秒</span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1">
                                        <div className="flex-1 bg-zinc-150 h-1.5 rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full rounded-full transition-all duration-700 ${
                                              index === 0 
                                                ? "bg-linear-to-r from-yellow-400 to-amber-500" 
                                                : isUserSelected 
                                                  ? "bg-rose-500" 
                                                  : "bg-teal-500"
                                            }`}
                                            style={{ width: `${pct}%` }}
                                          ></div>
                                        </div>
                                        <span className="text-[7px] text-zinc-400 font-mono scale-90 shrink-0 select-none font-bold">通率:{item.passRate}%</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          // TAB 3 (RANKINGS > PERSONAL): THE AMAZING PERSONAL SCOREBOARDS & LIST
                          <div className="space-y-2.5 text-left animate-fade-in">
                            <div className="grid grid-cols-3 gap-1.5 shrink-0 select-none">
                              <div className="bg-gradient-to-br from-indigo-50 to-blue-100/60 border border-indigo-200/50 p-2 rounded-2xl shadow-xs flex flex-col justify-center items-center">
                                <span className="text-lg">🏅</span>
                                <p className="text-[7.5px] font-bold text-zinc-500 mt-0.5">最高关卡</p>
                                <p className="text-[10.5px] font-black text-indigo-700 leading-none mt-1">
                                  {userBestLevel > 0 ? `第 ${userBestLevel} 关` : "新兵闯关"}
                                </p>
                              </div>
                              
                              <div className="bg-gradient-to-br from-pink-50 to-rose-100/60 border border-pink-200/50 p-2 rounded-2xl shadow-xs flex flex-col justify-center items-center">
                                <span className="text-lg">⚡</span>
                                <p className="text-[7.5px] font-bold text-zinc-500 mt-0.5">累积高分</p>
                                <p className="text-[10.5px] font-black text-rose-600 leading-none mt-1">
                                  {userBestScore > 0 ? `${userBestScore} 分` : "0 分"}
                                </p>
                              </div>
                              
                              <div className="bg-gradient-to-br from-teal-50 to-emerald-100/60 border border-teal-200/50 p-2 rounded-2xl shadow-xs flex flex-col justify-center items-center">
                                <span className="text-lg">⏱️</span>
                                <p className="text-[7.5px] font-bold text-zinc-500 mt-0.5">最佳成绩</p>
                                <p className="text-[10.5px] font-black text-teal-600 leading-none mt-1">
                                  {userBestTime > 0 ? `${userBestTime} 秒` : "-- 秒"}
                                </p>
                              </div>
                            </div>

                            {/* Personal Rankings list */}
                            <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-0.5 border border-zinc-200/20 rounded-2xl p-1 bg-zinc-50/20">
                              {(() => {
                                // Construct list dynamically
                                const baseList = userBestScore > 0 ? [
                                  ...personalLeaderboard,
                                  {
                                    name: userNickname,
                                    province: selectedProvince,
                                    avatar: userAvatar,
                                    level: userBestLevel,
                                    score: userBestScore,
                                    timeInSeconds: userBestTime,
                                    isUser: true
                                  }
                                ] : [
                                  ...personalLeaderboard,
                                  {
                                    name: userNickname,
                                    province: selectedProvince,
                                    avatar: userAvatar,
                                    level: 1,
                                    score: 180,
                                    timeInSeconds: 43,
                                    isUser: true
                                  }
                                ];

                                // Prevent duplicates with same name & province
                                const uniqueList: typeof baseList = [];
                                const seen = new Set<string>();
                                baseList.forEach(item => {
                                  const key = `${item.name}-${item.province}`;
                                  if (!seen.has(key)) {
                                    seen.add(key);
                                    uniqueList.push(item);
                                  }
                                });

                                // Sort: highest level desc, then score desc, then fastest time asc
                                const sortedList = uniqueList.sort((a, b) => {
                                  if (b.level !== a.level) return b.level - a.level;
                                  if (b.score !== a.score) return b.score - a.score;
                                  return a.timeInSeconds - b.timeInSeconds;
                                });

                                return sortedList.map((item, index) => {
                                  const isMe = item.isUser;
                                  return (
                                    <div 
                                      key={`${item.name}-${item.province}-${index}`}
                                      className={`p-1.5 rounded-xl border flex items-center justify-between gap-1.5 transition-all ${
                                        isMe 
                                          ? "bg-amber-50 border-amber-300 ring-1 ring-amber-300/40 text-zinc-900 shadow-xs" 
                                          : "bg-white border-zinc-250/50 hover:bg-zinc-50/40"
                                      }`}
                                    >
                                      {/* Rank, avatar, identity column */}
                                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                        <span className={`text-[10px] font-black font-mono w-5 block text-center shrink-0 ${
                                          index === 0 ? "text-yellow-500 font-extrabold text-xs" : "text-zinc-500"
                                        }`}>
                                          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                                        </span>
                                        
                                        <span className="text-xs w-5 text-center shrink-0 select-none">{item.avatar}</span>
                                        
                                        {/* Player identification block with clean ellipsis truncations */}
                                        <div className="text-left font-bold min-w-0 flex-1 pr-1 flex flex-col justify-center">
                                          <div className="flex items-center gap-1 min-w-0">
                                            <span 
                                              className={`text-[9.5px] leading-tight truncate ${isMe ? "text-amber-950 font-black" : "text-zinc-805"}`}
                                              title={item.name}
                                            >
                                              {item.name}
                                            </span>
                                            {isMe && (
                                              <span className="bg-emerald-500 text-white rounded px-1 py-[0.5px] text-[6px] font-black leading-none scale-85 origin-left shrink-0 select-none">
                                                本尊
                                              </span>
                                            )}
                                          </div>
                                          <p 
                                            className="text-[7.5px] text-zinc-400 font-semibold truncate mt-0.5 select-none"
                                            title={item.province}
                                          >
                                            所属赛区: {item.province}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Personal stats block with precise width alignment */}
                                      <div className="text-right font-mono flex flex-col items-end justify-center leading-tight shrink-0 w-[110px]">
                                        <span className="text-[10px] font-black text-rose-500 truncate w-full text-right" title={`${item.score.toLocaleString()}分`}>
                                          {item.score.toLocaleString()}分
                                        </span>
                                        <span className="text-[7.5px] text-zinc-400 mt-0.5 select-none truncate w-full text-right font-sans font-bold">
                                          通关【第{item.level}关】 • 🕒 {item.timeInSeconds}秒
                                        </span>
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // TAB 4: PERSONAL CENTER
                      <div className="flex flex-col justify-center min-h-full gap-3.5 select-none text-left pb-16 w-full h-auto">
                        {/* PROFILE CARD */}
                        <div className={`bg-gradient-to-br ${
                          claimedMilestones.includes("m3")
                            ? "from-rose-600 via-orange-600 to-amber-500 shadow-xl shadow-orange-950/30 ring-2 ring-amber-400 border border-orange-400/30 font-sans"
                            : isWechatLoggedIn 
                              ? "from-emerald-500 via-teal-600 to-cyan-600 shadow-lg shadow-emerald-950/20 border border-emerald-400/20 font-sans" 
                              : "from-rose-500 via-pink-500 to-amber-500 shadow-lg shadow-pink-950/20 border border-pink-400/20 font-sans"
                        } rounded-[24px] p-3.5 text-white shadow-md relative overflow-hidden transition-all duration-300 shrink-0`}>
                          {/* Cute floating deco shapes */}
                          <div className="absolute top-2 right-4 text-sm opacity-30 animate-pulse">🌟</div>
                          {claimedMilestones.includes("m3") && (
                            <div className="absolute top-1 right-12 text-md opacity-70 animate-pulse text-amber-300 font-bold text-[8px] border border-amber-300/40 bg-black/45 px-1.5 py-0.5 rounded">👑 不败神话已加冕</div>
                          )}
                          <div className="absolute bottom-1 right-24 text-lg opacity-20">🌸</div>
                          <div className="absolute top-8 left-16 text-xs opacity-20 animate-bounce">🎈</div>
                          <div className="absolute -right-3 -bottom-3 text-7xl opacity-15">👑</div>
                          
                          <div className="flex gap-3 items-center relative z-10 w-full min-w-0">
                            <div className="relative group shrink-0">
                              <button
                                onClick={() => {
                                  audio.playTap();
                                  const emojis = ["🦊", "🐰", "🐼", "🐹", "🥑", "🐯", "🐱", "🐨", "🦁", "🐧", "🦄", "🐶", "🐻", "🦖"];
                                  const currentIdx = emojis.indexOf(userAvatar);
                                  const nextIdx = (currentIdx + 1) % emojis.length;
                                  setUserAvatar(emojis[nextIdx]);
                                  showWechatToast(`✨ 头像已切换为：${emojis[nextIdx]}！`);
                                }}
                                className={`text-3xl p-2 bg-white/95 rounded-2xl cursor-pointer hover:scale-105 active:scale-95 border-2 ${
                                  claimedMilestones.includes("m1") 
                                    ? "border-amber-400 ring-2 ring-amber-300 animate-pulse bg-gradient-to-br from-yellow-50 to-amber-100" 
                                    : "border-pink-200"
                                } shadow-md transition-all duration-200 flex items-center justify-center shrink-0 h-13 w-13`}
                                title="点击更换头像"
                              >
                                {userAvatar}
                              </button>
                              <span className="absolute -bottom-1 -right-1 bg-rose-500 text-white rounded-full text-[7.5px] px-1.5 py-0.5 font-sans font-black tracking-wider border border-white uppercase scale-85">换</span>
                            </div>

                            <div className="leading-tight flex-1 min-w-0">
                              <span className={`inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wide px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md ${
                                isWechatLoggedIn 
                                  ? "bg-black/25 text-emerald-100 border-white/20" 
                                  : "bg-black/25 text-amber-100 border-white/20"
                              }`}>
                                {isWechatLoggedIn ? "💬 微信授权登录" : "🐾 游客身份登录"}
                              </span>
                              {/* Stack nickname and province input fields vertically with flex layouts to handle extremely long names */}
                              <div className="flex flex-col gap-2 mt-2 w-full min-w-0">
                                <div className="flex items-center gap-1.5 bg-black/15 p-1 rounded-xl border border-white/10 min-w-0 w-full">
                                  <span className="text-[7.5px] text-zinc-100/90 font-black uppercase tracking-wider shrink-0 pl-1.5 w-11 text-left">玩家昵称</span>
                                  <input 
                                    type="text" 
                                    value={userNickname} 
                                    maxLength={8}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setUserNickname(val || "消消达人");
                                    }}
                                    className="bg-transparent hover:bg-black/10 focus:bg-black/20 font-black text-[10px] px-2 py-0.5 rounded-lg border border-transparent text-white focus:outline-none focus:border-white/25 flex-1 min-w-0 truncate placeholder-white/50 transition-all font-sans block h-6 leading-6"
                                    placeholder="我的名号..."
                                  />
                                </div>
                                
                                <div className="flex items-center gap-1.5 bg-black/15 p-1 rounded-xl border border-white/10 min-w-0 w-full">
                                  <span className="text-[7.5px] text-zinc-100/90 font-black uppercase tracking-wider shrink-0 pl-1.5 w-11 text-left">所属赛区</span>
                                  <div 
                                    className="text-[10px] text-white font-black font-sans flex items-center gap-1.5 h-6 min-w-0 flex-1 select-none px-2"
                                    title={selectedProvince}
                                  >
                                    <span className="shrink-0 leading-none">{PROVINCE_AVATARS[selectedProvince] || "🏳️"}</span>
                                    <span className="truncate leading-none">{selectedProvince}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Dynamic Combat Power Card */}
                          {(() => {
                            const milestoneBonus = claimedMilestones.includes("m1") ? 500 : 0;
                            const userPower = Math.max(120, userBestLevel * 1000 + userBestScore * 3 + (userBestTime > 0 ? Math.max(0, (180 - userBestTime) * 5) : 0) + milestoneBonus);
                            const powerBadge = userPower >= 8000 
                              ? { title: "💎 SSR 极萌消圣", color: "text-amber-650 bg-amber-50 border-amber-250 font-sans font-black" } 
                              : userPower >= 4000 
                                ? { title: "🔥 SR 傲世消王", color: "text-rose-600 bg-rose-50 border-rose-220 font-sans font-black" } 
                                : userPower >= 1500 
                                  ? { title: "🌟 R 进阶消将", color: "text-teal-600 bg-teal-50 border-teal-220 font-sans font-black" } 
                                  : { title: "🔰 N 消消新兵", color: "text-zinc-650 bg-zinc-50 border-zinc-220 font-sans font-black" };

                            return (
                              <div className="mt-3 bg-black/20 rounded-xl p-2.5 border border-white/10 flex justify-between items-center shadow-inner shrink-0">
                                <div className="leading-none text-left min-w-0 flex-1">
                                  <p className="text-[9px] text-white/90 font-black truncate">代表战力值 (萌萌战斗力)</p>
                                  <p className="text-sm font-mono font-black tracking-wider text-amber-300 mt-1 flex items-center gap-1 leading-none">
                                    ⚡ {userPower.toLocaleString()} <span className="text-[9px] font-bold text-white/80">PTS</span>
                                  </p>
                                </div>
                                <span className={`text-[9px] font-black px-2 py-1.5 rounded-xl shadow-xs border ${powerBadge.color} tracking-wider shrink-0`}>
                                  {powerBadge.title}
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                        
                        {/* WECHAT LINK PROMPT CARD */}
                        {!isWechatLoggedIn && (
                          <button
                            onClick={prepareWechatPrompt}
                            className="w-full p-3 bg-gradient-to-r from-emerald-50 via-teal-50/30 to-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-left cursor-pointer hover:bg-emerald-100/40 hover:border-emerald-450 transition-all outline-none"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xl shrink-0 animate-bounce">💬</span>
                              <div className="leading-tight">
                                <span className="text-[11px] font-black text-emerald-800 flex items-center gap-1">
                                  一键关联微信名片登录 <span className="bg-emerald-500 text-white text-[7px] px-1.5 py-0.5 rounded-full font-black scale-90 leading-none">推荐</span>
                                </span>
                                <span className="text-[9px] text-zinc-650 block mt-1 font-sans leading-normal">
                                  开启后可自选十余款激萌头像，同步省份赛区声望。
                                </span>
                              </div>
                            </div>
                            <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-2.5 py-1 rounded-full leading-none shrink-0 shadow-xs animate-pulse">➔ 授权</span>
                          </button>
                        )}

                        {/* PERSONAL HIGHEST RECORD CARDS */}
                        <div className="grid grid-cols-3 gap-1.5 text-center shrink-0">
                          <div className="bg-gradient-to-br from-indigo-50 to-blue-100/60 border border-indigo-200/50 h-[64px] rounded-2xl shadow-xs flex flex-col justify-between items-center py-2 px-1">
                            <span className="text-base leading-none">🏅</span>
                            <p className="text-[7px] font-black text-zinc-400">最高关卡</p>
                            <p className="text-[10px] font-black text-indigo-700 leading-none truncate w-full" title={userBestLevel > 0 ? `第 ${userBestLevel} 关` : "新兵闯关"}>
                              {userBestLevel > 0 ? `第 ${userBestLevel} 关` : "新兵闯关"}
                            </p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-pink-50 to-rose-100/60 border border-pink-200/50 h-[64px] rounded-2xl shadow-xs flex flex-col justify-between items-center py-2 px-1">
                            <span className="text-base leading-none">⚡</span>
                            <p className="text-[7px] font-black text-zinc-400">累积高分</p>
                            <p className="text-[10px] font-black text-rose-600 leading-none truncate w-full" title={userBestScore > 0 ? `${userBestScore} 分` : "0 分"}>
                              {userBestScore > 0 ? `${userBestScore} 分` : "0 分"}
                            </p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-teal-50 to-emerald-100/60 border border-teal-200/50 h-[64px] rounded-2xl shadow-xs flex flex-col justify-between items-center py-2 px-1">
                            <span className="text-base leading-none">⏱️</span>
                            <p className="text-[7px] font-black text-zinc-400">最佳成绩</p>
                            <p className="text-[10px] font-black text-teal-600 leading-none truncate w-full" title={userBestTime > 0 ? `${userBestTime} 秒` : "-- 秒"}>
                              {userBestTime > 0 ? `${userBestTime} 秒` : "-- 秒"}
                            </p>
                          </div>
                        </div>

                        {/* PVP WIN STREAK CORNER WITH MILESTONE REWARDS */}
                        <div className="bg-gradient-to-br from-amber-500/5 via-white to-orange-500/5 border border-amber-500/20 rounded-[28px] p-3.5 shadow-xs space-y-3 shrink-0 relative overflow-hidden">
                          {/* Title banner */}
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] sm:text-[10.5px] font-black text-amber-800 flex items-center gap-1">
                              🔥 天梯天骄：PVP 连胜荣誉与特权
                            </span>
                            <span className="text-[6.5px] font-mono text-zinc-400">PVP Win Streak Milestones</span>
                          </div>

                          {/* Stats visualization */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gradient-to-br from-orange-50 to-amber-100/50 border border-orange-200/40 p-2.5 rounded-2xl flex items-center gap-2.5 shadow-sm">
                              <span className="text-2xl animate-pulse">🔥</span>
                              <div className="text-left leading-none">
                                <p className="text-[8px] text-zinc-400 font-bold">当前连胜</p>
                                <p className="text-md font-mono font-black text-orange-600 mt-1">
                                  {pvpWinStreak} <span className="text-[8px] font-sans text-orange-500 font-bold">连胜中</span>
                                </p>
                              </div>
                            </div>

                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200/40 p-2.5 rounded-2xl flex items-center gap-2.5 shadow-sm">
                              <span className="text-2xl">👑</span>
                              <div className="text-left leading-none">
                                <p className="text-[8px] text-zinc-400 font-bold">最高纪录</p>
                                <p className="text-md font-mono font-black text-amber-600 mt-1">
                                  {pvpMaxStreak} <span className="text-[8px] font-sans text-amber-500 font-bold">场最高</span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Quick sandbox control panel for easy previewing of 3, 5, 8 wins */}
                          <div className="bg-zinc-100/80 border border-zinc-200/60 p-1.5 rounded-xl flex items-center justify-between gap-1 select-none">
                            <span className="text-[8px] text-zinc-500 font-black pl-1">🛠️ 天梯测试沙盒:</span>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  audio.playTap();
                                  setPvpWinStreak(prev => {
                                    const next = prev + 1;
                                    localStorage.setItem("wechat_pvp_win_streak", next.toString());
                                    setPvpMaxStreak(maxPrev => {
                                      const newMax = Math.max(maxPrev, next);
                                      localStorage.setItem("wechat_pvp_max_streak", newMax.toString());
                                      return newMax;
                                    });
                                    showWechatToast(`⚡ 测试助力：PVP 连胜已强提至 ${next} 场！`);
                                    return next;
                                  });
                                }}
                                className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[7.5px] rounded-lg transition active:scale-95"
                              >
                                ➕ 连胜加1
                              </button>
                              <button
                                onClick={() => {
                                  audio.playTap();
                                  setPvpWinStreak(0);
                                  localStorage.setItem("wechat_pvp_win_streak", "0");
                                  showWechatToast("⚡ 测试清零：PVP 连胜已归零！");
                                }}
                                className="px-2 py-0.5 bg-zinc-300 hover:bg-zinc-400 text-zinc-700 font-bold text-[7.5px] rounded-lg transition active:scale-95"
                              >
                                重置零
                              </button>
                            </div>
                          </div>

                          {/* Milestones and Reward list */}
                          <div className="space-y-2">
                            {(() => {
                              const milestones = [
                                {
                                  id: "m1",
                                  reqWins: 3,
                                  title: "🥇 连消神将（金圈认证）",
                                  desc: "当前/最佳连胜满 3 场可领。解锁并佩戴个人专属【黄金呼吸法阵】头像框，并永久获得 +500 PTS 战力萌点！",
                                  medal: "🛡️"
                                },
                                {
                                  id: "m2",
                                  reqWins: 5,
                                  title: "🔥 齐天大消（不散魂复活权）",
                                  desc: "当前/最佳连胜满 5 场可领。激活槽盘法卷。复活栏槽位满时，每日拥有一次免看广告的原地满槽复活特权！",
                                  medal: "⚡"
                                },
                                {
                                  id: "m3",
                                  reqWins: 8,
                                  title: "👑 不败战神（至尊火焰渲染名片）",
                                  desc: "当前/最佳连胜满 8 场可领。个人名片全幅更换为【不败烈焰】梦幻渐变壁纸，天梯无双，荣耀爆表！",
                                  medal: "🔥"
                                }
                              ];

                              return milestones.map(m => {
                                const hasUnusedStreak = pvpWinStreak >= m.reqWins || pvpMaxStreak >= m.reqWins;
                                const isClaimed = claimedMilestones.includes(m.id);

                                return (
                                  <div 
                                    key={m.id}
                                    className={`p-2 rounded-xl border flex flex-col gap-1 text-left transition ${
                                      isClaimed 
                                        ? "bg-amber-50/50 border-amber-300 text-zinc-805" 
                                        : hasUnusedStreak 
                                          ? "bg-yellow-50 border-orange-300 ring-1 ring-orange-300/30 text-zinc-800" 
                                          : "bg-zinc-100/45 border-zinc-200 opacity-65 text-zinc-500"
                                    }`}
                                  >
                                    <div className="flex justify-between items-center select-none">
                                      <span className="text-[9.5px] font-black tracking-tight flex items-center gap-1">
                                        <span>{m.medal}</span> {m.title}
                                      </span>
                                      
                                      {isClaimed ? (
                                        <span className="text-[7.5px] text-emerald-600 font-black bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 rounded-lg flex items-center gap-0.5 animate-pulse">
                                          ✔ 已穿戴/生效
                                        </span>
                                      ) : hasUnusedStreak ? (
                                        <button
                                          onClick={() => claimStreakMilestone(m.id, m.title)}
                                          className="text-[7.5px] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-black text-white px-2 py-0.7 rounded-lg shadow-sm transition active:scale-95 animate-bounce shrink-0 cursor-pointer"
                                        >
                                          🎁 立即领受
                                        </button>
                                      ) : (
                                        <span className="text-[7.5px] text-zinc-400 font-mono font-bold bg-zinc-200 border border-zinc-350 px-1.5 py-0.5 rounded-lg shrink-0">
                                          🔒 需满{m.reqWins}连胜
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[8px] text-slate-500 leading-normal font-sans pr-1">
                                      {m.desc}
                                    </p>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>

                        {/* THEMED SKIN CLOSET WIDGET */}
                        <div className="bg-white/95 border border-zinc-200/60 rounded-3xl p-3 shadow-xs space-y-2.5 shrink-0">
                          <div className="flex justify-between items-center">
                            <p className="text-[9.5px] font-black text-zinc-700 flex items-center gap-1">
                              🧸 绝版关卡卡牌皮肤橱窗
                            </p>
                            <button 
                              onClick={() => {
                                audio.playTap();
                                setShowReferralDialog(true);
                              }}
                              className="text-[7.5px] text-pink-500 font-extrabold flex items-center gap-0.5 btn-view-more"
                            >
                              获取更多皮肤 ➔
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-1.5">
                            {/* CLASSIC SKIN */}
                            <div 
                              onClick={() => {
                                audio.playTap();
                                changeSkinTheme("classic");
                              }}
                              className={`p-1.5 rounded-xl border flex flex-col items-center justify-between h-[58px] cursor-pointer transition-all ${
                                activeSkinTheme === "classic" 
                                  ? "bg-amber-50 border-amber-300 ring-1 ring-amber-300/40" 
                                  : "bg-zinc-50 border-zinc-200 hover:bg-zinc-105"
                              }`}
                            >
                              <span className="text-xl">🐱</span>
                              <span className="text-[7.5px] font-black font-sans leading-tight text-slate-800">经典萌宠</span>
                              <span className={`text-[6px] px-1 py-0.2 rounded-md ${activeSkinTheme === "classic" ? "bg-amber-500 text-white font-extrabold scale-90" : "text-zinc-400 font-bold scale-90"}`}>
                                {activeSkinTheme === "classic" ? "使用中" : "可使用"}
                              </span>
                            </div>

                            {/* CYBER SKIN (needs 1 referral) */}
                            {(() => {
                              const isUnlocked = referralsCount >= 1;
                              return (
                                <div 
                                  onClick={() => {
                                    audio.playTap();
                                    if (isUnlocked) {
                                      changeSkinTheme("cyber");
                                    } else {
                                      setShowReferralDialog(true);
                                    }
                                  }}
                                  className={`p-1.5 rounded-xl border flex flex-col items-center justify-between h-[58px] cursor-pointer transition-all ${
                                    activeSkinTheme === "cyber" 
                                      ? "bg-indigo-950/90 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/40" 
                                      : isUnlocked 
                                        ? "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-105 border-zinc-300"
                                        : "bg-zinc-100/60 border-zinc-200 opacity-60"
                                  }`}
                                >
                                  <span className="text-xl">{isUnlocked ? "🤖" : "🔒"}</span>
                                  <span className="text-[7.5px] font-black font-sans leading-tight">赛博科幻</span>
                                  <span className={`text-[6px] px-1 py-0.2 rounded-md ${
                                    activeSkinTheme === "cyber" 
                                      ? "bg-cyan-400 text-zinc-950 font-extrabold scale-90" 
                                      : isUnlocked 
                                        ? "text-zinc-500 font-bold scale-90" 
                                        : "text-rose-500 font-bold scale-90 bg-rose-50"
                                  }`}>
                                    {activeSkinTheme === "cyber" ? "使用中" : isUnlocked ? "已解锁" : "邀1人"}
                                  </span>
                                </div>
                              );
                            })()}

                            {/* CANDY SKIN (needs 2 referrals) */}
                            {(() => {
                              const isUnlocked = referralsCount >= 2;
                              return (
                                <div 
                                  onClick={() => {
                                    audio.playTap();
                                    if (isUnlocked) {
                                      changeSkinTheme("candy");
                                    } else {
                                      setShowReferralDialog(true);
                                    }
                                  }}
                                  className={`p-1.5 rounded-xl border flex flex-col items-center justify-between h-[58px] cursor-pointer transition-all ${
                                    activeSkinTheme === "candy" 
                                      ? "bg-rose-50 border-rose-350 text-rose-650 ring-1 ring-rose-455/40" 
                                      : isUnlocked 
                                        ? "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-105 border-zinc-300"
                                        : "bg-zinc-100/60 border-zinc-200 opacity-60"
                                  }`}
                                >
                                  <span className="text-xl">{isUnlocked ? "🍩" : "🔒"}</span>
                                  <span className="text-[7.5px] font-black font-sans leading-tight">缤纷糖果</span>
                                  <span className={`text-[6px] px-1 py-0.2 rounded-md ${
                                    activeSkinTheme === "candy" 
                                      ? "bg-rose-500 text-white font-extrabold scale-90" 
                                      : isUnlocked 
                                        ? "text-zinc-500 font-bold scale-90" 
                                        : "text-rose-500 font-bold scale-90 bg-rose-50"
                                  }`}>
                                    {activeSkinTheme === "candy" ? "使用中" : isUnlocked ? "已解锁" : "邀2人"}
                                  </span>
                                </div>
                              );
                            })()}

                            {/* MYTHIC SKIN (needs 3 referrals) */}
                            {(() => {
                              const isUnlocked = referralsCount >= 3;
                              return (
                                <div 
                                  onClick={() => {
                                    audio.playTap();
                                    if (isUnlocked) {
                                      changeSkinTheme("mythic");
                                    } else {
                                      setShowReferralDialog(true);
                                    }
                                  }}
                                  className={`p-1.5 rounded-xl border flex flex-col items-center justify-between h-[58px] cursor-pointer transition-all ${
                                    activeSkinTheme === "mythic" 
                                      ? "bg-amber-100/90 border-yellow-405 text-amber-805 ring-1 ring-yellow-400/40" 
                                      : isUnlocked 
                                        ? "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-105 border-zinc-300"
                                        : "bg-zinc-100/60 border-zinc-200 opacity-60"
                                  }`}
                                >
                                  <span className="text-xl">{isUnlocked ? "🐲" : "🔒"}</span>
                                  <span className="text-[7.5px] font-black font-sans leading-tight">山海神话</span>
                                  <span className={`text-[6px] px-1 py-0.2 rounded-md ${
                                    activeSkinTheme === "mythic" 
                                      ? "bg-amber-500 text-white font-extrabold scale-90" 
                                      : isUnlocked 
                                        ? "text-zinc-500 font-bold scale-90" 
                                        : "text-rose-500 font-bold scale-90 bg-rose-50"
                                  }`}>
                                    {activeSkinTheme === "mythic" ? "使用中" : isUnlocked ? "已解锁" : "邀3人"}
                                  </span>
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                        {/* MY HONORS MEDAL WALL - Interactive Grid */}
                        <div className="bg-white/95 border border-zinc-200/60 rounded-3xl p-2.5 shadow-xs">
                          <p className="text-[9.5px] font-black text-zinc-700 mb-2 flex items-center gap-1">
                            🏆 我的名山荣耀勋章 (Sticker Gallery)
                          </p>
                          <div className="grid grid-cols-4 gap-1.5">
                            {(() => {
                              const medals = [
                                {
                                  id: "m1",
                                  emoji: "🛡️",
                                  title: "开国锐士",
                                  desc: "战力积分已破零",
                                  unlocked: userBestScore > 0
                                },
                                {
                                  id: "m2",
                                  emoji: "⏱️",
                                  title: "神速先锋",
                                  desc: "45s极速通关",
                                  unlocked: userBestTime <= 45 && userBestTime > 0
                                },
                                {
                                  id: "m3",
                                  emoji: "👑",
                                  title: "华夏神灵",
                                  desc: "同省荣耀满1000",
                                  unlocked: (provinceScores[selectedProvince] || 0) >= 1000
                                },
                                {
                                  id: "m4",
                                  emoji: "🔥",
                                  title: "逆天元神",
                                  desc: "成功挑战第2关",
                                  unlocked: userBestLevel >= 2
                                }
                              ];

                              return medals.map(medal => (
                                <div 
                                  key={medal.id}
                                  className={`p-1.5 border-1.5 rounded-2xl flex flex-col items-center relative transition-all duration-200 select-none ${
                                    medal.unlocked 
                                      ? "bg-radial from-amber-50 to-orange-100/40 border-amber-300 text-zinc-800 shadow-xs hover:scale-110 active:scale-95" 
                                      : "bg-zinc-50 border-zinc-200 text-zinc-300 opacity-50"
                                  }`}
                                  title={`${medal.title}: ${medal.desc}`}
                                >
                                  <span className={`text-[18px] transition-all duration-300 ${medal.unlocked ? "drop-shadow-md" : "grayscale opacity-60"}`}>{medal.emoji}</span>
                                  <span className="text-[6.5px] font-black mt-1 leading-none text-center block max-w-full truncate">{medal.title}</span>
                                  <span className="text-[5.5px] text-zinc-400 font-medium scale-90 whitespace-nowrap mt-0.5">{medal.unlocked ? "已收集" : "锁定"}</span>
                                  {!medal.unlocked && <Lock size={6} className="absolute top-1 right-1 text-zinc-405" />}
                                </div>
                              ));
                            })()}
                          </div>
                        </div>

                        {/* DAILY FORTUNE BLESSING (每日祈福抽签) - Clickable Mini-Game */}
                        <div className="bg-gradient-to-br from-amber-50 to-rose-50 border border-orange-200 text-left rounded-3xl p-3 flex flex-col gap-2.5 shadow-xs relative overflow-hidden">
                          {/* Chinese temple visual borders */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-400 to-red-500"></div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-[9.5px] text-red-700 font-extrabold flex items-center gap-1 select-none">
                              🏮 极萌啵啵神木 • 每日消除御神签
                            </span>
                            <span className="text-[8px] text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full font-black scale-90">测运气</span>
                          </div>

                          <div className="bg-white/90 backdrop-blur-md border-2 border-dashed border-red-200/60 p-2.5 rounded-2xl text-center flex flex-col items-center justify-center min-h-[64px] shadow-inner">
                            {isDrawing ? (
                              <div className="flex flex-col items-center gap-1.5 text-[9px] font-black text-rose-500 py-1 font-sans">
                                <span className="text-2xl animate-bounce">🧧</span>
                                <span>🔮 正在虔诚祈福摇晃签筒，消除霉运中...</span>
                              </div>
                            ) : drawnFortune ? (
                              <div className="flex flex-col items-center text-center select-text">
                                <p className="text-[10px] font-black text-red-650 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">{drawnFortune.split("】")[0]}】</p>
                                <p className="text-[8.5px] text-zinc-700 leading-relaxed font-bold mt-1.5 px-1 font-sans">
                                  {drawnFortune.split("】")[1]}
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1 py-1">
                                <p className="text-[8px] text-zinc-500 font-bold leading-relaxed font-sans px-1">
                                  本局挑战是否牌路不顺？轻点下方召唤祭坛，摇出您的啵啵每日专属消除大吉签，获取萌宠真灵加护！
                                </p>
                              </div>
                            )}
                          </div>

                          {!isDrawing && (
                            <button
                              onClick={() => {
                                audio.playTap();
                                setIsDrawing(true);
                                setTimeout(() => {
                                  try {
                                    audio.playAdComplete();
                                  } catch {}
                                  const fortunes = [
                                    "🧧 【神灵附体】消除欲望极其膨胀！槽位自动扩容，底牌一眼望穿，今日宜冲击荣耀巅峰！",
                                    "🍊 【大吉大利】仙橙气力笼罩槽位！消去一个繁杂挂念，收获满堂彩，国战胜率飙升88%！",
                                    "💫 【乾坤一掷】洗牌之光常伴左右！乾坤大挪移触发概率激增，卡牌如流水般消融！",
                                    "⚡ 【神速无双】脑力突破上限潜能！思维火花四溅，秒杀倒计时，本省名号易如反掌！",
                                    "🛡️ 【不灭英豪】家乡厚土保底守护！逆境中必定起死回生，代表省份出战必得满誉！",
                                    "🍵 【慢条佛系】佛系慢乐消除，灵台清明！轻松避开死卡死槽，享受满眼啵啵皆萌气！"
                                  ];
                                  const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
                                  setDrawnFortune(randomFortune);
                                  setIsDrawing(false);
                                }, 900);
                              }}
                              className="w-full py-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 hover:from-red-600 hover:to-orange-600 hover:scale-[1.01] active:scale-95 text-white font-black text-[9px] rounded-xl tracking-wider transition-all shadow-md shadow-red-500/15 cursor-pointer text-center"
                            >
                              🔥 {drawnFortune ? "✨ 再次奉请御神签" : "🏮 立即开始虔诚摇签"}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upgrade / Cheat status layout at the bottom */}
                  <div className="shrink-0 flex justify-between items-center p-2 bg-white/85 border border-zinc-200/50 rounded-2xl shadow-xs">
                    <span className="text-[8.5px] text-zinc-600 font-bold flex items-center gap-1">
                      {isVVIP ? (
                        <span className="text-yellow-600 animate-pulse font-extrabold flex items-center gap-0.5">👑 至尊荣耀VIP • {selectedProvince} 披风战神</span>
                      ) : (
                        <>⚔️ 代表 {selectedProvince} 争夺家乡桂冠！</>
                      )}
                    </span>
                    <button 
                      onClick={toggleCheat}
                      id="toggle-cheat-btn"
                      className={`py-1 px-2 text-[8.5px] font-black transition-all cursor-pointer flex items-center gap-0.5 active:scale-95 rounded-xl border ${
                        cheatMode 
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-orange-400 shadow-sm shadow-orange-500/10" 
                          : "bg-radial from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-150 text-amber-900 border-amber-300 shadow-xs"
                      }`}
                    >
                      {cheatMode ? (
                        payTier === "trial" ? "🏷️ 1天体验卡" :
                        payTier === "weekly" ? "🎫 免广告周卡" :
                        payTier === "monthly" ? "⭐ 免广告月卡" : "👑 尊享季卡"
                      ) : (
                        "🔑 尊享金手指特权"
                      )}
                    </button>
                  </div>

                </motion.div>
              )}

              {/* GAMEPLAY AREA */}
              {gameState === "playing" && (
                <motion.div 
                  key="playing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-yellow-50/40 p-2 flex flex-col justify-between"
                >
                  
                  {/* Playing Score Header */}
                  <div className="flex justify-between items-center z-10 shrink-0">
                    <button 
                      onClick={() => { 
                        audio.playTap(); 
                        if (isPvPMode && gameState === "playing") {
                          setPvpWinStreak(0);
                          localStorage.setItem("wechat_pvp_win_streak", "0");
                          showWechatToast("⚠️ 中途弃权退出视为认输，PVP级天梯连胜已重置！");
                        }
                        setGameState("lobby"); 
                        setIsPvPMode(false); 
                        setPvpState("idle");
                      }}
                      className="p-1 px-2 bg-white border border-zinc-200 hover:bg-zinc-150 rounded-lg text-zinc-500 hover:text-zinc-900 transition flex items-center gap-1 text-[9px] font-bold cursor-pointer"
                    >
                      <LogOut size={10} /> 退出返回
                    </button>
                    
                    <div className="flex flex-col items-center">
                      <div className="text-[10px] text-slate-500 font-bold flex items-center gap-0.5 select-none">
                        🚩 代表：<span className="text-zinc-800 font-semibold">{userAvatar} {selectedProvince}</span>
                      </div>
                      <div className="text-xs font-black text-rose-600 tracking-wide mt-0.5">
                        {isPvPMode ? "⚡ 1v1 天梯排位赛" : `关卡 ${currentLevel} • 剩 `}
                        {!isPvPMode && <span className="text-sm font-black text-slate-800 font-mono">{activeTiles.length}</span>}
                        {!isPvPMode && " 牌"}
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        if (isPvPMode) {
                          handleStartPvP("random");
                        } else {
                          handleReplay();
                        }
                      }}
                      className="p-1.5 bg-white border border-zinc-200 hover:bg-zinc-150 rounded-lg text-zinc-500 transition cursor-pointer"
                    >
                      <RefreshCw size={10} className="text-slate-600" />
                    </button>
                  </div>

                  {/* STANDARD LEVEL COUNTDOWN HEADER BAR */}
                  {!isPvPMode && (
                    <div className="bg-white/80 border border-zinc-200/50 rounded-xl p-1.5 flex flex-col gap-1 shrink-0 select-none shadow-xs z-10 transition-all mt-1 bg-gradient-to-r from-teal-50/25 to-yellow-50/25">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-zinc-650 flex items-center gap-1">
                          ⏱️ {timerChallengeEnabled ? "限时狂欢挑战" : "经典闲逸模式"}
                          <button 
                            onClick={() => {
                              audio.playTap();
                              if (!timerChallengeEnabled) {
                                // Turn on: reset timer to progressive default for this level (Level 1: 10s, Level 2: 20s, Level 3: 30s, up to 60s max)
                                const levelDuration = Math.min(60, currentLevel * 10);
                                setTimeLeft(levelDuration);
                                setMaxTime(levelDuration);
                              }
                              setTimerChallengeEnabled(!timerChallengeEnabled);
                            }}
                            className={`ml-1 px-1 py-[1.5px] rounded text-[7.5px] font-black cursor-pointer shadow-xs border ${
                              timerChallengeEnabled 
                                ? "bg-amber-400 hover:bg-amber-500 border-amber-300 text-slate-900" 
                                : "bg-emerald-500 hover:bg-emerald-600 border-emerald-400 text-white"
                            }`}
                          >
                            {timerChallengeEnabled ? "切为慢消" : "切定挑战"}
                          </button>
                        </span>
                        
                        <div className="flex items-center gap-1.5 font-mono">
                          {timerChallengeEnabled ? (
                            timeFreezeLeft > 0 ? (
                              <span className="text-[10px] font-black tracking-wider text-cyan-600 animate-pulse bg-cyan-50 px-1.5 py-0.5 rounded-lg border border-cyan-200">
                                ❄️ 冰冻中 &lsquo;{timeFreezeLeft}s&rsquo;
                              </span>
                            ) : (
                              <span className={`text-[10px] font-black tracking-wider ${timeLeft <= Math.max(5, maxTime * 0.3) ? "text-red-500 animate-pulse font-extrabold" : "text-slate-800"}`}>
                                {timeLeft <= Math.max(5, maxTime * 0.3) ? "⚠️ 极限 " : "⏳ "}{timeLeft} 秒
                              </span>
                            )
                          ) : (
                            <span className="text-zinc-400 text-[8.5px]">♾️ 慢消无限秒</span>
                          )}
                        </div>
                      </div>

                      {timerChallengeEnabled && (
                        <div className="relative">
                          <div className={`w-full h-1.5 rounded-full overflow-hidden transition-all ${timeFreezeLeft > 0 ? "bg-cyan-100/50 border border-cyan-200" : "bg-zinc-250"}`}>
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${
                                timeFreezeLeft > 0 
                                  ? "bg-cyan-400" 
                                  : timeLeft <= Math.max(5, maxTime * 0.3) 
                                    ? "bg-red-500 animate-pulse" 
                                    : timeLeft <= (maxTime / 2) 
                                      ? "bg-amber-400" 
                                      : "bg-emerald-500"
                              }`}
                              style={{ width: `${(timeLeft / maxTime) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MINI PVP SEARCH HUD IF SEARCHING OR FOUND */}
                  {isPvPMode && (pvpState === "searching" || pvpState === "found") && (
                    <div className="absolute inset-0 bg-slate-950/95 flex flex-col justify-center items-center p-6 z-30 select-none text-center">
                      <div className="relative mb-5">
                        <div className="w-16 h-16 rounded-full border-4 border-emerald-500/25 border-t-emerald-400 animate-spin flex items-center justify-center"></div>
                        <div className="absolute inset-2 bg-zinc-950 rounded-full flex items-center justify-center text-3xl animate-pulse">
                          {pvpState === "searching" ? "📡" : "🎯"}
                        </div>
                      </div>

                      {pvpState === "searching" ? (
                        <>
                          <h4 className="text-sm font-black text-emerald-400">正在搜索全网高段位对手...</h4>
                          <p className="text-[9.5px] text-zinc-400 mt-2 max-w-[200px] leading-relaxed">
                            正在同步微信赛区数据，分配实力最均衡的其他地区精彩选手
                          </p>
                          <span className="text-[10px] font-mono text-zinc-500 mt-2 block">系统配对中: {pvpSearchTimer} 秒</span>
                        </>
                      ) : (
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="space-y-3"
                        >
                          <span className="text-[8.5px] bg-red-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse leading-none">READY VS MATCH</span>
                          <h4 className="text-base font-black text-white leading-tight">成功锁死对战局！</h4>
                          
                          <div className="flex items-center justify-center gap-6 py-2">
                            <div className="text-center">
                              <span className="text-3xl block">{userAvatar}</span>
                              <span className="text-[10px] text-teal-400 font-black block mt-1.5">{selectedProvince.slice(0, 3)}</span>
                            </div>
                            
                            <span className="text-yellow-400 font-extrabold text-lg animate-bounce shrink-0">🆚</span>

                            <div className="text-center">
                              <span className="text-3xl block">{pvpOpponent?.avatar}</span>
                              <span className="text-[10px] text-rose-400 font-black block mt-1.5">{pvpOpponent?.province.slice(0, 3)}</span>
                            </div>
                          </div>

                          <span className="text-[9.5px] text-emerald-400 font-bold block leading-none">
                            首盘对决开始，比快比脑力！
                          </span>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* ACTIVE LIVE COMBAT HEADER BLOCK FOR PLAYING PvP COORDS */}
                  {isPvPMode && pvpState === "playing" && (
                    <div className="bg-slate-900 border border-slate-950 rounded-2xl p-2 flex flex-col gap-1.5 shrink-0 select-none shadow-md z-10 transition-all">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <div className="flex items-center gap-1.5 text-zinc-350 relative">
                          <div className="relative shrink-0">
                            <span className="text-sm bg-slate-800 p-1 rounded-full border border-slate-750 inline-block w-7 h-7 text-center leading-5">{userAvatar}</span>
                            {/* Animated Emoji Popover for User */}
                            {userActiveEmoji && (
                              <div className="absolute -top-7 -left-1 bg-gradient-to-r from-amber-400 to-yellow-300 border border-teal-500 text-zinc-900 rounded-full text-[10px] w-6 h-6 flex items-center justify-center shadow-lg font-black animate-bounce z-40">
                                {userActiveEmoji.emoji}
                              </div>
                            )}
                          </div>
                          <div className="text-left leading-none">
                            <span className="block font-black text-teal-400">我方 ({selectedProvince.slice(0, 2)})</span>
                            <span className="text-[8px] font-mono mt-0.5 inline-block text-zinc-400">剩余: {activeTiles.length} 卡牌</span>
                          </div>
                        </div>

                        <div className="px-1.5 py-0.5 bg-gradient-to-r from-red-500 to-amber-500 rounded-full text-[8px] font-mono font-black tracking-widest text-white shrink-0 animate-bounce">
                          VS
                        </div>

                        <div className="flex items-center gap-1.5 text-zinc-350 text-right relative justify-end">
                          <div className="text-right leading-none">
                            <span className="block font-black text-rose-400">{pvpOpponent?.name?.slice(0, 5)} ({pvpOpponent?.province.slice(0, 2)})</span>
                            <span className="text-[8px] font-mono mt-0.5 inline-block text-zinc-400">完成: {opponentProgress}%</span>
                          </div>
                          <div className="relative shrink-0">
                            <span className="text-sm bg-slate-800 p-1 rounded-full border border-slate-755 inline-block w-7 h-7 text-center leading-5">{pvpOpponent?.avatar}</span>
                            {/* Animated Emoji Popover for Opponent */}
                            {opponentActiveEmoji && (
                              <div className="absolute -top-7 -right-1 bg-gradient-to-r from-yellow-300 to-orange-400 border border-rose-500 text-zinc-900 rounded-full text-[10px] w-6 h-6 flex items-center justify-center shadow-lg font-black animate-bounce z-40">
                                {opponentActiveEmoji.emoji}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Split screen progress indicators */}
                      <div className="grid grid-cols-2 gap-3 pb-0.5">
                        <div className="relative">
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-teal-400 h-full rounded-full transition-all duration-300"
                              style={{ width: `${Math.max(10, Math.min(100, (1 - (activeTiles.length || 0) / 48) * 100))}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-rose-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${opponentProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Combat live ticker updates & interactive emoji shelf */}
                      <div className="bg-black/40 py-1 px-1.5 rounded-lg flex justify-between items-center gap-1.5">
                        <div className="text-left text-[8px] font-mono text-yellow-300 truncate flex-1 leading-tight select-none pr-1">
                          {pvpFeeds[0] || "💬 战局火热打响中，连消阻抗..."}
                        </div>
                        {/* Interactive Express Emoji Action Bar */}
                        <div className="flex items-center gap-0.5 shrink-0 bg-white/10 border border-white/15 px-1.5 py-0.5 rounded-lg z-20 max-w-[170px] overflow-x-auto scrollbar-none shadow-inner">
                          <span className="text-[7px] text-zinc-350 font-black mr-1 select-none tracking-tight shrink-0 font-sans">投子:</span>
                          {["😄", "😂", "🤪", "😤", "😱", "😎", "🥳", "😭", "😮", "👿", "👍", "🔥"].map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => sendPvpEmoji(emoji)}
                              className="text-xs w-5 h-5 hover:bg-white/15 active:scale-130 transition-all flex items-center justify-center rounded cursor-pointer shrink-0"
                              title={`发送限时表情 ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Explosive Match Shockwave Banner Display */}
                  {blastNotice && (
                    <div className="absolute top-11 left-2 right-2 z-40">
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0, y: -10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="py-1 px-2.5 bg-amber-500 border border-amber-600 rounded-xl text-white text-[8px] font-black text-center shadow-lg flex items-center justify-center gap-1"
                      >
                        <Zap size={11} className="text-yellow-200 animate-bounce" />
                        <span>{blastNotice}</span>
                      </motion.div>
                    </div>
                  )}

                  {/* Main Grid Card Stage Floor */}
                  <div className="flex-1 relative my-1 rounded-2xl bg-amber-100/35 border border-yellow-250/50 p-1.5 overflow-hidden flex items-center justify-center animate-fade-in animate-duration-300">
                    
                    {/* Cute Decorative Background Layers (bubbles, cute paw prints, falling flower petals) */}
                    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
                      {/* Quiet/Transparent cute paw prints watermarks at corners */}
                      <span className="absolute top-2.5 left-2.5 text-rose-300/30 text-xl rotate-[-15deg] select-none font-sans">🐾</span>
                      <span className="absolute bottom-2.5 right-2.5 text-rose-300/25 text-xl rotate-[15deg] select-none font-sans">🐾</span>
                      <span className="absolute top-1/3 -right-2.5 text-yellow-500/15 text-2xl rotate-12 select-none font-sans">🐾</span>
                      <span className="absolute bottom-1/4 -left-2 text-rose-300/20 text-xl rotate-45 select-none font-sans">🐾</span>

                      {/* Falling Cherry Blossom Petals 🌸 drifting gently down the screen */}
                      {[
                        { id: 'p1', delay: 0.5, left: '12%', size: 13, rotate: [0, 360] },
                        { id: 'p2', delay: 2.8, left: '42%', size: 10, rotate: [12, 380] },
                        { id: 'p3', delay: 5.2, left: '76%', size: 15, rotate: [-20, 320] },
                        { id: 'p4', delay: 7.5, left: '90%', size: 11, rotate: [45, 415] },
                      ].map(petal => (
                        <motion.div
                          key={petal.id}
                          animate={{
                            y: [-25, 360],
                            x: [0, -20, 15, 0],
                            rotate: petal.rotate,
                            opacity: [0, 0.7, 0.7, 0]
                          }}
                          transition={{
                            duration: 11,
                            repeat: Infinity,
                            delay: petal.delay,
                            ease: "linear"
                          }}
                          className="absolute text-rose-300/50 filter drop-shadow-xs select-none"
                          style={{
                            left: petal.left,
                            fontSize: petal.size,
                            top: -25
                          }}
                        >
                          🌸
                        </motion.div>
                      ))}

                      {/* Drifting Aesthetic Translucent Pink/Teal Bubbles 🎈 floating from bottom to top */}
                      {[
                        { id: 'b1', delay: 0, left: '22%', size: 9, y: [160, -40] },
                        { id: 'b2', delay: 2.4, left: '85%', size: 13, y: [170, -30] },
                        { id: 'b3', delay: 4.8, left: '55%', size: 11, y: [150, -50] },
                        { id: 'b4', delay: 7.2, left: '5%', size: 10, y: [165, -35] },
                      ].map(bubble => (
                        <motion.div
                          key={bubble.id}
                          animate={{
                            y: bubble.y,
                            x: [0, 12, -12, 0],
                            opacity: [0, 0.55, 0.55, 0]
                          }}
                          transition={{
                            duration: 9.5,
                            repeat: Infinity,
                            delay: bubble.delay,
                            ease: "easeInOut"
                          }}
                          className="absolute rounded-full bg-linear-to-tr from-pink-200/20 via-teal-100/10 to-white/10 border border-white/20 shadow-xs"
                          style={{
                            left: bubble.left,
                            width: bubble.size,
                            height: bubble.size,
                            bottom: -20
                          }}
                        />
                      ))}
                    </div>

                    {/* Floating Cute Emojis Animation Overlay */}
                    <AnimatePresence>
                      {isPvPMode && floatingEmojis.map(item => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 155, scale: 0.5, x: `${item.x}%` }}
                          animate={{ opacity: [0, 1, 1, 0], y: -90, scale: [0.5, 1.45, 1.45, 0.9] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.8, ease: "easeOut" }}
                          className="absolute pointer-events-none z-50 drop-shadow-md select-none"
                          style={{ left: 0 }}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-3xl filter drop-shadow animate-bounce select-none">{item.emoji}</span>
                            <span className={`text-[7px] text-white px-1.5 py-[0.5px] rounded-full scale-75 origin-center font-black select-none ${
                              item.isOpponent ? "bg-rose-500 border border-rose-450" : "bg-teal-500 border border-teal-450"
                            }`}>
                              {item.isOpponent ? "对方" : "我方"}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {activeTiles.length === 0 ? (
                      <div className="text-center animate-pulse z-10">
                        <span className="text-4xl">✨</span>
                        <p className="text-[11px] text-amber-700 font-black mt-2">恭喜通关！正在计入省份总榜里 🎉</p>
                      </div>
                    ) : (
                      <div className="relative w-full aspect-square max-w-[280px] min-[360px]:max-w-[305px] min-[400px]:max-w-[335px] mx-auto my-auto z-10">
                        {activeTiles.map((tile) => {
                          const leftPct = 12 + (tile.gridX + 2) * 19;
                          const topPct = 12 + (tile.gridY + 2) * 19;
                          const shadowScale = 2 + tile.layer * 2.5;

                          // Get adorable short visual nickname from label (e.g. 麻薯布丁兔 -> 布丁兔, 焦糖流心猫 -> 流心猫)
                          const shortName = tile.label.slice(-3);

                          return (
                            <motion.div
                              key={tile.id}
                              id={`tile-item-${tile.id}`}
                              layoutId={tile.id}
                              style={{
                                left: `${leftPct}%`,
                                top: `${topPct}%`,
                                zIndex: 10 + tile.layer * 5,
                                x: "-50%",
                                y: "-50%",
                                filter: tile.isLocked ? 'brightness(0.55) grayscale(0.5)' : 'none',
                                boxShadow: tile.isLocked 
                                  ? 'none' 
                                  : `0 ${2.5 + tile.layer * 1.5}px 0 0 rgba(197, 137, 24, 0.7), 0 ${4 + tile.layer * 3.5}px ${shadowScale}px 0 rgba(0,0,0,0.12)`
                              }}
                              onClick={() => handleTileClick(tile)}
                              whileHover={tile.isLocked ? {} : { scale: 1.08 }}
                              whileTap={tile.isLocked ? {} : { scale: 0.88 }}
                              transition={{ type: "spring", stiffness: 360, damping: 24 }}
                              className={`absolute w-10.5 h-12.5 rounded-xl border flex flex-col items-center justify-between py-1 transition-colors ${
                                tile.bgColor
                              } ${
                                tile.isLocked 
                                  ? "brightness-[0.55] saturate-[0.55] border-zinc-400 select-none cursor-not-allowed" 
                                  : "cursor-pointer"
                              }`}
                            >
                              {/* Slanted shiny cover overlay */}
                              {!tile.isLocked && !tile.isFrozen && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 rounded-xl" />
                              )}

                              {/* Cute sparkle decorator for active top level objects */}
                              {!tile.isLocked && !tile.isFrozen && (
                                <span className="absolute top-0.5 right-0.5 text-[5px] text-amber-400/80 animate-pulse select-none leading-none">✨</span>
                              )}

                              {/* Emoji item */}
                              <span 
                                className="text-xl sm:text-2xl mt-0.5 leading-none select-none inline-block" 
                              >
                                {tile.symbol}
                              </span>

                              {/* Adorable Mini Tag badge at bottom of matching card */}
                              <span className={`text-[6.5px] scale-80 font-black px-1 rounded-md text-center tracking-tighter shrink-0 leading-none py-0.5 select-none ${
                                tile.isLocked 
                                  ? "bg-zinc-200/50 text-zinc-500" 
                                  : "bg-white/80 text-amber-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-yellow-200/40"
                              } truncate max-w-[90]`}>
                                {shortName}
                              </span>

                              {/* Creative Overlay 1: Ice-frozen Barrier symbol */}
                              {tile.isFrozen && (
                                <div className="absolute inset-0 bg-blue-300/60 border border-blue-200/80 rounded-xl flex flex-col items-center justify-center animate-pulse z-40">
                                  <span className="text-xs filter drop-shadow-xs">❄️</span>
                                  <span className="text-[6px] text-blue-800 scale-75 font-black mt-0.5 tracking-tighter select-none leading-none">双击解冻</span>
                                </div>
                              )}

                              {/* Creative Overlay 2: Chameleon Shapeshifter magic symbol */}
                              {tile.isChameleon && !tile.isLocked && !tile.isFrozen && (
                                <div className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center border border-white z-50">
                                  <span className="text-[7px] font-black scale-90 leading-none">★</span>
                                </div>
                              )}

                              {/* Display level stats badge under cheat codes */}
                              {cheatMode && (
                                <span className="absolute bottom-[2px] right-[4px] text-[7px] text-zinc-400 font-mono scale-90">
                                  L{tile.layer}
                                </span>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Temp out placeholder area */}
                  {holder.length > 0 && (
                    <div className="my-[4px] p-1 bg-yellow-105 border border-yellow-250 border-dashed rounded-xl shrink-0">
                      <div className="flex items-center justify-between px-1 mb-1">
                        <span className="text-[8px] text-amber-800 font-bold leading-none">暂存缓冲坑位 ({holder.length}/3)</span>
                        <span className="text-[7.5px] text-zinc-500 leading-none">点击自动挪回下槽</span>
                      </div>
                      <div className="flex gap-2 justify-center h-8 select-none">
                        {holder.map((tile) => (
                          <div
                            key={tile.id}
                            onClick={() => handleHolderTileClick(tile)}
                            className="w-7.5 h-7.5 rounded-lg border flex items-center justify-center cursor-pointer shadow-xs hover:scale-105 active:scale-95 transition-all bg-white border-zinc-200"
                          >
                            <span className="text-md leading-none">{tile.symbol}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Tray Slot Collector (7 maximum capacity slots) */}
                  <div className="bg-zinc-800/90 shadow-inner px-1 pt-1.5 pb-1 rounded-xl border border-zinc-700 select-none text-center shrink-0">
                    <div className="flex gap-1 justify-center relative min-h-10">
                      
                      {Array.from({ length: 7 }).map((_, idx) => (
                        <div 
                          key={idx} 
                          className="w-8.5 h-8.5 bg-zinc-700/50 rounded-lg border border-zinc-650 border-dashed flex items-center justify-center shrink-0"
                        >
                          <span className="text-[7px] text-zinc-500 font-mono">{idx + 1}</span>
                        </div>
                      ))}

                      {/* Display active tray elements */}
                      <div className="absolute left-0 right-0 top-0 bottom-0 flex gap-1 justify-center px-1">
                        <AnimatePresence>
                          {tray.map((tile, idx) => {
                            const isEliminating = eliminatingTileIds.includes(tile.id);
                            return (
                              <motion.div
                                key={`${tile.id}-tray-${idx}`}
                                layoutId={tile.id}
                                initial={{ scale: 0.3, scaleX: 0.3, scaleY: 1.3, y: -45, rotate: -20 }}
                                animate={isEliminating ? {
                                  scale: [1, 1.5, 0.1],
                                  scaleX: [1, 1.6, 0.1],
                                  scaleY: [1, 0.5, 0.1],
                                  rotate: [0, 25, -25, 360],
                                  y: [0, -25, 10],
                                  filter: [
                                    "brightness(1) drop-shadow(0 0 0px rgba(251,191,36,0))",
                                    "brightness(2) drop-shadow(0 0 16px #fbbf24)",
                                    "brightness(2.5) drop-shadow(0 0 24px #fbbf24)"
                                  ]
                                } : { 
                                  scale: 1, 
                                  scaleX: 1,
                                  scaleY: 1,
                                  y: 0,
                                  rotate: 0
                                }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={isEliminating ? {
                                  duration: 0.45,
                                  ease: "easeInOut"
                                } : { 
                                  type: "spring", 
                                  stiffness: 450, 
                                  damping: 18,
                                  mass: 0.85
                                }}
                                className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center border font-bold ${tile.bgColor} shadow-md shrink-0 relative`}
                              >
                                <span className="text-lg leading-none">{tile.symbol}</span>
                                {isEliminating && (
                                  <span className="absolute inset-0 flex items-center justify-center text-xs animate-ping opacity-80 text-yellow-400 font-mono">
                                    ✨
                                  </span>
                                )}
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>

                    </div>
                  </div>

                  {/* Share Group Feed Ribbon Bonus */}
                  <div className="mt-[3px] flex justify-center select-none shrink-0 z-10">
                    <button 
                      onClick={() => {
                        audio.playTap();
                        setSharePresetType("help");
                        setShareModalOpen(true);
                        setCopiedShareLink(false);
                      }}
                      className="w-full py-[2px] px-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500 hover:from-teal-500 hover:to-emerald-650 text-white rounded-lg text-[8px] font-black shadow-xs flex items-center justify-center gap-1 cursor-pointer animate-pulse border border-emerald-400/20"
                    >
                      <span>🤝 【寻友求助互助】与亲友打气即可直接补满道具 ➔</span>
                    </button>
                  </div>

                  {/* Time Booster Powerups Panel */}
                  {timerChallengeEnabled && (
                    <div className="grid grid-cols-2 gap-1 mt-1 px-0.5 z-10 select-none">
                      {/* Power: Add Time (+15s) */}
                      <button
                        onClick={() => {
                          if (addTimeCount > 0 || cheatMode) {
                            if (!cheatMode) setAddTimeCount(prev => prev - 1);
                            setTimeLeft(prev => Math.min(maxTime, prev + 15));
                            audio.playTap();
                            setBlastNotice("⏱️ 使用了【加时沙漏】，时间延长 15 秒！");
                            setTimeout(() => setBlastNotice(null), 2500);
                          } else {
                            audio.playTap();
                            setBlastNotice("❌ 【加时沙漏】用光了！消除萌宠有 25% 概率获得，或点击上方【寻友求助】免费补满！");
                            setTimeout(() => setBlastNotice(null), 3000);
                          }
                        }}
                        className="py-[3px] px-1 bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-150 active:scale-95 transition-all text-slate-800 border border-amber-200 rounded-lg flex items-center justify-between shadow-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-1 text-left">
                          <span className="text-xs">⏱️</span>
                          <div className="leading-none">
                            <span className="text-[8.5px] font-extrabold text-amber-900 block">加时沙漏</span>
                            <span className="text-[6.5px] text-zinc-500 font-medium block mt-0.5">时间 +15秒</span>
                          </div>
                        </div>
                        <span className="text-[7.5px] font-black bg-amber-200/80 text-amber-900 px-1 py-0.5 rounded-full border border-amber-300 leading-none">
                          {cheatMode ? "∞" : `${addTimeCount}次`}
                        </span>
                      </button>

                      {/* Power: Freeze Time (❄️ 5s) */}
                      <button
                        onClick={() => {
                          if (freezeTimeCount > 0 || cheatMode) {
                            if (!cheatMode) setFreezeTimeCount(prev => prev - 1);
                            setTimeFreezeLeft(prev => prev + 5);
                            audio.playTap();
                            setBlastNotice("❄️ 使用了【冰冻时钟】，时空暂停 5 秒，从容点击！");
                            setTimeout(() => setBlastNotice(null), 2500);
                          } else {
                            audio.playTap();
                            setBlastNotice("❌ 【冰冻时钟】用光了！消除萌宠有 25% 概率获得，或点击上方【寻友求助】免费补满！");
                            setTimeout(() => setBlastNotice(null), 3000);
                          }
                        }}
                        className="py-[3px] px-1 bg-gradient-to-r from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-150 active:scale-95 transition-all text-slate-800 border border-cyan-200 rounded-lg flex items-center justify-between shadow-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-1 text-left">
                          <span className="text-xs">❄️</span>
                          <div className="leading-none">
                            <span className="text-[8.5px] font-extrabold text-cyan-900 block">冰冻时钟</span>
                            <span className="text-[6.5px] text-zinc-500 font-medium block mt-0.5">时空冻结 5秒</span>
                          </div>
                        </div>
                        <span className="text-[7.5px] font-black bg-cyan-200/80 text-cyan-950 px-1 py-0.5 rounded-full border border-cyan-300 leading-none">
                          {cheatMode ? "∞" : `${freezeTimeCount}次`}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Bottom Powerup Operational Trays */}
                  <div className="grid grid-cols-3 gap-1 mt-1 shrink-0 z-10 select-none">
                    
                    {/* Power 1: Undo (撤销) */}
                    <button 
                      onClick={handleUndo}
                      className="py-1 px-0.5 bg-white hover:bg-zinc-50 active:scale-95 transition-all text-slate-700 border border-zinc-200 rounded-lg flex flex-col items-center justify-center"
                    >
                      <RotateCcw size={11} className="text-zinc-500" />
                      <span className="text-[8.5px] font-bold mt-0.5 leading-none">撤销单着</span>
                      <span className="text-[7px] border bg-zinc-100 text-zinc-600 px-1 rounded-full font-bold mt-0.5 leading-none">
                        {cheatMode ? "∞" : `${undoCount}次`}
                      </span>
                    </button>

                    {/* Power 2: Out/Remove (移出) */}
                    <button 
                      onClick={handleOut}
                      className="py-1 px-0.5 bg-white hover:bg-zinc-50 active:scale-95 transition-all text-slate-700 border border-zinc-200 rounded-lg flex flex-col items-center justify-center"
                    >
                      <LogOut size={11} className="text-zinc-500 rotate-270" />
                      <span className="text-[8.5px] font-bold mt-0.5 leading-none">移出前三</span>
                      <span className="text-[7px] border bg-zinc-100 text-zinc-600 px-1 rounded-full font-bold mt-0.5 leading-none">
                        {cheatMode ? "∞" : `${outCount}次`}
                      </span>
                    </button>

                    {/* Power 3: Shuffle (洗牌) */}
                    <button 
                      onClick={handleShuffle}
                      className="py-1 px-0.5 bg-white hover:bg-zinc-50 active:scale-95 transition-all text-slate-700 border border-zinc-200 rounded-lg flex flex-col items-center justify-center"
                    >
                      <Shuffle size={11} className="text-zinc-500" />
                      <span className="text-[8.5px] font-bold mt-0.5 leading-none">随机洗乱</span>
                      <span className="text-[7px] border bg-zinc-100 text-zinc-600 px-1 rounded-full font-bold mt-0.5 leading-none">
                        {cheatMode ? "∞" : `${shuffleCount}次`}
                      </span>
                    </button>

                  </div>

                  {/* EXPLODING & TACTILE MATCH PARTICLES RENDER STAGE */}
                  <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                    <AnimatePresence>
                      {matchingParticles.map((particle) => (
                        <motion.div
                          key={particle.id}
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0
                          }}
                          initial={{ 
                            x: particle.x, 
                            y: particle.y, 
                            scale: 0, 
                            rotate: 0, 
                            opacity: 1 
                          }}
                          animate={{ 
                            x: particle.x + (particle.vx * 15), 
                            y: particle.y + (particle.vy * 15), 
                            scale: [0, particle.scale * 1.35, 0], 
                            rotate: particle.rotate, 
                            opacity: [1, 1, 0] 
                          }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ 
                            duration: 1.1, 
                            ease: "easeOut" 
                          }}
                          className="text-[15px] font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                        >
                          {particle.symbol}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                </motion.div>
              )}

              {/* OUT OF SLOTS RECOVERY video ad popup prompt */}
              {gameState === "revive_prompt" && (
                <motion.div 
                  key="revive_prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 z-40 text-center animate-fade-in"
                >
                  <div className="bg-white rounded-3xl p-5 w-full max-w-[280px] shadow-2xl flex flex-col items-center border border-zinc-100">
                    <span className="text-4xl mb-3">{failReason === "time_out" ? "⏰" : "😭"}</span>
                    <h3 className="text-xs font-black text-rose-600 tracking-wide">
                      {failReason === "time_out" ? "时间耗尽！代表荣誉受阻" : "槽位蓄满！代表荣誉受阻"}
                    </h3>
                    <p className="text-[9.5px] text-slate-500 mt-2 px-1 leading-normal font-medium">
                      {failReason === "time_out" 
                        ? "限定挑战倒计时已经枯竭！千万不要言弃，获得一次能效补给，即可重新注入 60 秒充沛操作时长，原地复活消灭残存卡牌！"
                        : "收集槽被填满了！千万不要言弃，获得一次绿色支援可在底栏免除出局惩罚，并在收集槽内腾出 3 个空闲槽位！"
                      }
                    </p>
                    
                    <div className="w-full space-y-2 mt-4.5 select-none">
                      {/* NEW: FREE SHARE TO REVIVE (3 times daily limit) */}
                      {claimedMilestones.includes("m2") && (
                        <button 
                          onClick={handleMilestoneFreeRevive}
                          disabled={hasUsedMilestoneReviveToday}
                          className={`w-full py-2.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-600 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/30 active:scale-97 border-2 border-yellow-300 ${
                            hasUsedMilestoneReviveToday ? "opacity-50 cursor-not-allowed filter grayscale" : "animate-pulse"
                          }`}
                        >
                          <span>👑 【齐天大消】免广告直接免费复活</span>
                          <span className="text-[8px] bg-amber-700/60 px-1.5 py-0.5 rounded-full font-sans font-black leading-none shrink-0 text-yellow-100">
                            {hasUsedMilestoneReviveToday ? "今日已用" : "可用一次"}
                          </span>
                        </button>
                      )}

                      <button 
                        onClick={handleShareRevive}
                        className={`w-full py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 active:scale-97 border border-emerald-300 ${
                          shareReviveLeft <= 0 && !cheatMode ? "opacity-50 cursor-not-allowed filter grayscale" : ""
                        }`}
                      >
                        <span>🟢 分享好友/朋友圈免费复活</span>
                        <span className="text-[9px] bg-emerald-600/50 px-1.5 py-0.5 rounded-full font-mono font-bold leading-none">
                          {cheatMode ? "∞" : `${shareReviveLeft}次`}
                        </span>
                      </button>

                      {/* SHARE TO REFILL ALL POWERS option */}
                      <button 
                        onClick={() => { audio.playTap(); setSharePresetType("help"); setShareModalOpen(true); }}
                        className="w-full py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 rounded-xl text-[10.5px] font-black transition flex items-center justify-center gap-1 cursor-pointer border border-amber-300 active:scale-97 shadow-xs"
                      >
                        🤝 寻友助攻：强力免费补满百宝道具 ➔
                      </button>

                      <button 
                        onClick={() => triggerRewardedAdPopup("revive")}
                        className="w-full py-1.5 bg-zinc-100 hover:bg-zinc-150 text-zinc-700 border border-zinc-200/60 rounded-xl text-[9.5px] font-bold transition flex items-center justify-center gap-1 cursor-pointer active:scale-97"
                      >
                        <Tv size={10} fill="currentColor" /> 赞助特约能效视频：原地复活
                      </button>

                      <button 
                        onClick={() => { audio.playTap(); setGameState("gameover"); }}
                        className="w-full py-1 text-zinc-400 hover:text-zinc-550 text-[8px] bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/30 rounded-lg transition"
                      >
                        放弃不救，返回大厅
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AD VIDEO VIEW SCREEN */}
              {gameState === "ad_watching" && (
                <motion.div 
                  key="ad_watching"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-slate-900 flex flex-col justify-between z-50 text-white select-none relative"
                >
                  
                  {/* Ribbon */}
                  <div className="flex justify-between items-center p-2.5 text-[9px] bg-slate-950/85">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-teal-500/25 border border-teal-500 text-teal-400 px-1 py-[1.5px] rounded-[3px] text-[8px] font-bold">联盟专签</span>
                      <span className="text-zinc-400">大自然萌宠绿色流量合作商</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-zinc-300 font-mono tracking-wide">{adTimer} 秒</span>
                      <button 
                        disabled={adTimer > 0}
                        onClick={handleCloseAdPrematurely}
                        className={`p-1.5 rounded-full ${
                          adTimer > 0 
                            ? "bg-slate-800 text-zinc-400 cursor-not-allowed opacity-50" 
                            : "bg-white text-black hover:bg-zinc-200"
                        }`}
                      >
                        <X size={8} />
                      </button>
                    </div>
                  </div>

                  {/* Ad Video Canvas Visual */}
                  <div className="flex-1 bg-gradient-to-tr from-slate-950 via-teal-950 to-emerald-950 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-radial-at-c from-transparent to-black" />
                    
                    <div className="w-20 h-20 rounded-full border border-emerald-500/20 flex items-center justify-center bg-zinc-900/50 mb-4 animate-pulse">
                      <Sparkles size={30} className="text-emerald-400" />
                    </div>

                    <h2 className="text-xs font-black text-emerald-400 tracking-wider">官方特约：拼多多果园丰收节</h2>
                    <p className="text-[10px] text-zinc-300/80 max-w-[190px] mt-2 leading-relaxed">
                      "无需浇水，极速满产。1元包邮，新鲜车厘子顺丰送到家！"
                    </p>

                    <div className="mt-5 flex gap-1 items-center">
                      <span className="text-[9px] text-emerald-300 font-bold bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        关爱能效进度 (100% 解锁神奇特权)
                      </span>
                    </div>
                  </div>

                  {/* Ad footer */}
                  <div className="p-2.5 bg-slate-950 text-center shrink-0 flex flex-col items-center">
                    <p className="text-[8.5px] text-zinc-500">
                      感谢支持绿色创作！此完播可累计积攒 **80.00** 关爱萌宠基金爱心能效
                    </p>
                    <div className="w-full bg-slate-800 h-1 mt-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-1000"
                        style={{ width: `${((15 - adTimer) / 15) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* LEVEL VICTORY DISPLAY */}
              {gameState === "victory" && (
                <motion.div 
                  key="victory"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-teal-100 to-indigo-100 flex flex-col justify-center items-center p-6 z-40 text-center"
                >
                  <CanvasConfetti active={gameState === "victory"} onShake={triggerCameraShake} />

                  <motion.div
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 6, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 2.2 }}
                    className="text-6xl mb-3 select-none filter drop-shadow-sm"
                  >
                    👑🐾🎉
                  </motion.div>

                  <span className="text-[8px] bg-teal-500 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase leading-none select-none tracking-widest">
                    SOLVED WITH HIGH INTELLECT
                  </span>

                  <h3 className="text-base font-black text-teal-800 uppercase tracking-wide leading-none mt-2">
                    成功战胜第 {currentLevel} 关!
                  </h3>
                  <p className="text-[10px] text-indigo-800 mt-1.5 max-w-[210px] leading-normal font-medium">
                    哇塞！你太棒啦！凭借精妙的头脑风暴已经带领 <strong className="text-pink-600">{selectedProvince}</strong> 队伍在全服总榜大步迈进！
                  </p>

                  <div className="bg-white/90 border border-teal-200/40 p-3.5 rounded-2xl w-full max-w-[240px] shadow-xs flex flex-col gap-1.5 mt-3.5 text-left">
                    <div className="flex justify-between items-center text-[9px] text-zinc-500">
                      <span>为省份争光添加:</span>
                      <span className="font-extrabold text-teal-700">+{currentLevel * 250} 荣耀积分</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-zinc-500">
                      <span>本级通关排名:</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                        <CheckCircle2 size={10} /> 全国前 0.12% 勇士
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-zinc-500 border-t border-zinc-100 pt-1.5 mt-1">
                      <span>本命萌宠祝福:</span>
                      <span className="font-bold text-pink-600">🐰 麻薯布丁兔 (福运+99)</span>
                    </div>
                  </div>

                  <div className="w-full max-w-[240px] space-y-2 mt-4 select-none">
                    {/* Share trigger button */}
                    <button 
                      onClick={() => { audio.playTap(); setSharePresetType("poster"); setShareModalOpen(true); }}
                      className="w-full py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs animate-pulse"
                    >
                      📸 炫耀战绩：生成超萌朋友圈海报
                    </button>

                    <button 
                      onClick={() => { audio.playTap(); setGameState("lobby"); }}
                      className="w-full py-2 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Award size={11} fill="white" /> 前往地区排行/下一关
                    </button>
                  </div>
                </motion.div>
              )}

              {/* GAME OVER SCREEN */}
              {gameState === "gameover" && (
                <motion.div 
                  key="gameover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-zinc-50 via-rose-50 to-zinc-100 flex flex-col justify-center items-center p-6 z-40 text-center animate-fade-in"
                >
                  <span className="text-6xl mb-3 select-none animate-bounce">😭🐾</span>
                  
                  <h3 className="text-sm font-black text-rose-600 tracking-tight flex items-center gap-1 mt-1 font-sans">❌ 智商告急！遗憾止步第 {currentLevel} 关</h3>
                  <p className="text-[9.5px] text-zinc-500 px-2 leading-relaxed mt-2 font-medium">
                    差一步就能为 <strong className="text-rose-600 font-extrabold">{selectedProvince}</strong> 夺下全服之巅的积分荣誉了！隔壁村的大妈都已经过了第2关大摇大摆炫耀了，你确定不叫上死党/老铁，给你发一波“保命元气弹”复活接着消吗？
                  </p>

                  <div className="w-full max-w-[220px] space-y-2.5 mt-5 select-none">
                    {/* Share help button */}
                    <button 
                      onClick={() => { audio.playTap(); setSharePresetType("help"); setShareModalOpen(true); }}
                      className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer animate-pulse shadow-md"
                    >
                      🤝 发送到微信：找长辈/损友送温暖恢复
                    </button>

                    <button 
                      onClick={handleReplay}
                      className="w-full py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={10} /> 重新挑战关卡
                    </button>

                    <button 
                      onClick={() => { audio.playTap(); setGameState("lobby"); }}
                      className="w-full py-1.5 text-zinc-400 hover:text-zinc-600 text-[10px] transition"
                    >
                      返回大厅大本营
                    </button>
                  </div>
                </motion.div>
              )}

              {/* PvP OUTCOME VICTORY DISPLAY */}
              {isPvPMode && pvpState === "victory" && (
                <motion.div 
                  key="pvp_victory"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 text-white flex flex-col justify-center items-center p-6 z-40 text-center"
                >
                  <CanvasConfetti active={isPvPMode && pvpState === "victory"} onShake={triggerCameraShake} />

                  <motion.div
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2.2 }}
                    className="text-6xl mb-3 select-none"
                  >
                    🏆⭐🦁
                  </motion.div>

                  <span className="text-[8px] bg-emerald-500 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest leading-none">
                    RANK DUEL VICTORY
                  </span>

                  <h3 className="text-base font-black text-emerald-400 mt-2.5 leading-none">
                    1v1 天梯对决大捷！
                  </h3>
                  <p className="text-[10px] text-zinc-350 mt-1.5 max-w-[210px] leading-relaxed">
                    在狂流激荡的天梯赛，你奇迹通关，力挫了代表 <strong>{pvpOpponent?.province}</strong> 的悍将 <strong>{pvpOpponent?.name}</strong>！
                  </p>

                  <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-2xl w-full max-w-[240px] shadow-sm flex flex-col gap-1.5 mt-4 text-left font-mono">
                    <div className="flex justify-between items-center text-[9px] text-zinc-400">
                      <span>捍卫省份:</span>
                      <span className="font-extrabold text-teal-400">{selectedProvince}</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-zinc-400">
                      <span>注入天梯信仰:</span>
                      <span className="font-extrabold text-amber-500 flex items-center gap-0.5">
                        <Sparkles size={10} className="text-amber-400 fill-amber-400" /> +1,200 分
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-zinc-400 border-t border-zinc-800 pt-1.5 mt-1">
                      <span>天梯对战局胜利奖赏:</span>
                      <span className="font-bold text-amber-400">+350 赛区福运点 (对决彩蛋)</span>
                    </div>
                  </div>

                  <div className="w-full max-w-[240px] space-y-2 mt-5 select-none">
                    <button 
                      onClick={() => { audio.playTap(); setSharePresetType("friend"); setShareModalOpen(true); }}
                      className="w-full py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-50 hover:to-orange-600 text-slate-900 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs animate-pulse"
                    >
                      🏆 微信群荣耀晒战绩/邀请好友
                    </button>

                    <button 
                      onClick={() => { 
                        audio.playTap(); 
                        setGameState("lobby"); 
                        setIsPvPMode(false); 
                        setPvpState("idle"); 
                      }}
                      className="w-full py-2 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-md"
                    >
                      返回天梯大厅
                    </button>
                  </div>
                </motion.div>
              )}

              {/* PvP OUTCOME DEFEATED DISPLAY */}
              {isPvPMode && pvpState === "defeated" && (
                <motion.div 
                  key="pvp_defeated"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-rose-950 to-zinc-950 text-white flex flex-col justify-center items-center p-4 z-40 text-center"
                >
                  <span className="text-5xl mb-3 select-none">💔😭</span>

                  <span className="text-[8px] bg-rose-600 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest leading-none">
                    RANK DUEL DEFEATED
                  </span>

                  <h3 className="text-base font-black text-rose-500 mt-2.5 leading-none">
                    天梯稍逊一筹！
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-1 max-w-[210px] leading-relaxed">
                    极其遗憾，<strong>{pvpOpponent?.name}</strong> 代表的 <strong>{pvpOpponent?.province}</strong> 战队先人一步解了盘面。
                  </p>

                  <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-2xl w-full max-w-[245px] shadow-sm flex flex-col gap-1.5 mt-3 text-left font-mono">
                    <div className="flex justify-between items-center text-[9px] text-zinc-400">
                      <span>战败结算:</span>
                      <span className="font-extrabold text-zinc-300">本局不扣分</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-zinc-400 border-t border-zinc-800 pt-1 mt-1">
                      <span>萌宠抚慰大礼包:</span>
                      <span className="font-bold text-teal-400">+100 萌圈元气 (安睡加油包)</span>
                    </div>
                  </div>

                  <div className="w-full max-w-[240px] space-y-2 mt-5 select-none">
                    <button 
                      onClick={() => { audio.playTap(); setSharePresetType("family"); setShareModalOpen(true); }}
                      className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                    >
                      🆘 微信拉救兵：发群摇人来帮我复仇
                    </button>

                    <button 
                      onClick={() => handleStartPvP("random")}
                      className="w-full py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={10} /> 瞬间复仇 PK
                    </button>

                    <button 
                      onClick={() => { 
                        audio.playTap(); 
                        setGameState("lobby"); 
                        setIsPvPMode(false); 
                        setPvpState("idle"); 
                      }}
                      className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl text-[10px] transition border border-zinc-700 cursor-pointer"
                    >
                      退出返回大厅
                    </button>
                  </div>
                </motion.div>
              )}

              {/* INTERACTIVE CUTE WECHAT SHARE AND INVITE MODAL Overlay */}
              {shareModalOpen && (
                <motion.div
                  key="wechat_share_modal"
                  initial={{ opacity: 0, y: 300 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 300 }}
                  className="absolute inset-0 bg-slate-900/95 flex flex-col justify-end z-50 select-none text-left rounded-3xl overflow-hidden"
                >
                  <div className="bg-zinc-50 rounded-t-3xl p-4 flex flex-col max-h-[92%] overflow-y-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center pb-2.5 border-b border-zinc-200">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl">💖</span>
                        <div>
                          <h4 className="text-xs font-black text-slate-800">萌宠爱心快乐分享营地</h4>
                          <p className="text-[8.5px] text-zinc-500">挑选您喜爱的方式，一键召集亲朋好友支援您的解密大盘！</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => { audio.playTap(); setShareModalOpen(false); }}
                        className="p-1 hover:bg-zinc-200 rounded-full text-zinc-500 transition cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Presets selection */}
                    <div className="grid grid-cols-4 gap-1 my-3 bg-zinc-200/60 p-1 rounded-xl">
                      {[
                        { type: "poster", label: "📸 萌系海报", desc: "朋友圈吸睛" },
                        { type: "family", label: "🏡 亲友群聊", desc: "洗碗大挑战" },
                        { type: "friend", label: "⚔️ 死党PK", desc: "天梯决高下" },
                        { type: "help", label: "🆘 满血投喂", desc: "免费领道具" }
                      ].map(tab => (
                        <button
                          key={tab.type}
                          onClick={() => {
                            audio.playTap();
                            setSharePresetType(tab.type as any);
                            setCopiedShareLink(false);
                            setShareFeedbackMsg("");
                          }}
                          className={`py-1.5 px-0.5 rounded-lg text-center transition-all flex flex-col items-center justify-center ${
                            sharePresetType === tab.type 
                              ? "bg-white text-emerald-600 shadow-xs scale-102 font-black" 
                              : "text-zinc-650 hover:text-zinc-900"
                          }`}
                        >
                          <span className="text-[10px] leading-none font-bold">{tab.label.split(" ")[0]} {tab.label.split(" ")[1]}</span>
                          <span className="text-[7px] text-zinc-400 mt-0.5 leading-none font-medium scale-90">{tab.desc}</span>
                        </button>
                      ))}
                    </div>

                    {/* Interactive Content Area based on chosen tab */}
                    <div className="flex-1 overflow-y-auto min-h-[160px] max-h-[260px] bg-white border border-zinc-200 rounded-xl p-3 shadow-xs space-y-3">
                      {sharePresetType === "poster" && (
                        <div className="space-y-2.5">
                          {/* Simulated high value generated poster */}
                          <div className="bg-gradient-to-br from-amber-50 via-pink-50 to-teal-50 border border-yellow-250 p-3 rounded-xl text-center relative overflow-hidden shadow-xs">
                            <span className="absolute -top-3 -right-3 text-6xl opacity-10">🐾</span>
                            <span className="text-[7.5px] bg-amber-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase leading-none">
                              名山萌宠打卡勋章
                            </span>
                            <h5 className="text-sm font-black text-slate-800 mt-1.5 flex items-center justify-center gap-1">
                              🐰 本命守护：麻薯布丁兔 !
                            </h5>
                            <p className="text-[9px] text-slate-600 mt-1">
                              "代表 <strong>{selectedProvince}</strong> 在极萌大陆斩获 <strong>第{currentLevel}关</strong> 终极胜利！"
                            </p>
                            
                            <div className="bg-white/80 rounded-lg p-2 mt-2 border border-yellow-101 flex items-center justify-between text-left">
                              <div>
                                <span className="text-[8px] text-zinc-400 block leading-none">本局智商评定:</span>
                                <span className="text-[10.5px] font-black text-rose-500 font-mono">🌟 智商星盘：145+ (傲视全服群儒)</span>
                              </div>
                              <span className="text-2xl animate-pulse">🎉</span>
                            </div>

                            <p className="text-[7px] text-zinc-400 font-mono mt-2 leading-none">
                              🔒 萌宠智星通关认证密钥: MM-{Math.floor(Math.random() * 9000 + 1000)}
                            </p>
                          </div>
                          
                          <p className="text-[8.5px] text-slate-500 text-center leading-normal">
                            该海报可在微信群/朋友圈产生极强视觉冲击，死党看后纷纷直呼"我也要玩"！
                          </p>
                        </div>
                      )}

                      {sharePresetType === "family" && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-teal-700 block">🏡 “相亲相爱一家人”家庭助力</span>
                          <p className="text-[9px] text-slate-500 leading-normal">
                            精心定制温馨文案，让家族长辈/亲人一键为你的萌宠加油，体验消除乐趣！
                          </p>
                          <div className="bg-zinc-50 border border-zinc-200/80 p-2.5 rounded-xl text-left">
                            <span className="text-[9.5px] font-bold text-teal-800">✉️ 家族群推荐语:</span>
                            <p className="text-[9.5px] text-zinc-650 mt-1 leading-relaxed">
                              「各位家人们！我开玩了山海萌兽：啵啵消消大国战，代表家乡拼尽全力冲进第<strong>{currentLevel}关</strong>！手速脑力极高。谁来帮我加油发点元气果汁？」
                            </p>
                          </div>
                          <p className="text-[8px] text-zinc-400 font-medium">长辈看到后会非常赞赏你的益智健康爱好，并热心给你加力！</p>
                        </div>
                      )}

                      {sharePresetType === "friend" && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-indigo-700 block">⚔️ 死党死党·天梯战书</span>
                          <p className="text-[9px] text-slate-500 leading-normal">
                            给玩游戏手速极高、最爱较劲的死党下一封硬核战书，在天梯竞技一决高下！
                          </p>
                          <div className="bg-zinc-50 border border-zinc-200/80 p-2.5 rounded-xl text-left font-mono">
                            <span className="text-[9.5px] font-bold text-indigo-800">🔥 战书密文:</span>
                            <p className="text-[9px] text-zinc-650 mt-1 leading-relaxed">
                              「不服来战！我在天梯段位代表<strong>{selectedProvince}</strong>刷新神话，卡牌残局就等高手来解！手残退后，速进房间决雌雄！」
                            </p>
                          </div>
                          <div className="flex gap-2 items-center text-[8.5px] text-indigo-650 bg-indigo-50/55 p-1 rounded-lg">
                            <span>🎮</span>
                            <span>发给损友可激活模拟 1v1 天梯对冲，双倍结算胜率。</span>
                          </div>
                        </div>
                      )}

                      {sharePresetType === "help" && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-rose-700 block">🆘 好友助力：免费补满百宝箱</span>
                          <p className="text-[9px] text-zinc-500 leading-normal">
                            点击下方模拟【死党已帮你完成助力】按钮，可跳过广告直接回满所有魔法道具！
                          </p>
                          
                          <div className="bg-rose-500/5 border border-rose-200 p-2.5 rounded-xl text-center space-y-2">
                            <p className="text-[9px] text-zinc-600 font-medium">✨ 给死党发飞信或微信，即可收到爱心能量支援包 ✨</p>
                            
                            <button
                              onClick={() => {
                                audio.playAdComplete(); // Sweet sound
                                setUndoCount(3);
                                setShuffleCount(3);
                                setOutCount(3);
                                setAddTimeCount(3);
                                setFreezeTimeCount(3);
                                setShareModalOpen(false);
                                setBlastNotice("🎁 好友已接力成功！所有通关法宝已全额免费补满（3次/项）！");
                                setTimeout(() => setBlastNotice(null), 3500);
                              }}
                              className="w-full py-1.5 bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white font-black text-[10px] rounded-xl cursor-pointer transition shadow-xs active:scale-97 animate-pulse"
                            >
                              🤝 模拟好友已点击协助：全部法宝秒速补满 !
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Integrated WeChat sharing micro-actions */}
                    <div className="mt-4 space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            audio.playAdComplete();
                            setShareModalOpen(false);
                            setBlastNotice("🟢 爱心分享成功！已帮您的萌宠回春助力！");
                            setTimeout(() => setBlastNotice(null), 3000);
                          }}
                          className="py-2.5 bg-emerald-500 hover:bg-emerald-650 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer active:scale-97 border border-emerald-600/30 text-center"
                        >
                          🟢 模拟微信好友/群转发
                        </button>

                        <button
                          onClick={() => {
                            audio.playAdComplete();
                            setShareModalOpen(false);
                            setBlastNotice("🟠 已同步至模拟朋友圈！您的排名积分已翻倍！");
                            setTimeout(() => setBlastNotice(null), 3000);
                          }}
                          className="py-2.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-100 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer active:scale-97 border border-zinc-700 text-center"
                        >
                          🟠 模拟微信朋友圈同步
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          audio.playItem();
                          navigator.clipboard.writeText(`https://ai.studio/build?roomId=M-${Math.floor(Math.random()*9000+1000)}`);
                          setCopiedShareLink(true);
                          setShareFeedbackMsg("📎 游戏邀请短链接已成功写入您的系统剪贴板！");
                          setTimeout(() => setShareFeedbackMsg(""), 3500);
                        }}
                        className="w-full py-2 bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 border border-zinc-200 text-[10px] font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer active:scale-97 text-center"
                      >
                        🔗 {copiedShareLink ? "已成功复制！快去发送" : "提取密令：复制专属战绩密令"}
                      </button>

                      {shareFeedbackMsg && (
                        <p className="text-[8px] text-emerald-600 font-bold text-center leading-none mt-1 animate-pulse">
                          {shareFeedbackMsg}
                        </p>
                      )}
                    </div>

                    <p className="text-[7.5px] text-zinc-400 text-center mt-3 select-none leading-none">
                      🔒 本栏目旨在提供真实且乐趣充足的微信群/好友闭环行为模拟。
                    </p>
                  </div>
                </motion.div>
              )}

              {/* SIMULATED WECHAT BILLING GATE FOR GOLDEN FINGER */}
              {payModalOpen && (
                <motion.div
                  key="wechat_pay_modal"
                  initial={{ opacity: 0, y: 300 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 300 }}
                  className="absolute inset-0 bg-slate-900/95 flex flex-col justify-end z-50 select-none text-left rounded-3xl overflow-hidden"
                >
                  <div className="bg-zinc-50 rounded-t-3xl p-4 flex flex-col max-h-[95%] overflow-y-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start pb-2.5 border-b border-zinc-200 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">💰</span>
                        <div>
                          <h4 className="text-xs font-black text-rose-600 flex items-center gap-0.5">
                            金手指尊享升级中心 <span className="text-[7px] bg-red-100 text-red-650 px-1 py-[0.5px] rounded-sm font-black animate-pulse">限时会员特惠</span>
                          </h4>
                          <p className="text-[8.5px] text-zinc-500">赞助微信沙盒萌宠作者，免看广告，霸服起飞！</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => { audio.playTap(); setPayModalOpen(false); }}
                        className="p-1 hover:bg-zinc-200/80 rounded-lg text-zinc-400 font-bold transition text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-2 mt-3.5">
                      {/* Tier 1: Trial */}
                      <div 
                        onClick={() => { audio.playTap(); setPayTier("trial"); }}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative ${
                          payTier === "trial" 
                            ? "bg-amber-500/5 border-amber-500 shadow-xs" 
                            : "bg-white border-zinc-200 hover:border-zinc-350"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🏷️</span>
                            <div>
                              <span className="text-[10px] font-black text-slate-800 block">1天黄金体验包 (单日尝鲜)</span>
                              <p className="text-[8px] text-zinc-400 font-medium">适合临时卡关，24小时免广告免打扰</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black font-mono text-emerald-600 font-bold">¥ 0.99</span>
                            <span className="text-[7.5px] text-zinc-400 block line-through font-medium">¥ 3.00</span>
                          </div>
                        </div>
                      </div>

                      {/* Tier 2: Weekly Subscription */}
                      <div 
                        onClick={() => { audio.playTap(); setPayTier("weekly"); }}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative ${
                          payTier === "weekly" 
                            ? "bg-amber-500/5 border-amber-500 shadow-xs" 
                            : "bg-white border-zinc-200 hover:border-zinc-350"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🎫</span>
                            <div>
                              <span className="text-[10px] font-black text-slate-800 block">特惠免广告「游戏周卡」</span>
                              <p className="text-[8px] text-zinc-400 font-medium">7天连续免广告干扰 + 全道具冷却减半</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black font-mono text-emerald-600 font-bold">¥ 2.99</span>
                            <span className="text-[7.5px] text-zinc-400 block line-through font-medium">¥ 6.00</span>
                          </div>
                        </div>
                      </div>

                      {/* Tier 3: Monthly Subscription */}
                      <div 
                        onClick={() => { audio.playTap(); setPayTier("monthly"); }}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative ${
                          payTier === "monthly" 
                            ? "bg-amber-500/10 border-amber-500 shadow-sm shadow-amber-500/10" 
                            : "bg-white border-zinc-200 hover:border-zinc-350"
                        }`}
                      >
                        {/* Recommendation badge */}
                        <span className="absolute -top-1.5 -right-1 flex h-4 items-center bg-rose-500 text-white text-[7px] font-black px-1.5 rounded-full uppercase tracking-wider shadow-xs scale-90 border border-white">
                          🔥 超值推荐
                        </span>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">⭐</span>
                            <div>
                              <span className="text-[10px] font-black text-amber-955 block">高燃免广告「至尊月卡」</span>
                              <p className="text-[8px] text-amber-900/60">30天畅爽无广告 + 道具免广告无限连发</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black font-mono text-rose-500 font-bold">¥ 8.90</span>
                            <span className="text-[7.5px] text-zinc-400 block line-through font-medium">¥ 18.00</span>
                          </div>
                        </div>
                      </div>

                      {/* Tier 4: Season Subscription */}
                      <div 
                        onClick={() => { audio.playTap(); setPayTier("season"); }}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative ${
                          payTier === "season" 
                            ? "bg-yellow-500/10 border-yellow-500 shadow-sm" 
                            : "bg-white border-zinc-200 hover:border-zinc-350"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">👑</span>
                            <div>
                              <span className="text-[10px] font-black text-yellow-955 block">荣耀免广告「至尊季卡」</span>
                              <p className="text-[8px] text-zinc-400 font-medium">90天狂欢免看广告 + 直送特效羽翼及霸气前缀</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black font-mono text-yellow-600 font-bold">¥ 19.90</span>
                            <span className="text-[7.5px] text-zinc-400 block line-through font-medium">¥ 39.00</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features checklist container */}
                    <div className="bg-zinc-100 rounded-2xl p-2.5 mt-3 space-y-2 border border-zinc-200/55">
                      <span className="text-[8.5px] font-black text-slate-800">💎 已选套餐锁定尊享特权：</span>
                      <ul className="space-y-1 text-[8.5px] text-zinc-650 font-medium leading-tight">
                        <li className="flex items-start gap-1">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span><strong>无限大招释放</strong>：撤销单着、洗牌布局、移出底槽、加时沙漏、冰冻时钟！数量直接变 <strong className="text-rose-500 font-mono">∞</strong> 颗！</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span><strong>解封秘境宝藏</strong>：免门槛直通所有受封的超自然玄秘隐藏关。</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span><strong>绝不收费广告</strong>：自动跳过并屏蔽所有插屏和弹窗视频广告，彻底告别15秒等待！</span>
                        </li>
                        {payTier === "season" && (
                          <li className="flex items-start gap-1 text-yellow-600 animate-pulse">
                            <span className="text-yellow-600 font-bold">★</span>
                            <span><strong>荣耀玩家特权</strong>：天梯对决及主页显示 “👑 至尊季卡金主 VIP”，彰显显赫身份！</span>
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Simplified WeChat simulated check out panel */}
                    <div className="mt-4 p-3 bg-white border border-zinc-200/80 rounded-2xl text-center space-y-3 shadow-xs">
                      <div className="flex justify-center items-center gap-1.5 text-zinc-500 font-medium">
                        <span className="text-[9.5px]">微信安全支付担保中心</span>
                        <span className="text-[7px] bg-zinc-200 text-zinc-500 px-1 py-[0.5px] rounded-xs font-black scale-90">官方沙盒</span>
                      </div>
                      
                      {/* Price indicator */}
                      <div className="leading-none pb-1">
                        <span className="text-[9.5px] text-zinc-400">应付金额：</span>
                        <span className="text-xl font-black font-mono text-emerald-600">
                          ¥ {payTier === "trial" ? "0.99" : payTier === "weekly" ? "2.99" : payTier === "monthly" ? "8.90" : "19.90"}
                        </span>
                      </div>

                      {/* Web and Mini-Game Compliance Disclaimer */}
                      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 text-left text-[8px] text-amber-800 leading-normal select-none">
                        ⚠️ <strong>合规演示声明：</strong>本游戏为纯虚拟的单机益智模拟器。此升级中心中展示的“充值价格”、“支付中心”等组件仅用于模拟完整微信小游戏闭环流程。<strong>本游戏不接入任何真实扣费，点击支付可完全免费解锁免广告特权。</strong>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {/* Submit pay simulated */}
                        <button
                          onClick={() => {
                            audio.playAdComplete(); // Play lovely validation tone
                            
                            // Simulate smooth WeChat checkout loading spinner
                            setBlastNotice("🟢 正在拉起 [微信安全支付] 护盾...");
                            setTimeout(() => {
                              setBlastNotice("💸 正在校验免密密钥/指纹核准...");
                              setTimeout(() => {
                                setCheatMode(true);
                                if (payTier === "season") {
                                  setIsVVIP(true);
                                }
                                setPayModalOpen(false);
                                setBlastNotice(`🎉 微信模拟付款成功！已成功解锁并激活「${
                                  payTier === "trial" ? "1天微信黄金体验会员" :
                                  payTier === "weekly" ? "免广告特惠周卡会员" :
                                  payTier === "monthly" ? "尊享免广告畅爽月卡" : "至尊无上荣耀季卡"
                                }」会员特权！`);
                                setTimeout(() => setBlastNotice(null), 4000);
                              }, 1200);
                            }, 1000);
                          }}
                          className="py-2 bg-emerald-500 hover:bg-emerald-650 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1 cursor-pointer transition shadow-md shadow-emerald-500/15 active:scale-97 border border-emerald-600/30 text-center"
                        >
                          🟢 微信支付 (模拟)
                        </button>

                        {/* Relative/Friend Pay simulation */}
                        <button
                          onClick={() => {
                            audio.playAdComplete(); // Play lovely validation
                            setBlastNotice("🤝 已向微信闺蜜/好损友发起「帮我买单」小飞信...");
                            setTimeout(() => {
                              setCheatMode(true);
                              if (payTier === "season") {
                                  setIsVVIP(true);
                              }
                              setPayModalOpen(false);
                              setBlastNotice("🎁 微信死党十分仗义！已为你全额付款购买了当前特权！");
                              setTimeout(() => setBlastNotice(null), 3500);
                            }, 1500);
                          }}
                          className="py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl text-xs font-black flex items-center justify-center gap-1 cursor-pointer transition active:scale-97 border border-amber-600/20 text-center"
                        >
                          🤝 召唤死党帮付
                        </button>
                      </div>
                    </div>

                    <p className="text-[7.5px] text-zinc-400 text-center mt-3 leading-none select-none">
                      🔒 本游戏完全免费研发，仅支持模拟交易闭环。请放心支付体验，不会扣除真实银行资金。
                    </p>
                  </div>
                </motion.div>
              )}

            </div>

          {/* SIMULATED BOTTOM BANNER AD CONTAINER */}
          <div className="shrink-0 bg-white border-t border-zinc-100 px-3 py-1.5 flex flex-col z-20">
            <div className="bg-zinc-50 border border-zinc-200/80 p-1.5 rounded-lg flex items-center justify-between shadow-xs select-none">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-zinc-800 rounded-md shrink-0 flex items-center justify-center font-bold text-xs">
                  🍈
                </div>
                <div className="leading-tight text-left">
                  <div className="text-[10px] font-bold text-slate-800 leading-none">特惠买买买: 攀枝花大芒果</div>
                  <span className="text-[8px] text-slate-400 mt-0.5 inline-block">拼着买更省！产地纯天然绿色鲜果</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between self-stretch">
                <span className="bg-zinc-200 text-zinc-500 text-[6.5px] px-[3px] rounded-xs font-bold leading-none scale-90">官方</span>
                <button 
                  onClick={() => {
                    audio.playTap();
                    onAdTrigger("banner", true); // Trigger Banner Ad Click
                    showWechatToast("🛒【模拟特惠拼单跳转】\n已为您成功调起小程序购买专区！并为您额外加持 120 桃气值能量，助力您的消除之旅！");
                  }}
                  className="py-0.5 px-1.5 bg-emerald-500 font-bold border border-emerald-600 text-[8px] text-white rounded-md mt-1 cursor-pointer hover:bg-emerald-600 transition"
                >
                  秒果子
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Physical Home Button decoration */}
        <div className="h-5 shrink-0 flex items-center justify-center mt-1">
          <div className="w-24 h-1 bg-zinc-800 rounded-full"></div>
        </div>

      </div>
    </div>
  );
}
