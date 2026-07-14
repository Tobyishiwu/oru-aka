import {
  Zap,
  Wrench,
  Grid3x3,
  Scissors,
  Hammer,
  Wind,
  PaintRoller,
  Flame,
  Sun,
  Layers,
  Car,
  Bone,
  Cog,
} from "lucide-react";

export const TRADE_ICON = {
  Electrician: Zap,
  Plumber: Wrench,
  Tiler: Grid3x3,
  Tailor: Scissors,
  Carpenter: Hammer,
  "AC Technician": Wind,
  Painter: PaintRoller,
  Welder: Flame,
  "Solar Installer": Sun,
  "POP Ceiling Installer": Layers,
  Mechanic: Car,
  Mason: Bone,
  "Generator Technician": Cog,
  Handyman: Wrench,
};

export function getTradeIcon(trade) {
  return TRADE_ICON[trade] || Wrench;
}
