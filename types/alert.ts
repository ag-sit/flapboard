export type LineColor = 
  | "red" 
  | "green" 
  | "purple" 
  | "blue" 
  | "orange" 
  | "light-green" 
  | "brown" 
  | "gray" 
  | "yellow" 
  | "dark-gray"
  | "metro-north"
  | "lirr";

export type Severity = "minor" | "moderate" | "major" | "planned";

export type LineType = "subway" | "rail";

export interface Alert {
  id: string;
  line: string;
  lineColor: LineColor;
  lineType: LineType;
  title: string;
  description: string;
  affectedStations: string[];
  severity: Severity;
  expectedResolution?: string;
  lastUpdated: Date;
}

