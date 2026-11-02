// Operate form. Every control is labelled through Field; errors are inline, specific and say how
// to fix them; the first error takes focus on submit; the submit button stays enabled until the
// request starts and then shows its progress in its own label; leaving with unsaved changes asks
// first. The kiln constraints are the studio's real ones, so the errors teach them.

import * as React from "react";
import { AsyncButton, useAsyncAction } from "@/components/ui/async-button";
import { Button } from "@/components/ui/button";
import { ChoiceGroup, Field, Input, NativeSelect, Textarea } from "@/components/ui/field";

type Values = { firing: string; kiln: string; pieces: string; tallest: string; notes: string };
type Errors = Partial<Record<keyof Values, string>>;

const SHELF_GAP_CM: Record<string, number> = { "1": 45, "2": 30 };

const firings = [
  { value: "bisque", label: "Bisque, cone 04", detail: "Kiln 1 only. Fridays, out on Saturday after 10:00." },
  { value: "glaze", label: "Glaze, cone 6", detail: "Kiln 1 or 2. Tuesdays and Thursdays." },
  { value: "raku", label: "Raku", detail: "Kiln 3, in the yard. Saturdays; you take part in the firing." },
];

export function validate(v: Values): Errors {
  const e: Errors = {};
  const pieces = Number(v.pieces);
  const tallest = Number(v.tallest);
  if (!v.firing) e.firing = "Choose a firing.";
  if (v.firing === "bisque" && v.kiln !== "1") e.kiln = "Bisque firings use kiln 1. Choose kiln 1.";
  if (v.firing === "raku" && v.kiln !== "3") e.kiln = "Raku is fired in kiln 3, in the yard. Choose kiln 3.";
  if (v.firing === "glaze" && v.kiln === "3") e.kiln = "Kiln 3 only fires raku. Choose kiln 1 or 2.";
  if (!v.pieces) e.pieces = "Enter how many pieces you are bringing.";
  else if (!Number.isInteger(pieces) || pieces < 1) e.pieces = "Enter a whole number of pieces, 1 or more.";
  else if (pieces > 20) e.pieces = "One booking holds up to 20 pieces. Make a second booking for the rest.";
  if (!v.tallest) e.tallest = "Enter the height of your tallest piece, in centimetres.";
  else if (SHELF_GAP_CM[v.kiln] && tallest > SHELF_GAP_CM[v.kiln])
    e.tallest =
      v.kiln === "2"
        ? `Kiln 2's shelves are 30 cm apart, and your tallest piece is ${tallest} cm. Choose kiln 1, which takes up to 45 cm.`
        : `Kiln 1 takes pieces up to 45 cm. Ask the kiln team about anything taller.`;
  return e;
}

const order: (keyof Values)[] = ["firing", "kiln", "pieces", "tallest", "notes"];

export function BookFiring({ initial, showErrors = false }: { initial?: Partial<Values>; showErrors?: boolean }) {
  const start: Values = { firing: "", kiln: "2", pieces: "", tallest: "", notes: "", ...initial };
  const [values, setValues] = React.useState<Values>(start);
  const [errors, setErrors] = React.useState<Errors>(showErrors ? validate(start) : {});
  const [dirty, setDirty] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const submit = React.useCallback(async () => {
    await new Promise((r) => setTimeout(r, 900)); // sample: stands in for the booking request
    setDirty(false);
  }, []);
  const [phase, run] = useAsyncAction(submit);

  React.useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = (key: keyof Values) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setDirty(true);
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = order.find((k) => found[k]);
    if (first) {
      const el = formRef.current?.elements.namedItem(first);
      (el instanceof RadioNodeList ? (el[0] as HTMLElement) : (el as HTMLElement | null))?.focus();
      return;
    }
    void run();
  };

  return (
    <main className="mx-auto grid grid-cols-[minmax(0,1fr)] max-w-2xl gap-8 px-4 py-6 sm:px-6">
      <header className="grid gap-1">
        <h1 className="type-title">Book a firing</h1>
        <p className="type-body text-muted-foreground">
          Bring your pieces to the kiln-room shelf, labelled with your name, by 17:00 on the day before the firing.
        </p>
      </header>

      <form ref={formRef} noValidate onSubmit={onSubmit} className="grid gap-6">
        <ChoiceGroup legend="Firing" name="firing" choices={firings} value={values.firing} onChange={set("firing")} error={errors.firing} />

        <Field label="Kiln" error={errors.kiln} hint="Kiln 1 has 45 cm between shelves, kiln 2 has 30 cm.">
          <NativeSelect name="kiln" value={values.kiln} onChange={(e) => set("kiln")(e.target.value)}>
            <option value="1">Kiln 1, large electric</option>
            <option value="2">Kiln 2, small electric</option>
            <option value="3">Kiln 3, raku (gas, in the yard)</option>
          </NativeSelect>
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Pieces" error={errors.pieces} hint="Up to 20 per booking.">
            <Input
              name="pieces"
              type="number"
              inputMode="numeric"
              min={1}
              max={20}
              autoComplete="off"
              value={values.pieces}
              onChange={(e) => set("pieces")(e.target.value)}
            />
          </Field>
          <Field label="Tallest piece, in cm" error={errors.tallest}>
            <Input
              name="tallest"
              type="number"
              inputMode="decimal"
              min={1}
              autoComplete="off"
              value={values.tallest}
              onChange={(e) => set("tallest")(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Notes for the kiln team" hint="Optional. Glazes that run, pieces that need stilts, anything fragile.">
          <Textarea name="notes" value={values.notes} onChange={(e) => set("notes")(e.target.value)} />
        </Field>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <AsyncButton type="submit" variant="default" phase={phase} labels={{ idle: "Book firing", pending: "Booking…", done: "Booked" }} />
          <Button variant="ghost" asChild>
            <a href="#kiln-room">Back to the kiln room</a>
          </Button>
        </div>
      </form>
    </main>
  );
}
