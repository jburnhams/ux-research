# Comparing and deciding: survey and component design

Status: design agreed with Jonathan 2026-11-12; built in strata-react in stages (section 5 says how far). Adopting the components in the four apps is a later step. Sources: jburnhams/strata-stills (`arena.py`, `server/arena.html`, `Loupe.tsx`), strata-models (`EvalPage.tsx`, `PhrasePlayer.tsx`), strata-listory (`MatchQueuePage.tsx`, `linkage/queue.py`) and bright-horizons (`web/src/screens/Review.tsx`, `Links.tsx`), read 2026-11-12 at their default branches.

## 1. What the four apps do today

| App | Screen | What is compared | What the person decides | Shape |
|---|---|---|---|---|
| strata-stills | Rating arena (`server/arena.html`, vanilla JS, not yet on Strata) | Two renderings of one photo (their Lightroom final vs automatic versions) | Left, right, equal, skip, undo, flag "something is wrong with this picture" | Blind pairwise preference |
| strata-stills | `Loupe.tsx` | One photo, a point under the pointer | Nothing; a 100% crop fetched from the server | Inspection |
| strata-models | Eval "Judge" tab (`EvalPage.tsx`) | Two model outputs for one item: image, speech audio (`PhrasePlayer`, cued around a phrase) or text; a pipeline's steps afterwards | "X is better", "Y is better", "About the same"; then the last pair is unblinded | Blind pairwise preference |
| strata-models | Eval "Outputs" tab | Every candidate's output for an item, N-up | Nothing | N-up view |
| strata-listory | Match queue (`MatchQueuePage.tsx`, `useMatchReviewQueue.ts`) | What the files say vs a proposed work and its recordings, with the model's evidence | Confirm, reject, skip a proposed match (with Undo, keys, filters in the URL, cursor paging) | Verdict on a proposal, endless queue |
| bright-horizons | Review, Links | A face crop vs the child it is filed under; two children's average faces | Approve or reject (j/k, a, r, z); link or keep apart | Verdict on a proposal; pick which to keep |

What they share, in order of how much is duplicated:

1. A **pair of things shown side by side**, one question above them, with the answer a keypress away.
2. **Blind until answered**, then optionally revealed ("Last pair: X was auto2").
3. **Answer, then Undo**, with the next item already preloaded.
4. A **queue** with filters/sort in the URL, a cursor not an offset, and a count of what is left.
5. **Statistics on the server** (Elo, Bradley-Terry with a left-side advantage and a bootstrap interval in `arena.py`; Bradley-Terry in `strata-models/evals`). These stay in Python. The frontend draws the result.
6. Things each app has and the other lacks: a flag button (arena), a "this pair is N% different" hint and a pipeline-step view (models), certainty bands and evidence (listory), a boxed face in its photo (bright-horizons), a server-side 100% crop under the pointer (stills).

The arena page is the weakest: hand-written HTML with system fonts, no zoom, no overlay and no way to see where two renderings differ, which is the thing a photo judge most wants.

## 2. What is already in strata-react and is reused

`useActiveItem` + `ActiveList` + `useHotkeys` + `KeysLegend` (keyboard), `useUndoable` + `UndoBar`, `useInfiniteLoad` + `InfiniteList`, `DataView`, `SelectableGrid`, `Thumbnail`, `Status`, `Meter`, `Dialog`, `Tabs param=`, `format`, `Done`. The new set composes these and does not replace them.

Overlap with open issues: **#78 (media playback: transport, timecode, seek)** is the audio/video control layer, so the audio/video comparison below is built on it and waits for it. #74 (Inspector / read-only property list) is the right home for the evidence list; I would use it and not build a second one. #76 drag and drop, #77 timeline, #68 workspace layout do not overlap.

## 3. Proposed design

Three levels, each usable alone.

### 3.1 Media adapters: one interface per kind of content

```ts
type Media =
  | { kind: "image"; src: string; alt: string; full?: string; size?: [number, number] }
  | { kind: "text"; text: string; format?: "plain" | "markdown" | "code"; lang?: string }
  | { kind: "audio"; src: string; clip?: [number, number]; lead?: number; tail?: number }
  | { kind: "video"; src: string; poster?: string }
  | { kind: "data"; value: unknown }          // JSON / record fields, drawn as a property list
  | { kind: "custom"; id: string; value: unknown };

interface MediaKindDef<M extends Media> {
  view(m: M, ctx: ViewContext): ReactNode;                    // one item, inside a shared viewport
  views: ComparisonMode[];                                     // which comparison modes this kind supports
  diff?(a: M, b: M): DiffView | Promise<DiffView>;             // changed regions / marked text / delta
  fullscreen?: boolean;
}
registerMedia(kind: string, def: MediaKindDef<...>): void      // for custom kinds, e.g. a face with a box
```

`Candidate<M> = { id: string; label: string; media: M; note?: string }`. In blind mode the **label shown is "A"/"B" or "Left"/"Right"**; the real id never reaches the DOM (a test asserts this, since a blind view that leaks the name in `alt` or a tooltip is the classic bug).

### 3.2 Comparison views

`<Compare a b mode onModeChange />`, mode in the URL (`?view=`). Modes, by kind:

| Mode | image | text | audio | video | data |
|---|---|---|---|---|---|
| `side` side by side (stacked on a phone) | yes | yes | yes (two players) | yes | yes |
| `swipe` overlay with a draggable divider | yes | | | yes | |
| `fade` / `blink` overlay (hold a key to flip) | yes | | | | |
| `difference` (blend difference, optional heatmap and threshold) | yes | yes (marked words) | waveform delta | | yes (changed fields only) |
| `switch` A/B: one player, same position, flip with a key | | | yes | yes | |

- **Synced viewport**: zoom (wheel, pinch, `+`/`-`/`0`) and pan are shared between both sides, with a 1:1 pixel button. Replaces the server-side `Loupe` crop where the full image is available.
- **Image difference** needs no library: CSS `mix-blend-mode: difference` for the live view, and a canvas pass for the thresholded heatmap and "N% of pixels differ" (the number the models app already shows as "% different").
- **Text diff** is word level (character level inside a changed word), shown inline or as two columns. See the dependency question in section 5.
- **Audio** keeps the playback position when flipping between A and B, can match loudness (unmatched loudness biases judges toward the louder one; this is the audio equivalent of the photo exposure trap), and can loop a region (the `PhrasePlayer` lead and tail behaviour becomes `clip`/`lead`/`tail`).
- **Full screen**: `<FullscreenFrame>` uses the Fullscreen API where there is one and falls back to a React Aria modal; the same keys keep working inside it. Entering full screen does not reset zoom or mode.
- **N-up** (`<CompareGrid items>`) for the models "Outputs" tab: same viewport sync across all tiles, pick any two to open in `Compare`.

### 3.3 Deciding

Two interaction shapes, because the apps genuinely have two:

**Preference between two** (arena, judging): 

```tsx
const vote = usePairVote({ load, submit, reveal: "after" | "never" });
<PairVote vote={vote}>            // question, Compare, VoteBar, keys legend, UndoBar, optional Reveal
```

- `VoteBar` choices are typed: `left | right | tie | skip`, plus an optional `flag` with a reason. The bar is one filled button at most: since either side may win, none is filled; the keys are the primary path (`←` `→` `↓` equal, `S` skip, `Z` undo, `F` flag) from one `Shortcut[]` list.
- Time to decide is measured and sent (`ms`, as the arena does).
- The next pair is preloaded (both images decoded) before the current one is answered.
- Undo uses `useUndoable`, so the vote is sent after the window; "Last pair" reveal is a built-in (`reveal`).
- A `RatingTable` draws what the server returns (rating, interval, head-to-head, side advantage). No fitting in JS.

**Verdict on a proposal** (listory queue, bright-horizons review and links): 

```tsx
const q = useMatchQueue({ load: useInfiniteLoad(...), decide, filters });
<MatchQueue q={q} card={(item) => <MatchCard left={...} right={...} evidence={...} />} />
```

- A `MatchCard` is a left/right `Compare` plus an **`EvidenceList`**: rows of field, left value, right value, and an agreement word (`match`, `close`, `conflict`, `unknown`, never colour alone), with the model's certainty as a `Meter`-style band (sure / likely / close / unsure: listory's bands become the shared vocabulary).
- Actions are typed `accept | reject | skip` plus app-defined ones; keyboard and Undo as above, built on `useActiveItem`.
- Sort and filters live in the URL and each option shows how many items it would leave (listory already does this).
- Pick-one among N (bright-horizons Links "which to keep") is `ChoiceGroup` over `CompareGrid`.

**As built for the pair vote (strata-react `PairVote`, issue #144).** Two things in the sketch above changed when it met the keyboard of `Compare`:

- **The answer keys are letters, not arrows.** `a` and `b` choose a side, `t` is about the same, `s` is can't tell. `←` `→` `↓` were dropped because a judge who has zoomed in presses an arrow to pan, and an arrow that casts a vote is a wrong answer recorded without a decision. Letters also do not clash with `Compare`'s `1`–`5`, `x`, `+` `-` `0` and `f`, and they go into `Compare`'s one legend (`extraShortcuts`), so there is one list and a clash is visible.
- **Choosing is a button under the pictures, never a click on them**, since a click or drag on a picture pans. The bar is `Compare`'s `footer`, so it stays on screen in full screen. No button is filled while either side can win.

**As built for audio and text (strata-react `CompareAudio`, `CompareText`, `PairJudge`, issue #146).** The table in §3.2 put every kind under one `Compare`; audio and text are separate components, because their controls share nothing with a picture's:

- **Audio is one transport and an A/B switch, never two players.** Only the chosen clip plays; the switch carries the playhead as the same time or, when the lengths differ by more than 2%, the same share of the clip (a clip 10% longer has its words later, not at the same second). A loop range is kept as shares of the clip, so it lands on the same words in the other clip.
- **Loudness is matched by default, by turning the louder clip down** to the quieter by RMS, and the page says by how much in the candidates' labels (so a blind judge learns nothing). The measure is RMS and peak in dB, not LUFS (no K-weighting or gating): enough to match two renderings of one sentence, and the code says what it is. A product that needs broadcast loudness measures it on the server and passes it in. Matching only attenuates, since a media element's volume cannot exceed 1.
- **Text is two panes scrolled together, with the word diff behind a switch, off by default**: a diff is an answer, and a judge reading for quality should read first. Changed words are marked with a background and an underline (not colour alone). The diff is word level only; the character-level pass inside a changed word that §3.2 mentions is not built. A ground-truth `reference` is shown above both and the diff starts against it ("which is closer to what was said").
- **Answering is separate from drawing** (`PairJudge`): the same keys, bar, pending, flag, progress, preload and Undo around any view. The answer keys `a` `b` `t` `s` stay clear of the audio keys (`1` `2` `x`, Space, `j` `l`, `i` `o` `c`).

**As built for video (strata-react `CompareVideo`, issue #156).** Two videos are judged on one clock, or the views mean nothing:

- **One clock, the first video leads.** Play, pause, seek and rate go to both. While playing, the follower is kept within a frame: a rate nudge of 3% when it is a frame or more off, a seek when it is 0.3 s off, and **both are paused while either has not got its next frames**, so a stall on one side is never read as the other being ahead. Not done: hiding the frame while a seek settles (an element cannot hold its old frame), and `requestVideoFrameCallback` for the loop (it fires only when the leader presents a frame, which is when a stall cannot be seen).
- **Every view keeps both videos playing**: side by side, swipe, fade and blink are one frame (or two) over the same two elements; a view change makes new elements, so the clock restores the time and whether it was playing.
- **Different pixel sizes are drawn in one box**, shaped by the first candidate's size, so neither looks bigger; past 1:1 the picture is drawn nearest-neighbour by default, because a judge looking at upscaler edges must see the pixels, not a browser's smoothing.
- **One soundtrack, the app's choice**, the other muted; the outputs normally share it, and two soundtracks must never play at once.

**As built for stepping, loops and regions (strata-react `CompareVideo`, issues #157 and #158).** Judging an upscaler is looking at a few frames, so the video view works at that grain:

- **Frame by frame** (`,` `.`): a step goes to the centre of the next or previous frame at the first video's `fps` and pauses; stepping from the element's own time, not a held guess, keeps it from drifting. A **loop range** (`i` `o` `c`) the app can hold across pairs, and **speeds down to 0.1×**, because a flicker that lasts three frames cannot be seen at 1×. **Moments** the app names are marks on the seek bar; pressing one goes there and pauses.
- **A region is a viewport**: a named box (in the source's pixels, or as shares) that fills the frame, applied to every candidate at once so the same face or the same handwriting is read in each. Chips under the toolbar and keys `q` `w` `e` `r` `y` `u` (`t` is the pair vote's tie); nearest-neighbour while one is shown; the box is outlined on the whole picture while its chip is pointed at; Shift-drag draws one by hand ("Region 3"), kept until the pair changes. Not done: opening on a given region, and touch pinch.

**As built for the video grid (strata-react `CompareVideoGrid`, issue #159).** Several candidates' videos at once are the same clock with a cost problem, so:

- **One clock for all cells**, with the same transport, stepping, loop, speeds, zoom and regions. A cell more than two frames off is marked **"Catching up"** instead of drifting silently; every cell is held while any waits for data.
- **Spend as little as a grid can**: cells load metadata only until the first play; a cell scrolled out of sight is paused, left out of the sync and brought back to the clock when it returns; **sound is off unless the screen names one cell** (eight soundtracks are noise).
- **A reference** (the source clip) comes first, is never blind, and is drawn nearest-neighbour so its own pixels are the yardstick. Not done: a "play one at a time" fallback that steps through the cells on a paused frame when decoding cannot keep up.

### 3.4 States in the types

`PairVote` and `MatchQueue` cannot be written without `skeleton`, `empty` (what teaches the next action: "make more versions with build_arena.py"), a `failure` sentence for a vote that did not save, and a `blind` flag that is explicit (`blind: true | false`, no default), since showing names to a judge is a validity bug, not a style choice.

## 4. How the apps would adopt it (later)

- strata-stills arena: replaces `arena.html` with a React screen: `PairVote` over image `Compare` (swipe, difference, 1:1 zoom), flag as a custom action, ratings page via `RatingTable`.
- strata-models: `Judge` becomes `PairVote` with a media adapter chosen by the output (image, audio with the phrase clip, text), `Outputs` becomes `CompareGrid`, the pipeline steps stay an app component shown in the reveal.
- strata-listory: `MatchQueuePage` keeps its filters and API; its card becomes `MatchCard`. `useMatchReviewQueue` is replaced by `useMatchQueue`.
- bright-horizons: Review and Links on `MatchQueue` and `CompareGrid`, with a custom `face` media kind that draws the boxed face in its photo.
- No server API is mandated. The hooks take `load` and `submit` functions, so each app keeps its endpoints.

## 5. Decisions and build order

Jonathan's decisions (2026-11-12):

1. **Image difference uses `pixelmatch`**, which strata-react already ships as a runtime dependency (the visual runner uses it), so no dependency was added. **Text diff is our own simple word and character diff for now**; whether a better text-similarity method is worth a library is revisited later.
2. Audio waveform, loudness and zoom/pan use browser APIs and our own code; no dependency.
3. Packaging (main entry or an optional `strata-react/compare` entry): the first change keeps everything in the main entry, since nothing here needs a new peer.

Order, each change with stories for every state, MSW-backed unit tests and visual baselines:

1. Built (strata-react #100): `Compare` for pictures (side, swipe, fade, blink), shared zoom and pan, full screen (`ViewportFrame`, `FullscreenFrame`).
2. Built: image difference (a live difference blend, and pixelmatch's changed pixels with a tolerance and the share that differ) and `CompareGrid`.
3. `PairVote`, `VoteBar`, blind and reveal, preloading, `RatingTable`.
4. Text and data diff, then audio and video (after strata-react #78 lands).
5. `MatchQueue`, `MatchCard`, `EvidenceList`.
6. The rules in section 3 (blind by default for preference tests, loudness and exposure matching, no filled button while either side can win, evidence in words not colour alone, a queue's count and filter counts) are moved into `patterns.md` and `components.md` as each part is built.

Rules already settled by building the first change: `blind` is a required prop with no default; a blind comparison writes only labels, never the variant id, note or the caller's alt text (and the caller serves pictures under neutral URLs, since `src` reaches the DOM); a picture that fails to load says so in its own place and the other side stays usable; the view, zoom and full-screen keys come from one shortcut list shared with the legend.
