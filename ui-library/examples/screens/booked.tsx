// The completion moment for a booking (character.md §3). Rare (a member books a few times a
// month), and it follows real effort (making the pieces), so this is where the product spends its
// delight budget: a plain sentence of what happened, what to do next and when, and the figure of
// the person's own pieces on the shelf with the clearance worked out. No confetti, no "Yay!".

import { Button } from "@/components/ui/button";
import { Done } from "@/components/ui/done";
import { integer } from "@/lib/format";
import { NEXT_GLAZE, kiln2Tuesday, kilns, type Piece } from "./sample-data";
import { ShelfFigure, fitsOnShelf } from "./shelf-figure";

/** Sample stand-ins for the member's pieces: the tallest is the height they entered, the rest a
 *  believable spread below it. A real booking would not know the shapes; the figure says so. */
function samplePieces(count: number, tallest: number): Piece[] {
  const spread = [1, 0.66, 0.42, 0.42, 0.55, 0.8, 0.5, 0.36];
  const widths = [7, 6, 8, 8, 5, 6, 7, 8];
  return Array.from({ length: count }, (_, i) => ({ h: Math.round(tallest * spread[i % 8]), w: widths[i % 8] }));
}

export function Booked({ pieces, tallest }: { pieces: number; tallest: number }) {
  const gap = kilns[NEXT_GLAZE.kiln].shelfGapCm ?? 30;
  const mine = samplePieces(pieces, tallest);
  const fits = fitsOnShelf(mine, kiln2Tuesday.shelfWidthCm);
  const level = kiln2Tuesday.levels.findIndex((l) => l.length === 0);
  const shelfName = ["bottom", "middle", "top"][level] ?? `number ${level + 1}`;

  return (
    <main className="mx-auto grid grid-cols-[minmax(0,1fr)] max-w-2xl gap-8 px-4 py-6 sm:px-6">
      <Done
        title={`Booked: ${integer.format(pieces)} pieces in kiln ${NEXT_GLAZE.kiln}'s glaze firing on ${NEXT_GLAZE.day}`}
        next={
          <p>
            Put them on the to-fire shelf, each labelled with your name, by {NEXT_GLAZE.bringBy}. We will message you when
            kiln {NEXT_GLAZE.kiln} is below 200 °C, {NEXT_GLAZE.out}.
          </p>
        }
        figure={
          fits && level >= 0 ? (
            <figure className="grid gap-2">
              <ShelfFigure levels={kiln2Tuesday.levels} shelfWidthCm={kiln2Tuesday.shelfWidthCm} shelfGapCm={gap} mine={mine} onLevel={level} />
              <figcaption className="max-w-prose type-body-sm text-muted-foreground">
                Kiln {NEXT_GLAZE.kiln} as loaded so far. Your pieces go on the {shelfName} shelf; your tallest, at {tallest} cm,
                leaves {gap - tallest} cm under the shelf above. Heights to scale; shapes are stand-ins.
              </figcaption>
            </figure>
          ) : undefined
        }
        actions={
          <>
            <Button variant="default" asChild>
              <a href="#kiln-room">Back to the kiln room</a>
            </Button>
            <Button asChild>
              <a href="#book">Book more pieces</a>
            </Button>
          </>
        }
      />
    </main>
  );
}
