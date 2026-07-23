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

## Validate the dataset shape

The package includes the same JSON Schema Draft 2020-12 contract published by the website:

```js
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const schema = require("getphonenum-fixtures/schema.json");
```

The canonical schema is also available at <https://getphonenum.com/data/country-phone-formats.schema.json>.

## Safety

These are format fixtures, not verified subscriber lines. Unless an official authority reserves the example, a structurally plausible value may coincide with an assigned number. Never call, text or use fixtures for account verification.

See the [versioned live dataset and official source notes](https://getphonenum.com/phone-number-dataset). Corrections with an official reference are welcome through [GitHub Issues](https://github.com/qlv990304-boop/phone-number-generator/issues).
