// The design-system page: every component in every state, on the real theme. It is the first
// thing to render after a theme change and the page a reviewer reads to see what the library
// offers. A component that is installed but absent here fails the coverage check.

import * as React from "react";
import { Check, Flame, RefreshCw, Thermometer, TriangleAlert } from "lucide-react";
import { AsyncButton, type Phase } from "@/components/ui/async-button";
import { Button, IconButton } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataView, EmptyState, Skeleton } from "@/components/ui/data-view";
import { Field, Input, NativeSelect } from "@/components/ui/field";
import { Metric, MetricStrip } from "@/components/ui/metric";
import { Status } from "@/components/ui/status";

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3 border-t border-border pt-5 md:grid-cols-[12rem_1fr]">
      <h2 className="type-heading">{title}</h2>
      <div className="grid min-w-0 gap-4">{children}</div>
    </section>
  );
}

const variants = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const;
const phases: Phase[] = ["idle", "pending", "done", "error"];
const noop = () => undefined;

export function SystemPage() {
  return (
    <main className="mx-auto grid grid-cols-[minmax(0,1fr)] max-w-5xl gap-8 px-4 py-6 sm:px-6">
      <header className="grid gap-1">
        <h1 className="type-title">Components and states</h1>
        <p className="type-body text-muted-foreground">Every component on the kiln-room theme, in every state it can be in.</p>
      </header>

      <Row title="Button">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v}>
              {v === "default" ? "Book firing" : v === "destructive" ? "Cancel firing" : v === "link" ? "View schedule" : "Save changes"}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default" disabled>
            Book firing
          </Button>
          <Button disabled>Save changes</Button>
          <Button size="sm">Small</Button>
          <IconButton icon={RefreshCw} label="Refresh readings" />
          <IconButton icon={RefreshCw} label="Refresh readings" variant="outline" />
        </div>
      </Row>

      <Row title="AsyncButton">
        <div className="flex flex-wrap items-center gap-3">
          {phases.map((p) => (
            <AsyncButton key={p} variant="default" phase={p} labels={{ idle: "Book firing", pending: "Booking…", done: "Booked" }} />
          ))}
        </div>
      </Row>

      <Row title="Status">
        <div className="flex flex-wrap items-center gap-3">
          <Status tone="neutral">Booked</Status>
          <Status tone="info">Scheduled</Status>
          <Status tone="warning" icon={Flame}>
            Firing
          </Status>
          <Status tone="warning" icon={Thermometer}>
            Cooling
          </Status>
          <Status tone="success" icon={Check}>
            Ready to collect
          </Status>
          <Status tone="danger" icon={TriangleAlert}>
            Fault
          </Status>
        </div>
      </Row>

      <Row title="Field">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Pieces" hint="Up to 20 per booking.">
            <Input name="pieces-demo" inputMode="numeric" defaultValue="6" />
          </Field>
          <Field label="Tallest piece, in cm" error="Kiln 2's shelves are 30 cm apart. Choose kiln 1, which takes up to 45 cm.">
            <Input name="tallest-demo" inputMode="decimal" defaultValue="38" />
          </Field>
          <Field label="Kiln">
            <NativeSelect name="kiln-demo" defaultValue="2">
              <option value="1">Kiln 1, large electric</option>
              <option value="2">Kiln 2, small electric</option>
            </NativeSelect>
          </Field>
          <Field label="Member number" hint="Set by the studio.">
            <Input name="member-demo" defaultValue="0417" disabled />
          </Field>
        </div>
      </Row>

      <Row title="Metric">
        <MetricStrip label="Example figures">
          <Metric label="Kiln 2 temperature" value="212" unit="°C" note="Safe to open below 200 °C" />
          <Metric label="Pieces fired this month" value="386" note="41 more than October" />
          <Metric label="Failed firings this month" value="0" note="None since 12 August" />
        </MetricStrip>
      </Row>

      <Row title="DataView">
        <DataView state={{ status: "loading" }} isEmpty={() => false} skeleton={<Skeleton className="h-16" />} empty={null}>
          {() => null}
        </DataView>
        <DataView
          state={{ status: "ready", data: [] as string[] }}
          isEmpty={(d) => d.length === 0}
          skeleton={null}
          empty={
            <EmptyState title="No firings this week" action={<Button variant="default">Book a firing</Button>}>
              The next bisque is Friday. Book shelf space before 17:00 on Thursday.
            </EmptyState>
          }
        >
          {() => null}
        </DataView>
        <DataView
          state={{ status: "error", message: "The kiln controller has not reported for 20 minutes. Readings may be out of date.", retry: noop }}
          isEmpty={() => false}
          skeleton={null}
          empty={null}
        >
          {() => null}
        </DataView>
      </Row>

      <Row title="DataTable">
        <DataTable
          caption="Example table"
          rowKey={(r) => r.cone}
          initialSort={{ key: "temp", dir: "ascending" }}
          rows={[
            { cone: "04", use: "Bisque", temp: 1060 },
            { cone: "6", use: "Mid-fire glaze", temp: 1222 },
            { cone: "10", use: "Stoneware glaze, not fired here", temp: 1285 },
          ]}
          columns={[
            { key: "cone", header: "Cone", cell: (r) => r.cone },
            { key: "use", header: "Used for", cell: (r) => r.use, truncate: true },
            { key: "temp", header: "Temperature, °C", numeric: true, cell: (r) => r.temp.toLocaleString("en-GB"), sort: (a, b) => a.temp - b.temp },
          ]}
        />
      </Row>
    </main>
  );
}
