export interface BookData {
  id: string;
  title: string;
  description: string;
  content?: string;
  techStack?: string[];
  link?: string;
  position: [number, number, number];
  color: string;
}

export interface PlayerState {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
}
