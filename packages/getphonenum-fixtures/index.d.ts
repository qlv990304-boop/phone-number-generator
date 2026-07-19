import type { PhoneFormatRecord } from "./data.js";

export { phoneFormats } from "./data.js";
export type { PhoneFormatRecord } from "./data.js";

export function getPhoneFormat(country: string): PhoneFormatRecord | null;
export function getCallingCode(country: string): string | null;
export function getE164Fixture(country: string): string | null;
export function listCountries(): Array<Pick<PhoneFormatRecord, "country" | "iso2" | "callingCode">>;
