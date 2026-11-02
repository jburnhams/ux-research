import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge that `type-*` utilities are font sizes. Without this, cn() cannot tell
// `type-label` from a colour and may drop one of two classes that both survive in CSS; with stock
// shadcn the same bug drops `text-muted-foreground` next to a custom `text-*` size.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ type: ["caption", "label", "body-sm", "body", "heading", "title", "figure"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
