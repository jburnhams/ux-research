// FIXTURE: an Operate-mode screen that should pass slop-lint in operate mode.
// One question ("Can I swim at Porthminster this morning?"), the finding beside the action,
// tabular figures, tokens only, standard controls, every state designed.
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { RefreshCw } from "lucide-react";

type Tide = { time: string; heightM: number; kind: "High" | "Low" };

export function TidesScreen({ tides, waterC, flag, updatedAt }: { tides: Tide[]; waterC: number; flag: "red" | "yellow" | "none"; updatedAt: Date }) {
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });
  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-6">
      <header className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold text-balance">Porthminster, today</h1>
        <Button size="icon" variant="ghost" aria-label="Refresh tide data">
          <RefreshCw />
        </Button>
      </header>

      <section aria-labelledby="window" className="grid gap-2">
        <h2 id="window" className="text-base font-medium">Slack water 07:10 to 07:50</h2>
        <p className="text-muted-foreground">
          Water {waterC.toFixed(1)}&nbsp;°C. {flag === "red" ? "Red flag: no swimming." : flag === "yellow" ? "Yellow flag: stay between the flags." : "No flag flying yet."}
        </p>
      </section>

      {tides.length === 0 ? (
        <Empty>
          <EmptyTitle>No tide predictions for this date</EmptyTitle>
          <EmptyDescription>Pick another day, or check the harbour office table.</EmptyDescription>
        </Empty>
      ) : (
        <table className="w-full border-collapse tabular-nums">
          <thead>
            <tr className="text-left text-sm text-muted-foreground">
              <th className="py-2 font-normal">Tide</th>
              <th className="py-2 font-normal">Time</th>
              <th className="py-2 text-right font-normal">Height</th>
            </tr>
          </thead>
          <tbody>
            {tides.map((t) => (
              <tr key={t.time} className="border-t border-border">
                <td className="py-2">{t.kind}</td>
                <td className="py-2">{t.time}</td>
                <td className="py-2 text-right">{t.heightM.toFixed(2)}&nbsp;m</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <footer className="text-sm text-muted-foreground">Updated {time.format(updatedAt)}</footer>
    </main>
  );
}
