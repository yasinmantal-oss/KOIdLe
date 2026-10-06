import type { Tab } from '../ui/Shell';
import type { World } from '../world/world';

export interface ScreenProps {
  world: World;
  update: (fn: (w: World) => World) => void;
  go: (tab: Tab) => void;
  toast: (text: string, tone?: 'ok' | 'bad' | 'info') => void;
}
