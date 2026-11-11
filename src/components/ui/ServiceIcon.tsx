import { AppWindow, Globe, Layers, ShoppingBag, SquareTerminal, Workflow } from "lucide-react";
import type { ServiceIconKey } from "@/data/services";

const icons = {
  globe: Globe,
  terminal: SquareTerminal,
  app: AppWindow,
  bag: ShoppingBag,
  layers: Layers,
  workflow: Workflow,
} as const;

export function ServiceIcon({ name, className = "size-6" }: { name: ServiceIconKey; className?: string }) {
  const Icon = icons[name];
  return <Icon aria-hidden strokeWidth={1.25} className={className} />;
}
