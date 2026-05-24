/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TileType {
  id: string; // unique instance ID for execution
  symbol: string; // e.g. "🐱"
  label: string; // e.g. "小猫"
  bgColor: string; // Tailwind color class for pastel backgrounds
  textColor: string; // Tailwind color class
}

export interface LevelConfig {
  id: number;
  name: string;
  tilePool: { symbol: string; label: string; bgColor: string; textColor: string }[];
  layerCount: number;
  tilesPerType: number; // must be a multiple of 3
  gridWidth: number; // layout area representation
  gridHeight: number;
}

export interface AdStats {
  date: string;
  impressions: number; // 展示量
  clicks: number; // 点击量
  ctr: number; // 点击率 (%)
  ecpm: number; // eCPM (RMB)
  revenue: number; // 收益 (RMB)
}

export interface DeveloperState {
  appId: string;
  adUnitIdBanner: string;
  adUnitIdVideo: string;
  adUnitIdInterstitial: string;
  totalRevenue: number;
  todayImpressions: number;
  todayClicks: number;
  todayRevenue: number;
  statsHistory: AdStats[];
}
