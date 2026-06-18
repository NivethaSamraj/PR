import fs from 'fs';
import path from 'path';

/* ------------------------------------------------------------------ *
 *  flowTracker  (file-backed, one stable file per worker)
 *
 *  Records one "flow" per element evaluated by step(): the ordered tier
 *  attempts (DB / smart / AI), the final outcome, and whether it healed.
 *  The self-healing reporter reads the per-worker JSON file(s) this writes
 *  and merges them into self-healing-output/index.html.
 *
 *  FIXES TWO BUGS
 *  --------------
 *  1. "Only 1 flow parsed" — the previous tracker wrote a NEW timestamped
 *     file on each flush (flows-<pid>-<timestamp>.json) OR overwrote a single
 *     file, so the reporter (reading one file) saw only the last element.
 *     We now use ONE stable file per worker (flows-<pid>.json) and rewrite it
 *     with the FULL set of flows on every endFlow, so every completed element
 *     persists.
 *  2. "Select Product twice" — flows are keyed by elementName and upserted,
 *     so an element evaluated more than once in a run yields exactly one row.
 *
 *  Keep FLOW_DIR / filename in sync with selfHealingReporter.ts.
 * ------------------------------------------------------------------ */

export type FlowTier = 'db' | 'smart' | 'ai';

export interface FlowStep {
  tier: FlowTier;
  action: string;
  locator?: string;
  status: 'success' | 'failed';
  reason?: string;
  durationMs?: number;
}

export interface Flow {
  elementName: string;
  testTitle: string;
  url: string;
  steps: FlowStep[];
  finalTier: FlowTier | null;
  finalLocator: string | null;
  healed: boolean;
  writtenBack: boolean;
  startedAt: number;
  endedAt: number | null;
}

// Shared with the reporter. One file per worker (pid-suffixed) so parallel
// workers never clobber each other; reporter merges every flows-*.json here.
export const FLOW_DIR = path.join(process.cwd(), 'self-healing-output', 'flows');
const FLOW_FILE = path.join(FLOW_DIR, `flows-${process.pid}.json`);

// Authoritative in-memory store for THIS worker, keyed by elementName.
// The JSON file is always a serialization of this map's values, so the file
// can never end up with fewer flows than were completed.
const flows = new Map<string, Flow>();
let current: Flow | null = null;

function ensureDir(): void {
  if (!fs.existsSync(FLOW_DIR)) fs.mkdirSync(FLOW_DIR, { recursive: true });
}

/** Rewrite this worker's file with the FULL current flow set. */
function flushToDisk(): void {
  ensureDir();
  const payload = Array.from(flows.values());
  fs.writeFileSync(FLOW_FILE, JSON.stringify(payload, null, 2), 'utf-8');
}

export function beginFlow(elementName: string, testTitle: string, url: string): void {
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
  flows.set(elementName, flow); // upsert by elementName — never duplicates
  current = flow;
  flushToDisk();                // persist immediately so in-progress flows show too
}

export function logStep(step: FlowStep): void {
  if (!current) {
    console.warn(`flowTracker.logStep: no active flow for ${JSON.stringify(step)}`);
    return;
  }
  current.steps.push(step);
  flushToDisk();
}

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
  flushToDisk();                // FULL set persisted — every completed flow survives
}

export function getFlows(): Flow[] {
  return Array.from(flows.values());
}

/** Clear this worker's flows AND remove its file. Call in global setup. */
export function resetFlows(): void {
  flows.clear();
  current = null;
  try {
    if (fs.existsSync(FLOW_FILE)) fs.unlinkSync(FLOW_FILE);
  } catch {
    /* best-effort */
  }
}
