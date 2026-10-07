import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { LOCATIONS } from "../assets/address-data.mjs";
import { makeAddressBatch, formatAddress, addressesToCSV } from "../assets/address-core.mjs";

test("Los Angeles scope retains its reviewed fields for a complete batch", () => {
  const rows = makeAddressBatch({ locationId: "los-angeles", count: 25, includeUnit: true, seed: "la-demo" });
  assert.equal(rows.length, 25);
  assert.equal(new Set(rows.map(row => row.address_line_1)).size, 25);
  for (const row of rows) {
    assert.equal(row.city, "Los Angeles");
    assert.equal(row.state, "CA");
    assert.equal(row.postal_code, "90012");
    assert.equal(typeof row.postal_code, "string");
    assert.match(row.address_line_2, /^APT [1-9][0-9]{0,2}$/);
    assert.equal(row.synthetic, true);
    assert.equal(row.delivery_verified, false);
    assert.equal(row.country, "US");
  }
});

test("every advertised city preset is selectable in the static HTML", () => {
  const html = readFileSync(new URL("../fake-address-america.html", import.meta.url), "utf8");
  const select = html.match(/<select name="location"[^>]*>([\s\S]*?)<\/select>/)[1];
  const values = [...select.matchAll(/<option value="([^"]+)">/g)].map(match => match[1]);
  assert.deepEqual(values, ["any", ...LOCATIONS.map(location => location.id)]);
  assert.ok(!/<\/[a-z]+\s+[^>]*>/i.test(select), "closing option tags cannot carry attributes");
});

test("national choices cannot pair a city with a different state's preset", () => {
  const expected = new Map([
    ["Los Angeles", ["CA", "90012"]], ["Seattle", ["WA", "98104"]],
    ["Philadelphia", ["PA", "19107"]], ["Birmingham", ["AL", "35203"]],
    ["Nashville", ["TN", "37201"]]
  ]);
  for (let i = 0; i < 20; i++) {
    for (const row of makeAddressBatch({ count: 25, seed: `national-${i}` })) {
      assert.deepEqual([row.state, row.postal_code], expected.get(row.city));
      assert.equal(row.address_line_2, "");
    }
  }
});

test("same seed and settings replay a batch, and a distinct seed changes it", () => {
  const settings = { count: 10, includeUnit: true, seed: "demo-01" };
  assert.deepEqual(makeAddressBatch(settings), makeAddressBatch(settings));
  assert.notDeepEqual(makeAddressBatch(settings), makeAddressBatch({ ...settings, seed: "demo-02" }));
});

test("a constant random source still terminates with a unique batch", () => {
  const rows = makeAddressBatch({ locationId: "los-angeles", count: 25 }, () => 0);
  assert.equal(new Set(rows.map(formatAddress)).size, 25);
});

test("unsupported locations and malformed counts fail explicitly", () => {
  for (const count of [0, -1, 26, 1.5, NaN]) assert.throws(() => makeAddressBatch({ count }), RangeError);
  assert.throws(() => makeAddressBatch({ locationId: "unsupported" }), RangeError);
});

test("plain text keeps the optional unit on its own line and preserves postal text", () => {
  const sample = { address_line_1: "123 Example St", address_line_2: "APT 8", city: "Sample City", state: "MA", postal_code: "02108" };
  assert.equal(formatAddress(sample), "123 Example St\nAPT 8\nSample City, MA 02108\nUnited States");
  assert.equal(formatAddress({ ...sample, address_line_2: "" }), "123 Example St\nSample City, MA 02108\nUnited States");
  const csv = addressesToCSV([sample]);
  assert.ok(csv.includes('"02108"'));
});

test("each published state page confines its complete export batch to the advertised location", () => {
  const scopes = [
    ["pennsylvania-address-generator", "Philadelphia", "PA", "19107"],
    ["alabama-address-generator", "Birmingham", "AL", "35203"],
    ["tennessee-address-generator", "Nashville", "TN", "37201"],
    ["washington-address-generator", "Seattle", "WA", "98104"]
  ];
  for (const [slug, city, state, zip] of scopes) {
    const html = readFileSync(new URL(`../${slug}.html`, import.meta.url), "utf8");
    const scope = html.match(/data-address-generator="([^"]+)"/)[1];
    assert.ok(!html.includes('name="location"'), "fixed state page must not expose a cross-state selector");
    const settings = { locationId: scope, count: 25, includeUnit: true, seed: `${state}-export` };
    const rows = makeAddressBatch(settings);
    assert.equal(new Set(rows.map(formatAddress)).size, 25);
    assert.deepEqual(JSON.parse(JSON.stringify(rows)), makeAddressBatch(settings));
    for (const row of rows) {
      assert.deepEqual([row.city, row.state, row.postal_code], [city, state, zip]);
      assert.equal(row.country, "US");
      assert.equal(row.delivery_verified, false);
      assert.equal(row.synthetic, true);
      assert.equal(typeof row.postal_code, "string");
      assert.match(row.address_line_2, /^APT /);
      assert.match(row.location_source, /^https:\/\//);
    }
    assert.ok(addressesToCSV(rows).includes(`"${city}","${state}"`));
  }
});
