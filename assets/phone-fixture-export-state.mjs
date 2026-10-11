// Original GetPhoneNum offline tutorial. Run with Node.js; no network or SMS.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';

export class BatchState {
  #revision = 0; #request = 0; #options; #batch = null;
  constructor(options) { this.change(options); }
  change(options) {
    assert.ok(['US', 'GB'].includes(options.region));
    assert.ok(Number.isInteger(options.quantity) && options.quantity >= 1 && options.quantity <= 20);
    assert.ok(Number.isInteger(options.seed) && options.seed >= 0 && options.seed < 2 ** 32);
    this.#options = Object.freeze({...options});
    this.#revision++; this.#batch = null;
  }
  begin() {
    this.#batch = null;
    return Object.freeze({revision: this.#revision, request: ++this.#request, options: this.#options});
  }
  commit(ticket, rows) {
    if (ticket.revision !== this.#revision || ticket.request !== this.#request) return false;
    assert.equal(rows.length, ticket.options.quantity);
    assert.ok(rows.every(r => r.region === ticket.options.region && r.delivery_allowed === false));
    this.#batch = Object.freeze({revision: ticket.revision, request: ticket.request,
      options: ticket.options, rows: Object.freeze(rows.map(r => Object.freeze({...r})))});
    return true;
  }
  export() {
    if (!this.#batch || this.#batch.revision !== this.#revision || this.#batch.request !== this.#request)
      throw new Error('GENERATE_CURRENT_BATCH');
    return JSON.stringify(this.#batch);
  }
}

// Fixed documented-fictional examples, not a production random-number algorithm.
export function fixtures(options) {
  const phone = options.region === 'US' ? '+12025550123' : '+447700900123';
  return Array.from({length: options.quantity}, (_, i) =>
    ({id: i + 1, region: options.region, phone, delivery_allowed: false}));
}
function deferred() { let resolve; const promise = new Promise(r => {resolve = r;}); return {promise, resolve}; }
export async function experiment() {
  const base = {region: 'US', quantity: 2, seed: 417}; const cases = [];
  const ready = () => { const s = new BatchState(base); const t = s.begin(); s.commit(t, fixtures(base)); return s; };
  for (const [field, value] of [['region', 'GB'], ['quantity', 3], ['seed', 418]]) {
    const state = ready(); state.change({...base, [field]: value});
    assert.throws(() => state.export(), /GENERATE_CURRENT_BATCH/);
    const ticket = state.begin(); assert.equal(state.commit(ticket, fixtures(ticket.options)), true);
    assert.deepEqual(JSON.parse(state.export()).options, {...base, [field]: value});
    cases.push({case: field + '_change', old_export: 'blocked', regenerated_export: 'current'});
  }
  // A -> B -> A: equal field values must not make the first A request current again.
  const state = new BatchState(base), first = state.begin();
  state.change({...base, region: 'GB'}); state.change(base); const latest = state.begin();
  const oldWork = deferred(), newWork = deferred();
  const oldCommit = oldWork.promise.then(rows => state.commit(first, rows));
  const newCommit = newWork.promise.then(rows => state.commit(latest, rows));
  newWork.resolve(fixtures(base)); assert.equal(await newCommit, true);
  const current = state.export(); oldWork.resolve(fixtures(base)); assert.equal(await oldCommit, false);
  assert.equal(state.export(), current);
  cases.push({case: 'A_B_A_late_completion', late_commit: 'rejected', current_export: 'unchanged'});
  const same = ready(), older = same.begin(), newer = same.begin();
  assert.equal(same.commit(newer, fixtures(base)), true);
  assert.equal(same.commit(older, fixtures(base)), false);
  cases.push({case: 'same_options_two_requests', older_commit: 'rejected'});
  const immutable = ready(), captured = immutable.export();
  immutable.change({...base, quantity: 3}); assert.equal(JSON.parse(captured).rows.length, 2);
  assert.throws(() => immutable.export(), /GENERATE_CURRENT_BATCH/);
  cases.push({case: 'captured_export_snapshot', captured_rows: 2, later_export: 'blocked'});
  // Deliberately weak comparator accepts old A after A -> B -> A.
  const weakAccepts = JSON.stringify(first.options) === JSON.stringify(latest.options);
  assert.equal(weakAccepts, true);
  return {node: process.version, scope: 'offline tutorial state; not live UI or production worker', cases,
    negative_control: {field_equality_only_accepts_old_A: weakAccepts},
    latest_example: JSON.parse(current), network_calls: 0};
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  console.log(JSON.stringify(await experiment(), null, 2));
