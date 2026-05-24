/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TileType } from "../types";

export interface GameTile extends TileType {
  gridX: number;
  gridY: number;
  layer: number;
  isLocked: boolean;
  isFrozen?: boolean; // Ice-blocked: requires one click to thaw/crack before being collectable
  isChameleon?: boolean; // Shift-shaping/Color-shifting pet: cycles symbols!
  originalSymbol?: string;
  originalLabel?: string;
  originalBgColor?: string;
}

// Ultra cute animal symbols pool mapped with rich theme styles (maximised adorable vibes)
export const PETS_POOL = [
  { symbol: "🐱", label: "焦糖流心猫", bgColor: "bg-amber-50 border-amber-200 text-amber-600 font-bold", textColor: "text-amber-700" },
  { symbol: "🐰", label: "麻薯布丁兔", bgColor: "bg-pink-50 border-pink-200 text-pink-600 font-bold", textColor: "text-pink-700" },
  { symbol: "🐸", label: "嘟嘟气泡蛙", bgColor: "bg-emerald-50 border-emerald-200 text-emerald-600 font-bold", textColor: "text-emerald-700" },
  { symbol: "🦊", label: "蜜桃贴贴狐", bgColor: "bg-orange-50 border-orange-200 text-orange-600 font-bold", textColor: "text-orange-700" },
  { symbol: "🐷", label: "麦兜流沙猪", bgColor: "bg-rose-50 border-rose-200 text-rose-500 font-bold", textColor: "text-rose-600" },
  { symbol: "🐼", label: "芝麻暴走熊", bgColor: "bg-zinc-100 border-zinc-200 text-zinc-700 font-bold", textColor: "text-zinc-800" },
  { symbol: "🐥", label: "啵啵芝士鸡", bgColor: "bg-yellow-50 border-yellow-250 text-yellow-550 font-bold", textColor: "text-yellow-600" },
  { symbol: "🐨", label: "懒懒考拉宝", bgColor: "bg-slate-100 border-slate-300 text-slate-700 font-bold", textColor: "text-slate-800" },
  { symbol: "🐵", label: "淘气爆米猴", bgColor: "bg-amber-100 border-amber-300 text-amber-800 font-bold", textColor: "text-amber-900" },
  { symbol: "🦁", label: "霸道呆呆狮", bgColor: "bg-yellow-100 border-yellow-300 text-amber-700 font-bold", textColor: "text-amber-800" },
];

/**
 * Recalculates the locked/obscured state of active tiles.
 * A tile is locked if there exists another tile in a higher layer (larger layer index)
 * that overlaps its coordinates.
 * Overlap criteria: |x1 - x2| < 0.65 and |y1 - y2| < 0.65.
 */
export function updateTileLocks(tiles: GameTile[]): GameTile[] {
  return tiles.map((tile) => {
    // Check if any tile in a higher layer overlaps with this one
    const overlaps = tiles.some((other) => {
      if (other.layer <= tile.layer || other.id === tile.id) return false;
      const dx = Math.abs(other.gridX - tile.gridX);
      const dy = Math.abs(other.gridY - tile.gridY);
      return dx < 0.65 && dy < 0.65;
    });
    return {
      ...tile,
      isLocked: overlaps,
    };
  });
}

/**
 * Generates tiles for up to 12 custom high-creativity stages!
 */
export function generateLevelTiles(levelId: number): GameTile[] {
  let petCount = 4;
  let occurrencesPerPet = 6; // must be a multiple of 3
  
  // High difficulty escalation & strict multiples of 3 to avoid game matching bugs
  if (levelId === 1) {
    petCount = 3;
    occurrencesPerPet = 3; // 9 tiles (Pure tutorial)
  } else if (levelId === 2) {
    petCount = 4;
    occurrencesPerPet = 9; // 36 tiles (Introduce Ice barrier)
  } else if (levelId === 3) {
    petCount = 5;
    occurrencesPerPet = 12; // 60 tiles (Chameleon shifting vortex)
  } else if (levelId === 4) {
    petCount = 6;
    occurrencesPerPet = 12; // 72 tiles (Double overlays)
  } else if (levelId === 5) {
    petCount = 6;
    occurrencesPerPet = 15; // 90 tiles (Dense layer columns)
  } else if (levelId === 6) {
    petCount = 7;
    occurrencesPerPet = 15; // 105 tiles (High level regional defense)
  } else if (levelId === 7) {
    petCount = 8;
    occurrencesPerPet = 15; // 120 tiles (Symbiosis maze)
  } else if (levelId === 8) {
    petCount = 8;
    occurrencesPerPet = 18; // 144 tiles (Bagua mystery structure)
  } else if (levelId === 9) {
    petCount = 9;
    occurrencesPerPet = 18; // 162 tiles (Ice cold realm)
  } else if (levelId === 10) {
    petCount = 9;
    occurrencesPerPet = 21; // 189 tiles (Nirvana final shield)
  } else if (levelId === 11) {
    petCount = 10;
    occurrencesPerPet = 24; // 240 tiles (Ultimate tactical duel)
  } else if (levelId === 12) {
    // Level 12: Chinese sovereign battle / 华夏巅峰封神战
    petCount = 10;
    occurrencesPerPet = 30; // 300 tiles (Extremely chaotic elite layout)
  } else if (levelId === 13) {
    // Hidden Level 13: Lost Peach Blossom / 迷失桃花源
    petCount = 10;
    occurrencesPerPet = 27; // 270 tiles (Special floral/nature theme & hyper chameleons)
  } else if (levelId === 14) {
    // Hidden Level 14: Chaos Taiji / 混沌太极星
    petCount = 10;
    occurrencesPerPet = 33; // 330 tiles (Symmetrical dual polar orbits, extreme lock frost)
  } else {
    // Hidden Level 15: Overlord Universe / 极萌无极神域
    petCount = 10;
    occurrencesPerPet = 36; // 360 tiles (The impossible infinite peak of tile layout)
  }

  // Pick pet styles
  const shuffledPool = [...PETS_POOL].sort(() => Math.random() - 0.5);
  const activePets = shuffledPool.slice(0, petCount);

  // Generate flat definitions
  const flatTileDefinitions: { symbol: string; label: string; bgColor: string; textColor: string }[] = [];
  for (const pet of activePets) {
    for (let i = 0; i < occurrencesPerPet; i++) {
      flatTileDefinitions.push(pet);
    }
  }

  // Shuffle definitions randomly
  flatTileDefinitions.sort(() => Math.random() - 0.5);

  const generatedTiles: GameTile[] = [];

  // LEVEL 1: Clean Tutorial Grid layout
  if (levelId === 1) {
    const coordinates = [
      { x: -1.0, y: -1.0 }, { x: 0.0, y: -1.0 }, { x: 1.0, y: -1.0 },
      { x: -1.0, y: 0.0 },  { x: 0.0, y: 0.0 },  { x: 1.0, y: 0.0 },
      { x: -1.0, y: 1.0 },  { x: 0.0, y: 1.0 },  { x: 1.0, y: 1.0 }
    ];
    flatTileDefinitions.forEach((def, index) => {
      const coord = coordinates[index % coordinates.length];
      generatedTiles.push({
        id: `tile-l1-${index}`,
        symbol: def.symbol,
        label: def.label,
        bgColor: def.bgColor,
        textColor: def.textColor,
        gridX: coord.x * 1.1,
        gridY: coord.y * 1.1,
        layer: 0,
        isLocked: false,
      });
    });
    return updateTileLocks(generatedTiles);
  }

  // Let's build a highly custom layers generator based on Level settings
  let tileIndex = 0;
  // Increase depth layers as levels go higher
  const maxLayer = levelId <= 3 ? 3 : levelId <= 7 ? 4 : levelId <= 10 ? 5 : 6;

  // Layered generation logic
  for (let layer = 0; layer <= maxLayer; layer++) {
    // Generate patterns per layer:
    // Layer 0 is widest, Layer max is narrowest
    const rowColCount = Math.max(3, 6 - layer); // Width shrinks as layer goes higher
    const spacing = 0.82 + (layer * 0.03);
    const offset = (layer % 2 === 0) ? 0 : 0.35;

    for (let r = 0; r < rowColCount; r++) {
      for (let c = 0; c < rowColCount; c++) {
        if (tileIndex >= flatTileDefinitions.length) break;
        const def = flatTileDefinitions[tileIndex++];
        
        // Grid centering calculations
        const xCoord = (c - (rowColCount - 1) / 2) * spacing + offset;
        const yCoord = (r - (rowColCount - 1) / 2) * spacing + offset;

        // Gimmick assignments:
        // Level 2+ introducing Frozen Blocks (ice overlay)
        const canBeFrozen = levelId >= 2 && layer === 1 && Math.random() < (0.2 + levelId * 0.04);
        
        // Level 3+ introducing Chameleons
        const canBeChameleon = levelId >= 3 && layer >= 2 && Math.random() < (0.15 + levelId * 0.03);

        generatedTiles.push({
          id: `tile-lvl${levelId}-${tileIndex}`,
          symbol: def.symbol,
          label: def.label,
          bgColor: def.bgColor,
          textColor: def.textColor,
          gridX: Number(xCoord.toFixed(2)),
          gridY: Number(yCoord.toFixed(2)),
          layer: layer,
          isLocked: false,
          isFrozen: canBeFrozen,
          isChameleon: canBeChameleon,
          originalSymbol: def.symbol,
          originalLabel: def.label,
          originalBgColor: def.bgColor,
        });
      }
    }
  }

  // Ensure remaining tiles are cleanly laid out on additional floating side towers or top layer
  // This guarantees all tiles in the definitions block are assigned, retaining pure (mod 3 === 0) math!
  while (tileIndex < flatTileDefinitions.length) {
    const def = flatTileDefinitions[tileIndex++];
    // Layout in symmetrical floating wings to be visually stunning
    const angle = (tileIndex * 137.5) * (Math.PI / 180); // Fibonacci spiral spacing
    const radius = 1.6 * Math.sqrt(Math.random()) + 0.3;
    const rx = Math.cos(angle) * radius;
    const ry = Math.sin(angle) * radius;
    
    generatedTiles.push({
      id: `tile-lvl${levelId}-spiral-${tileIndex}`,
      symbol: def.symbol,
      label: def.label,
      bgColor: def.bgColor,
      textColor: def.textColor,
      gridX: Number(rx.toFixed(2)),
      gridY: Number(ry.toFixed(2)),
      layer: Math.floor(Math.random() * 2) + 1, // place in middle hidden layers for extra brain exercise
      isLocked: false,
      isFrozen: levelId >= 4 && Math.random() < 0.25,
      isChameleon: levelId >= 5 && Math.random() < 0.2,
      originalSymbol: def.symbol,
      originalLabel: def.label,
      originalBgColor: def.bgColor,
    });
  }

  return updateTileLocks(generatedTiles);
}
