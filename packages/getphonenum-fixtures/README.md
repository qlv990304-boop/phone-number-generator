# getphonenum-fixtures

Zero-dependency country calling-code and phone-format fixtures for development, documentation and QA. The package contains 31 country records and does not perform network lookups.

## Install

```sh
npm install getphonenum-fixtures
```

## Usage

```js
import {
  getCallingCode,
  getE164Fixture,
  getPhoneFormat,
  listCountries
} from "getphonenum-fixtures";

getCallingCode("GB"); // "+44"
getE164Fixture("Mexico"); // "+525512345678"
getPhoneFormat("SG"); // full Singapore record
listCountries(); // compact list for a country selector
```

Every record includes `iso2`, `callingCode`, `nationalPattern`, `e164Example`, `nationalDigits`, `fixtureSafety` and `sourceUrl`.

## Safety

These are format fixtures, not verified subscriber lines. Unless an official authority reserves the example, a structurally plausible value may coincide with an assigned number. Never call, text or use fixtures for account verification.

See the [live dataset and source notes](https://getphonenum.com/phone-number-dataset.html).
