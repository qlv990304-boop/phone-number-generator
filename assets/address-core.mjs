import { LOCATIONS, STREETS, DATASET_VERSION } from "./address-data.mjs";

export function seededRandom(seed) {
  let state = 2166136261;
  for (const character of String(seed)) {
    state ^= character.codePointAt(0);
    state = Math.imul(state, 16777619);
  }
  return function () {
    state += 0x6D2B79F5;
    let value = Math.imul(state ^ state >>> 15, 1 | state);
    value ^= value + Math.imul(value ^ value >>> 7, 61 | value);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function sampleSlots(capacity, count, random) {
  const moved = new Map();
  const slots = [];
  for (let i = 0; i < count; i++) {
    const size = capacity - i;
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1) throw new Error("Invalid random source.");
    const chosen = Math.floor(value * size);
    slots.push(moved.get(chosen) ?? chosen);
    moved.set(chosen, moved.get(size - 1) ?? size - 1);
    moved.delete(size - 1);
  }
  return slots;
}

export function makeAddressBatch({ locationId = "any", count = 1, includeUnit = false, seed = "" } = {}, random = Math.random) {
  if (!Number.isInteger(count) || count < 1 || count > 25) throw new RangeError("Choose 1 to 25 addresses.");
  const locations = locationId === "any" ? LOCATIONS : LOCATIONS.filter(location => location.id === locationId);
  if (!locations.length) throw new RangeError("Choose a supported city preset.");
  const rng = String(seed).trim() ? seededRandom(String(seed)) : random;
  const perLocation = STREETS.length * 8000;
  return sampleSlots(locations.length * perLocation, count, rng).map(slot => {
    const location = locations[Math.floor(slot / perLocation)];
    const streetSlot = slot % perLocation;
    const unit = includeUnit ? "APT " + (1 + Math.floor(rng() * 120)) : "";
    return {
      address_line_1: (1000 + streetSlot % 8000) + " " + STREETS[Math.floor(streetSlot / 8000)],
      address_line_2: unit,
      city: location.city,
      state: location.state,
      state_name: location.stateName,
      postal_code: location.postalCode,
      country: "US",
      synthetic: true,
      delivery_verified: false,
      dataset_version: DATASET_VERSION,
      location_source: location.source
    };
  });
}

export function formatAddress(row) {
  return [row.address_line_1, row.address_line_2, `${row.city}, ${row.state} ${row.postal_code}`, "United States"].filter(Boolean).join("\n");
}

export function addressesToCSV(rows) {
  const fields = ["address_line_1", "address_line_2", "city", "state", "state_name", "postal_code", "country", "synthetic", "delivery_verified", "dataset_version", "location_source"];
  const quote = value => '"' + String(value ?? "").replaceAll('"', '""') + '"';
  return [fields.map(quote).join(","), ...rows.map(row => fields.map(field => quote(row[field])).join(","))].join("\r\n") + "\r\n";
}
