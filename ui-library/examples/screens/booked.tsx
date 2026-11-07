// The completion moment for a booking (character.md §3). Rare (a member books a few times a
// month), and it follows real effort (making the pieces), so this is where the product spends its
// delight budget: a plain sentence of what happened, what to do next and when, and the figure of
// the person's own pieces on the shelf with the clearance worked out. No confetti, no "Yay!".
// Everything is derived from what was booked: the firing, the kiln and the studio's kiln facts.

import { Button } from "@/components/ui/button";
import { Done } from "@/components/ui/done";
import { celsius, integer } from "@/lib/format";
import { SAFE_TO_OPEN_C, firingTypes, kiln2Tuesday, kilns, type FiringType, type KilnId, type Piece } from "./sample-data";
import { ShelfFigure, fitsOnShelf } from "./shelf-figure";

/** Sample stand-ins for the member's pieces: the tallest is the height they entered, the rest a
 *  believable spread below it. A real booking would not know the shapes; the figure says so. */
function samplePieces(count: number, tallest: number): Piece[] {
  const spread = [1, 0.66, 0.42, 0.42, 0.55, 0.8, 0.5, 0.36];
  const widths = [7, 6, 8, 8, 5, 6, 7, 8];
  return Array.from({ length: count }, (_, i) => ({ h: Math.round(tallest * spread[i % 8]), w: widths[i % 8] }));
}

export function Booked({
  firing,
  kiln,
  pieces,
  tallest,
  onBookMore,
}: {
  firing: FiringType;
  kiln: KilnId;
  pieces: number;
  tallest: number;
  /** Starts a fresh booking. Without it, the action links to the form. */
  onBookMore?: () => void;
}) {
  const type = firingTypes[firing];
  const name = type.label.split(",")[0].toLowerCase();
  const next = type.next;
  const gap = kilns[kiln].shelfGapCm;

  // The drawing needs the kiln's current load; the example only has kiln 2's, and only draws it
  // when the pieces fit along one shelf and clear the shelf above.
  const mine = samplePieces(pieces, tallest);
  const level = kiln2Tuesday.levels.findIndex((l) => l.length === 0);
  const drawable = kiln === "2" && gap !== undefined && tallest <= gap && level >= 0 && fitsOnShelf(mine, kiln2Tuesday.shelfWidthCm);
  const shelfName = ["bottom", "middle", "top"][level] ?? `number ${level + 1}`;

  return (
    <main className="mx-auto grid grid-cols-[minmax(0,1fr)] max-w-2xl gap-8 px-4 py-6 sm:px-6">
      <Done
        title={`Booked: ${integer.format(pieces)} pieces in kiln ${kiln}'s ${name} firing on ${next.day}`}
        next={
          firing === "raku" ? (
            <p>Bring them, each labelled with your name, by {next.bringBy}. You take part in the firing.</p>
          ) : (
            <p>
              Put them on the to-fire shelf, each labelled with your name, by {next.bringBy}. We will message you when kiln{" "}
              {kiln} is below {celsius(SAFE_TO_OPEN_C)}, {next.out}.
            </p>
          )
        }
        figure={
          drawable ? (
            <figure className="grid gap-2">
              <ShelfFigure levels={kiln2Tuesday.levels} shelfWidthCm={kiln2Tuesday.shelfWidthCm} shelfGapCm={gap} mine={mine} onLevel={level} />
              <figcaption className="max-w-prose type-body-sm text-muted-foreground">
                Kiln {kiln} as loaded so far. Your pieces go on the {shelfName} shelf; your tallest, at {tallest} cm, leaves{" "}
                {gap - tallest} cm under the shelf above. Heights to scale; shapes are stand-ins.
              </figcaption>
            </figure>
          ) : undefined
        }
        actions={
          <>
            <Button variant="default" asChild>
              <a href="#kiln-room">Back to the kiln room</a>
            </Button>
            {onBookMore ? (
              <Button onClick={onBookMore}>Book more pieces</Button>
            ) : (
              <Button asChild>
                <a href="#book">Book more pieces</a>
              </Button>
            )}
          </>
        }
      />
    </main>
  );
}
