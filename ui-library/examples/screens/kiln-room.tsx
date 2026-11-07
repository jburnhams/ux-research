// Operate screen. The one question: "Is my work out of the kiln yet?"
// The finding: kiln 2 is cooling and will be safe to open at a time we can compute.
// Signature move (the only flourish): the firing drawn the way the kiln controller is programmed,
// ramp and hold segments, with the safe-to-open band and the current reading labelled. The
// measured line is coloured the way the kiln glows at each temperature (DESIGN.md, Character):
// unlit clay below about 525 °C, then dull red through to yellow at the peak.

import * as React from "react";
import { CalendarClock, Check, Flame, Layers, Thermometer, TriangleAlert, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, TableSkeleton, type Column } from "@/components/ui/data-table";
import { DataView, EmptyState, type Load } from "@/components/ui/data-view";
import { LineChart } from "@/components/ui/line-chart";
import { PageHeader } from "@/components/ui/page-header";
import { Status, type Tone } from "@/components/ui/status";
import { UndoBar, useUndoable } from "@/components/ui/undo";
import { celsius, clock, day, integer } from "@/lib/format";
import { heatScale } from "./heat";
import { GlazeLabel } from "./glaze-tile";
import { KilnStrip } from "./kiln-strip";
import {
  NOW_MIN,
  SAFE_TO_OPEN_C,
  kiln1Shelves,
  minuteToDate,
  planned,
  readings,
  safeAtMin,
  glazeNames,
  type Booking,
  type KilnState,
} from "./sample-data";

const states: Record<KilnState, { tone: Tone; icon: LucideIcon; label: string }> = {
  booked: { tone: "neutral", icon: CalendarClock, label: "Booked" },
  loading: { tone: "neutral", icon: Layers, label: "Loading" },
  firing: { tone: "warning", icon: Flame, label: "Firing" },
  cooling: { tone: "warning", icon: Thermometer, label: "Cooling" },
  ready: { tone: "success", icon: Check, label: "Ready to collect" },
  fault: { tone: "danger", icon: TriangleAlert, label: "Fault" },
};

export function KilnRoom({ load }: { load: Load<Booking[]> }) {
  // Rows always come from the latest load; local state only records which ones the person has
  // withdrawn (hidden at once, committed after the undo window), so a refresh never goes stale.
  const [hidden, setHidden] = React.useState<Set<string>>(new Set());
  const { pending, schedule, undo } = useUndoable();

  const rows = load.status === "ready" ? load.data : [];
  const visible = rows.filter((r) => !hidden.has(r.id));
  const inKiln2 = visible.filter((r) => r.kiln === 2 && r.state === "cooling");
  const piecesInKiln2 = inKiln2.reduce((n, r) => n + r.pieces, 0);
  const now = readings[readings.length - 1];
  const safeAt = clock.format(minuteToDate(safeAtMin));

  const withdraw = (b: Booking) => {
    setHidden((h) => new Set(h).add(b.id));
    schedule({
      id: b.id,
      message: `Withdrew ${b.member}'s ${b.pieces} pieces from kiln ${b.kiln}.`,
      commit: () => undefined, // stands in for the withdraw request; the row stays hidden
    });
  };
  const undoWithdraw = () => {
    if (pending) setHidden((h) => {
      const next = new Set(h);
      next.delete(pending.id);
      return next;
    });
    undo();
  };

  const columns: Column<Booking>[] = [
    { key: "member", header: "Member", cell: (r) => r.member, truncate: true, sort: (a, b) => a.member.localeCompare(b.member) },
    { key: "pieces", header: "Pieces", numeric: true, cell: (r) => integer.format(r.pieces), sort: (a, b) => a.pieces - b.pieces },
    { key: "kiln", header: "Kiln", numeric: true, cell: (r) => r.kiln, sort: (a, b) => a.kiln - b.kiln },
    {
      key: "firing",
      header: "Firing",
      // The glaze's test tile beside the firing, so a member finds their work by its colour.
      cell: (r) => <GlazeLabel glaze={r.glaze}>{r.firing.replace(/^Glaze\b/, glazeNames[r.glaze])}</GlazeLabel>,
      className: "whitespace-nowrap",
    },
    {
      key: "state",
      header: "Status",
      cell: (r) => {
        const s = states[r.state];
        return (
          <Status tone={s.tone} icon={s.icon}>
            {s.label}
          </Status>
        );
      },
    },
    { key: "out", header: "Out of the kiln", cell: (r) => r.out, className: "whitespace-nowrap text-muted-foreground" },
    {
      key: "action",
      header: "",
      cell: (r) =>
        r.state === "booked" ? (
          <Button size="sm" variant="ghost" onClick={() => withdraw(r)}>
            Withdraw
          </Button>
        ) : null,
      className: "text-right",
    },
  ];

  const tableState: Load<Booking[]> = load.status === "ready" ? { status: "ready", data: visible } : load;

  return (
    <main className="mx-auto grid grid-cols-[minmax(0,1fr)] max-w-6xl gap-10 px-4 pt-6 pb-24 sm:px-6">
      <PageHeader
        title="Kiln room"
        scope={`${day.format(minuteToDate(NOW_MIN))}, updated ${clock.format(minuteToDate(now.x))}`}
        actions={
          <Button variant="default" asChild>
            <a href="#book">Book a firing</a>
          </Button>
        }
        finding={{
          text: (
            <>
              Kiln 2 is cooling at <strong className="font-semibold tabular-nums">{celsius(now.y)}</strong> and will be safe to
              open at about <strong className="font-semibold tabular-nums">{safeAt}</strong>. {integer.format(piecesInKiln2)} pieces
              from {inKiln2.length} members are inside.
            </>
          ),
          action: <Button>Message the {inKiln2.length} owners at {safeAt}</Button>,
        }}
      />

      <KilnStrip
        kilns={[
          {
            name: "Kiln 1, large electric",
            status: states.loading,
            figure: `${kiln1Shelves.booked} of ${kiln1Shelves.total}`,
            unit: "shelves",
            note: "Friday's bisque. Bookings close today at 17:00.",
            glazes: visible.filter((r) => r.kiln === 1 && r.state !== "ready").map((r) => ({ glaze: r.glaze, who: r.member })),
          },
          {
            name: "Kiln 2, small electric",
            status: states.cooling,
            figure: integer.format(now.y),
            unit: "°C",
            readings,
            note: `Safe to open at about ${safeAt}. ${integer.format(piecesInKiln2)} pieces from ${inKiln2.length} members.`,
            glazes: inKiln2.map((r) => ({ glaze: r.glaze, who: r.member })),
          },
          {
            name: "Kiln 3, raku",
            status: { ...states.booked, label: "Cold" },
            figure: "Saturday",
            note: "Raku in the yard; you take part in the firing.",
            glazes: visible.filter((r) => r.kiln === 3).map((r) => ({ glaze: r.glaze, who: r.member })),
          },
        ]}
      />

      <section aria-labelledby="firing" className="grid gap-3">
        <div className="grid gap-0.5">
          <h2 id="firing" className="type-heading">
            Kiln 2 firing
          </h2>
          <p className="type-body-sm text-muted-foreground">Glaze, cone 6. Started Wednesday at 08:00; the lid stays shut until it is safe.</p>
        </div>
        <LineChart
          label={`Kiln 2 temperature since Wednesday 08:00, now ${celsius(now.y)}`}
          series={readings}
          seriesLabel="Measured temperature"
          planned={planned}
          plannedLabel="Controller program"
          band={{ below: SAFE_TO_OPEN_C, label: `Safe to open below ${celsius(SAFE_TO_OPEN_C)}` }}
          formatX={(m) => clock.format(minuteToDate(m))}
          formatY={celsius}
          xTicks={[0, 360, 720, 1080, 1440, 1800]}
          colourScale={heatScale}
          colourScaleLabel="coloured as the kiln glows"
        />
      </section>

      <section aria-labelledby="work" className="grid gap-3">
        <h2 id="work" className="type-heading">
          Work in the kilns
        </h2>
        <DataView
          state={tableState}
          isEmpty={(rs) => rs.length === 0}
          skeleton={<TableSkeleton rows={6} columns={6} />}
          empty={
            <EmptyState
              title="All three kilns are cold"
              action={
                <Button variant="default" asChild>
                  <a href="#book">Book a firing</a>
                </Button>
              }
            >
              Nothing is booked in. Bookings for Friday's bisque close today at 17:00; glaze firings run on Tuesdays and
              Thursdays.
            </EmptyState>
          }
        >
          {(data) => (
            <DataTable
              caption="Work in the kilns"
              columns={columns}
              rows={data}
              rowKey={(r) => r.id}
            />
          )}
        </DataView>
      </section>

      <UndoBar pending={pending} onUndo={undoWithdraw} />
    </main>
  );
}
