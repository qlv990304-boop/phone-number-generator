import { phoneFormats } from "./data.js";

export { phoneFormats };

export function getPhoneFormat(country) {
  if (typeof country !== "string") return null;
  const query = country.trim().toUpperCase();
  return phoneFormats.find((record) => record.iso2 === query || record.country.toUpperCase() === query) || null;
}

export function getCallingCode(country) {
  return getPhoneFormat(country)?.callingCode || null;
}

export function getE164Fixture(country) {
  return getPhoneFormat(country)?.e164Example || null;
}

export function listCountries() {
  return phoneFormats.map(({ country, iso2, callingCode }) => ({ country, iso2, callingCode }));
}
