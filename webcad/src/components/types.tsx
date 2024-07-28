import { Unit } from "@/units";

export interface ToolAction {
  id: string;
  name: string;
  children: React.ReactNode;
  tooltip?: string;
}

export interface ToolMenuSection {
  id: string;
  tools: ToolAction[];
}

export interface PageDefinition {
  name: string;
  height: number;
  width: number;
  unit: Unit;
}
