# GetPhoneNum

[GetPhoneNum](https://getphonenum.com) is a static, privacy-conscious toolkit for international phone-number test data. It provides country format guides, E.164 formatting and validation utilities, deterministic fixtures, and official numbering-plan references for developers and QA teams.

## Open data

- [Country phone format dataset](https://getphonenum.com/phone-number-dataset)
- [JSON download](https://getphonenum.com/data/country-phone-formats.json)
- [CSV download](https://getphonenum.com/data/country-phone-formats.csv)
- [JSON Schema contract](https://getphonenum.com/data/country-phone-formats.schema.json)
- [`getphonenum-fixtures` package source](packages/getphonenum-fixtures)

The dataset currently covers 31 countries. Records include the ISO code, calling code, national presentation pattern, E.164 fixture, fixture-safety note, and an official source URL. It contains no subscriber or reachability data.

## Contributing corrections

Numbering plans change. Open an issue with the affected country, the proposed correction, and a current source from the national authority or ITU. Do not submit personal phone numbers.

## Maintain country pages

Country guides are generated from `scripts/generate-country-pages.mjs`:

```powershell
npm run generate
```

## Verify before deployment

```powershell
npm.cmd run generate
npm.cmd run audit:content
npm.cmd test
npm.cmd run check
npm.cmd run check:candidates
```

`sitemap.xml` is checked against the complete indexable-page inventory by `npm.cmd run check`; do not replace it with a partial generated list. Serve the folder with any static HTTP server for local browser testing. The `dist/` directory in the original working copy is a separate deployment repository and should receive only verified site files.

## License

The reusable dataset and npm package are available under the MIT license. Website copy and branding are not granted under that package license.
