// Operate form. Every control is labelled through Field; errors are inline, specific and say how
// to fix them; the first error takes focus on submit; the submit button stays enabled until the
// request starts and then shows its progress in its own label; leaving with unsaved changes asks
// first. The kiln constraints are the studio's real ones, so the errors teach them.

import * as React from "react";
import { AsyncButton, useAsyncAction } from "strata-react";
import { Button } from "strata-react";
import { ChoiceGroup, Field, Input, NativeSelect, Textarea } from "strata-react";
import { Booked } from "./booked";
import { MAX_PIECES_PER_BOOKING, firingTypes, kilns, type FiringType, type KilnId } from "./sample-data";

type Values = { firing: string; kiln: string; pieces: string; tallest: string; notes: string };
type Errors = Partial<Record<keyof Values, string>>;

const kilnList = (ids: KilnId[]) => (ids.length === 1 ? `Kiln ${ids[0]} only` : `Kiln ${ids.join(" or ")}`);

const firings = (Object.keys(firingTypes) as FiringType[]).map((value) => ({
  value,
  label: firingTypes[value].label,
  detail: `${kilnList(firingTypes[value].kilns)}. ${firingTypes[value].when}`,
}));

const gapped = (Object.keys(kilns) as KilnId[]).filter((k) => kilns[k].shelfGapCm);
const largest = gapped.reduce((a, b) => (kilns[b].shelfGapCm! > kilns[a].shelfGapCm! ? b : a));
const shelfHint = gapped.map((k) => `Kiln ${k} has ${kilns[k].shelfGapCm} cm between shelves`).join(", ") + ".";

export function validate(v: Values): Errors {
  const e: Errors = {};
  const pieces = Number(v.pieces);
  const tallest = Number(v.tallest);
  if (!v.firing) e.firing = "Choose a firing.";
  else {
    const allowed = firingTypes[v.firing as FiringType].kilns;
    const where = `kiln ${allowed.join(" or ")}`;
    const name = firingTypes[v.firing as FiringType].label.split(",")[0];
    if (!allowed.includes(v.kiln as KilnId)) e.kiln = `${name} firings use ${where}. Choose ${where}.`;
  }
  if (!v.pieces) e.pieces = "Enter how many pieces you are bringing.";
  else if (!Number.isInteger(pieces) || pieces < 1) e.pieces = "Enter a whole number of pieces, 1 or more.";
  else if (pieces > MAX_PIECES_PER_BOOKING)
    e.pieces = `One booking holds up to ${MAX_PIECES_PER_BOOKING} pieces. Make a second booking for the rest.`;
  const gap = kilns[v.kiln as KilnId]?.shelfGapCm;
  if (!v.tallest) e.tallest = "Enter the height of your tallest piece, in centimetres.";
  else if (gap && tallest > gap)
    e.tallest =
      v.kiln !== largest
        ? `Kiln ${v.kiln}'s shelves are ${gap} cm apart, and your tallest piece is ${tallest} cm. Choose kiln ${largest}, which takes up to ${kilns[largest].shelfGapCm} cm.`
        : `Kiln ${v.kiln} takes pieces up to ${gap} cm. Ask the kiln team about anything taller.`;
  return e;
}

const order: (keyof Values)[] = ["firing", "kiln", "pieces", "tallest", "notes"];

export function BookFiring({ initial, showErrors = false }: { initial?: Partial<Values>; showErrors?: boolean }) {
  const start: Values = { firing: "", kiln: "2", pieces: "", tallest: "", notes: "", ...initial };
  const [values, setValues] = React.useState<Values>(start);
  const [errors, setErrors] = React.useState<Errors>(showErrors ? validate(start) : {});
  const [dirty, setDirty] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  // A finished booking is its own state, not the button's phase: the button settles back to idle
  // after two seconds, and the confirmation must stay until the person leaves or books again.
  const [booked, setBooked] = React.useState<Values | null>(null);

  const submit = React.useCallback(async (v: Values) => {
    await new Promise((r) => setTimeout(r, 900)); // sample: stands in for the booking request
    setDirty(false);
    setBooked(v);
  }, []);
  const { phase, run, error } = useAsyncAction(submit);

  React.useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // beforeunload only covers leaving the document. In-app navigation (this link changes the hash,
  // which swaps the screen) asks the same question itself.
  const confirmLeave = (e: React.MouseEvent) => {
    if (dirty && !window.confirm("Leave without booking? What you have entered will be lost.")) e.preventDefault();
  };

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
    void run(values);
  };

  // Finished: the form gives way to the completion moment, which says what happened and what next.
  if (booked)
    return (
      <Booked
        firing={booked.firing as FiringType}
        kiln={booked.kiln as KilnId}
        pieces={Number(booked.pieces)}
        tallest={Number(booked.tallest)}
        onBookMore={() => {
          setBooked(null);
          setValues({ firing: "", kiln: "2", pieces: "", tallest: "", notes: "" });
          setErrors({});
          window.scrollTo(0, 0);
        }}
      />
    );

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

        <Field label="Kiln" error={errors.kiln} hint={shelfHint}>
          <NativeSelect name="kiln" value={values.kiln} onChange={(e) => set("kiln")(e.target.value)}>
            {(Object.keys(kilns) as KilnId[]).map((k) => (
              <option key={k} value={k}>
                {kilns[k].name}
              </option>
            ))}
          </NativeSelect>
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Pieces" error={errors.pieces} hint={`Up to ${MAX_PIECES_PER_BOOKING} per booking.`}>
            <Input
              name="pieces"
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_PIECES_PER_BOOKING}
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
          <AsyncButton type="submit" variant="default" phase={phase} error={error} labels={{ idle: "Book firing", pending: "Booking…", done: "Booked", error: "Try again" }} />
          <Button variant="ghost" asChild>
            <a href="#kiln-room" onClick={confirmLeave}>
              Back to the kiln room
            </a>
          </Button>
        </div>
      </form>
    </main>
  );
}
