export interface PhoneFormatRecord {
  readonly country: string;
  readonly iso2: string;
  readonly callingCode: string;
  readonly nationalPattern: string;
  readonly e164Example: string;
  readonly nationalDigits: string;
  readonly fixtureSafety: string;
  readonly sourceUrl: string;
}

export const phoneFormats: readonly PhoneFormatRecord[];
