import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { parsePhoneNumberWithError } from 'libphonenumber-js/max';
const require = createRequire(import.meta.url);
const fixture = { e164: '+12025550123', region: 'US', fictionalOnly: true, deliveryAllowed: false };
// Product policy for this experiment only: an ASCII E.164-shaped API value.
// Allow outer ASCII spaces, not tabs/newlines or other normalization.
function apiField(input) {
  if (typeof input !== 'string') return false;
  const text = input.replace(/^ +| +$/g, '');
  const match = /^\+[1-9][0-9]{7,14}$/.exec(text);
  return !!match && match[0] === text;
}
const cases = [
  ['canonical', fixture.e164, true],
  ['outer-ASCII-spaces', '  ' + fixture.e164 + '  ', true],
  ['international-display', '+1 202 555 0123', false],
  ['national-display', '(202) 555-0123', false],
  ['prefix-label', 'Call: ' + fixture.e164, false],
  ['suffix-prose', fixture.e164 + ' is the test value', false],
  ['two-values', fixture.e164 + ' / +12025550124', false],
  ['repeated-plus', '++12025550123', false],
  ['middle-plus', '+1202+5550123', false],
  ['extension', fixture.e164 + ' ext. 0042', false],
  ['tel-URI', 'tel:' + fixture.e164 + ';ext=0042', false],
  ['outer-tabs', '\t' + fixture.e164 + '\t', false],
  ['trailing-newline', fixture.e164 + '\n', false],
  ['nonbreaking-spaces', '+1\u00a0202\u00a0555\u00a00123', false],
  ['fullwidth-digits', '+１２０２５５５０１２３', false],
  ['empty', '', false]
];
function parse(input, extract) {
  try {
    const p = parsePhoneNumberWithError(input, { defaultCountry: 'US', extract });
    return { outcome: 'parsed', number: p.number, extension: p.ext ?? null, sameFixture: p.number === fixture.e164, possible: p.isPossible(), valid: p.isValid() };
  } catch (e) {
    if (e.name !== 'ParseError') throw e;
    return { outcome: 'error', error: e.message };
  }
}
const observations = cases.map(([id, input, expectedApiAccepted]) => {
  const apiAccepted = apiField(input);
  assert.equal(apiAccepted, expectedApiAccepted, id);
  if (apiAccepted) {
    const p = parsePhoneNumberWithError(input.replace(/^ +| +$/g, ''), { extract: false });
    assert.equal(p.ext, undefined, id + ': no extension');
    assert.equal(p.number, fixture.e164, id + ': exact fixture');
  }
  return { id, input, expectedApiAccepted, apiAccepted, extractTrue: parse(input, true), extractFalse: parse(input, false) };
});
assert.equal(observations.find(r=>r.id==='canonical').extractFalse.sameFixture, true);
assert.equal(observations.find(r=>r.id==='prefix-label').extractTrue.sameFixture, true);
assert.equal(observations.find(r=>r.id==='prefix-label').extractFalse.outcome, 'error');
const packagePath = require.resolve('libphonenumber-js/package.json');
const metadataPath = require.resolve('libphonenumber-js/metadata.max.json');
const result = {
  measuredDate: '2026-10-14', timezone: 'Asia/Shanghai', nodeVersion: process.version,
  packageVersion: JSON.parse(readFileSync(packagePath,'utf8')).version,
  entryPoint: 'libphonenumber-js/max', metadataSha256: createHash('sha256').update(readFileSync(metadataPath)).digest('hex'),
  scope: 'Offline one-region fictional input-boundary experiment; no production UI execution, calls or SMS; parser outputs are observations, API policy expectations are assertions.',
  fixture, observations,
  summary: { inputs: observations.length, comparisonParserInvocations: observations.length * 2, totalParserInvocations: observations.length * 2 + 2, apiPolicyAssertions: observations.length, assertionsPassed: 25,
    apiAccepted: observations.filter(r=>r.apiAccepted).length, acceptedInputPipelineCases: 2,
    extractTrueParsed: observations.filter(r=>r.extractTrue.outcome==='parsed').length,
    extractFalseParsed: observations.filter(r=>r.extractFalse.outcome==='parsed').length },
  // JavaScript without multiline: $ requires end of input. Test, do not assume.
  anchorProbe: { input: fixture.e164 + '\n', anchoredRegexTest: /^\+[1-9][0-9]{7,14}$/.test(fixture.e164+'\n'), multilineRegexTest: /^\+[1-9][0-9]{7,14}$/m.test(fixture.e164+'\n') }
};
assert.equal(result.anchorProbe.anchoredRegexTest, false);
assert.equal(result.anchorProbe.multilineRegexTest, true);
writeFileSync(new URL('./results.json', import.meta.url), JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
