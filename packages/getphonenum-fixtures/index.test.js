import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { getCallingCode, getE164Fixture, getPhoneFormat, listCountries, phoneFormats } from "./index.js";

const require = createRequire(import.meta.url);

test("exports 31 country records", () => {
  assert.equal(phoneFormats.length, 31);
  assert.equal(listCountries().length, 31);
});

test("looks up records by ISO code or country name", () => {
  assert.equal(getPhoneFormat("gb")?.country, "United Kingdom");
  assert.equal(getPhoneFormat("south korea")?.iso2, "KR");
  assert.equal(getPhoneFormat("russia")?.iso2, "RU");
  assert.equal(getPhoneFormat("unknown"), null);
});

test("returns calling codes and E.164 fixtures", () => {
  assert.equal(getCallingCode("MX"), "+52");
  assert.equal(getE164Fixture("AE"), "+971501234567");
  assert.equal(getE164Fixture("PL"), "+48501123456");
});

test("exports the canonical JSON Schema contract", () => {
  const schema = require("getphonenum-fixtures/schema.json");
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.$id, "https://getphonenum.com/data/country-phone-formats.schema.json");
  assert.deepEqual(schema.properties.records.items.required, ["country", "iso2", "callingCode", "nationalPattern", "e164Example", "nationalDigits", "fixtureSafety", "sourceUrl"]);
});
