// GetPhoneNum original offline format/parse experiment, 2026-10-12.
// Install the exact package with npm ci; do not send any fixture to a network.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parsePhoneNumberWithError } from 'libphonenumber-js/max';

const pkg = JSON.parse(readFileSync(new URL('./node_modules/libphonenumber-js/package.json', import.meta.url)));
assert.equal(pkg.version, '1.13.15');
const metadataBytes = readFileSync(new URL('./node_modules/libphonenumber-js/metadata.max.json', import.meta.url));
const metadata = JSON.parse(metadataBytes);
const fixtures = [
  { region: 'US', e164: '+12025550123', fictionalOnly: true, deliveryAllowed: false,
    source: 'https://www.nanpa.com/numbering/555-line-numbers' },
  { region: 'GB', e164: '+447700900123', fictionalOnly: true, deliveryAllowed: false,
    source: 'https://www.ofcom.org.uk/phones-and-broadband/phone-numbers/numbers-for-drama' }
];
const parse = (input, country) => parsePhoneNumberWithError(input,
  { ...(country ? { defaultCountry: country } : {}), extract: false });
const cases = [];
function measure(id, f, input, country, expectation) {
  let number = null, error = null, possible = null, valid = null;
  try {
    const p = parse(input, country);
    number = p.number; possible = p.isPossible(); valid = p.isValid();
  } catch (e) { error = e.message; }
  const sameCanonical = number === f.e164;
  if (expectation === 'same') assert.equal(sameCanonical, true, id);
  else if (expectation === 'missing-context') assert.equal(error, 'INVALID_COUNTRY', id);
  else assert.equal(sameCanonical, false, id);
  cases.push({ id, input, defaultCountry: country ?? null, expectedCanonical: f.e164,
    parsedCanonical: number, parseError: error, isPossible: possible, isValid: valid,
    sameCanonical, expectation, assertion: 'PASS' });
}
const displays = [];
for (const f of fixtures) {
  assert.equal(f.deliveryAllowed, false); assert.equal(f.fictionalOnly, true);
  const p = parse(f.e164);
  const international = p.formatInternational(), national = p.formatNational();
  const wrong = f.region === 'US' ? 'GB' : 'US';
  displays.push({ ...f, international, national, isPossible: p.isPossible(), isValid: p.isValid() });
  measure(`${f.region}-international-no-context`, f, international, undefined, 'same');
  measure(`${f.region}-international-wrong-default`, f, international, wrong, 'same');
  measure(`${f.region}-national-correct-context`, f, national, f.region, 'same');
  measure(`${f.region}-national-extra-spaces`, f, national.replaceAll(' ', '   '), f.region, 'same');
  const again = parse(national, f.region);
  assert.equal(again.formatNational(), national);
  assert.equal(again.formatInternational(), international);
  measure(`${f.region}-second-display-roundtrip`, f, again.formatInternational(), undefined, 'same');
  measure(`${f.region}-national-missing-context`, f, national, undefined, 'missing-context');
  measure(`${f.region}-national-wrong-context`, f, national, wrong, 'different-or-error');
}
const gb = fixtures[1];
assert.equal(displays[1].national.startsWith('0'), true);
assert.equal(parse(gb.e164).nationalNumber.startsWith('0'), false);
measure('GB-00-prefix-with-GB-origin', gb, '00447700900123', 'GB', 'same');
measure('GB-00-prefix-with-US-origin', gb, '00447700900123', 'US', 'different-or-error');
// Deliberately weak implementation: concatenates +44 and all national digits,
// preserving the domestic trunk zero. Compare raw serialization before parsing:
// a forgiving parser might repair it, masking the serializer's contract breach.
const weakSerialization = '+44' + displays[1].national.replace(/\D/g, '');
assert.notEqual(weakSerialization, gb.e164);
cases.push({ id: 'GB-naive-country-plus-national-digits', input: displays[1].national,
  serialized: weakSerialization, expectedCanonical: gb.e164,
  sameCanonical: false, expectation: 'different-raw-serialization', assertion: 'PASS' });
assert.equal(cases.length, 17);
const report = {
  measuredDate: '2026-10-12', node: process.version,
  scope: 'Offline complete-number display/parse round trips for two fixed fictional fixtures; not random generation, delivery, original punctuation preservation, all-country coverage, or production UI execution.',
  package: { name: pkg.name, version: pkg.version, entry: 'libphonenumber-js/max',
    metadataSchemaVersion: metadata.version,
    metadataSha256: createHash('sha256').update(metadataBytes).digest('hex') },
  datasetSourceCommit: '03c0d24410e4d4e0f886b288307eee83da03d7b8',
  parserOptions: { extract: false },
  deliveryAllowed: false,
  summary: { total: cases.length, assertionsPassed: cases.length,
    canonicalPreserved: cases.filter(x => x.sameCanonical).length,
    expectedNegativeControls: cases.filter(x => !x.sameCanonical).length },
  displays, cases
};
console.log(JSON.stringify(report, null, 2));
