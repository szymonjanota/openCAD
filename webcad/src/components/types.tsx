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
