import test from "node:test";
import assert from "node:assert/strict";
import { getCallingCode, getE164Fixture, getPhoneFormat, listCountries, phoneFormats } from "./index.js";

test("exports 20 country records", () => {
  assert.equal(phoneFormats.length, 20);
  assert.equal(listCountries().length, 20);
});

test("looks up records by ISO code or country name", () => {
  assert.equal(getPhoneFormat("gb")?.country, "United Kingdom");
  assert.equal(getPhoneFormat("south korea")?.iso2, "KR");
  assert.equal(getPhoneFormat("unknown"), null);
});

test("returns calling codes and E.164 fixtures", () => {
  assert.equal(getCallingCode("MX"), "+52");
  assert.equal(getE164Fixture("AE"), "+971501234567");
});
