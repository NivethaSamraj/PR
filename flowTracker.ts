/* ------------------------------------------------------------------ *
 *  flowTracker
 *
 *  Records one "flow" per element evaluated by step(): the ordered tier
 *  attempts (DB / smart / AI), the final outcome, and whether it healed.
 *  The HTML / executive dashboard renders one row per flow.
 *
 *  DUPLICATE-ROW FIX
 *  -----------------
 *  Previously flows were appended to an array, so if the SAME element was
 *  evaluated more than once in a run (e.g. captured early, then re-evaluated
 *  after navigation, or the funnel exercises it twice), each evaluation
 *  produced its own row — hence "Select Product" appearing twice in the
 *  dashboard (once as the AI-healed link, once as the .filter(visible).first()
 *  resolution).
 *
 *  Flows are now stored in a Map keyed by elementName and UPSERTED. A second
 *  beginFlow() for the same element overwrites the prior record, so the
 *  dashboard shows exactly one row per element — reflecting that element's
 *  final (latest, winning) resolution. Insertion order is preserved by the
 *  Map for first-seen elements, so the dashboard ordering is stable.
 * ------------------------------------------------------------------ */

export type FlowTier = 'db' | 'smart' | 'ai';

export interface FlowStep {
  /** Which tier produced this attempt. */
  tier: FlowTier;
  /** Human-readable action label shown in the per-element step table. */
  action: string;
  /** The locator string attempted (optional for pure status rows). */
  locator?: string;
  status: 'success' | 'failed';
  /** Why it failed (only meaningful for failed steps). */
  reason?: string;
  /** Attempt duration in ms, if measured. */
  durationMs?: number;
}

export interface Flow {
  elementName: string;
  testTitle: string;
  url: string;
  steps: FlowStep[];
  /** Tier that ultimately succeeded; null if the element never resolved. */
  finalTier: FlowTier | null;
  /** Final locator string used; null if it never resolved. */
  finalLocator: string | null;
  healed: boolean;
  writtenBack: boolean;
  /** Wall-clock start of this element's flow (ms epoch). */
  startedAt: number;
  /** Wall-clock end of this element's flow (ms epoch); null until endFlow. */
  endedAt: number | null;
}

/* ------------------------------------------------------------------ *
 *  Store: keyed by elementName so one element == one row, always.
 * ------------------------------------------------------------------ */
const flows = new Map<string, Flow>();

/** The flow currently being recorded (between beginFlow and endFlow). */
let current: Flow | null = null;

/* ------------------------------------------------------------------ *
 *  beginFlow
 *
 *  Starts (or RESTARTS) the flow for an element. If the element was already
 *  evaluated earlier in this run, its record is reset rather than duplicated:
 *  the latest evaluation is the source of truth for the dashboard row.
 * ------------------------------------------------------------------ */
export function beginFlow(
  elementName: string,
  testTitle: string,
  url: string
): void {
  const flow: Flow = {
    elementName,
    testTitle,
    url,
    steps: [],
    finalTier: null,
    finalLocator: null,
    healed: false,
    writtenBack: false,
    startedAt: Date.now(),
    endedAt: null,
  };

  // Upsert: overwrites any prior flow for this element (no second row).
  flows.set(elementName, flow);
  current = flow;
}

/* ------------------------------------------------------------------ *
 *  logStep
 *
 *  Appends a tier attempt to the current flow. No-op if called outside an
 *  active flow (defensive — should not happen in normal step() usage).
 * ------------------------------------------------------------------ */
export function logStep(step: FlowStep): void {
  if (!current) {
    // A stray logStep with no active flow would otherwise be lost silently;
    // surface it so misuse is visible during development.
    console.warn(
      `flowTracker.logStep called with no active flow: ${JSON.stringify(step)}`
    );
    return;
  }
  current.steps.push(step);
}

/* ------------------------------------------------------------------ *
 *  endFlow
 *
 *  Finalises the current flow with its outcome. Idempotent-safe: if there is
 *  no active flow it does nothing.
 * ------------------------------------------------------------------ */
export function endFlow(result: {
  finalTier: FlowTier | null;
  finalLocator: string | null;
  healed: boolean;
  writtenBack: boolean;
}): void {
  if (!current) return;
  current.finalTier = result.finalTier;
  current.finalLocator = result.finalLocator;
  current.healed = result.healed;
  current.writtenBack = result.writtenBack;
  current.endedAt = Date.now();
  current = null;
}

/* ------------------------------------------------------------------ *
 *  getFlows
 *
 *  Returns one Flow per element, in first-seen order. This is what the
 *  reporter iterates to build dashboard rows — guaranteed de-duplicated.
 * ------------------------------------------------------------------ */
export function getFlows(): Flow[] {
  return Array.from(flows.values());
}

/* ------------------------------------------------------------------ *
 *  resetFlows
 *
 *  Clears all recorded flows. Call this in a global beforeAll / per-run
 *  setup if the tracker module persists across runs in a watch/dev session,
 *  so stale rows from a previous run never bleed into the next dashboard.
 * ------------------------------------------------------------------ */
export function resetFlows(): void {
  flows.clear();
  current = null;
}
