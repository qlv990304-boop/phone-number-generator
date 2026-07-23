export const plans = [
  { id: "US", name: "United States", code: "1", min: 10, max: 10, trunk: false, pattern: "(NPA) NXX-XXXX", example: "+12025550123", prefix: /^[2-9]\d{9}$/, page: "/us-phone-number.html" },
  { id: "CA", name: "Canada", code: "1", min: 10, max: 10, trunk: false, pattern: "(NPA) NXX-XXXX", example: "+14165550123", prefix: /^[2-9]\d{9}$/, page: "/canada-phone-number.html" },
  { id: "GB", name: "United Kingdom", code: "44", min: 10, max: 10, trunk: true, pattern: "07xxx xxxxxx", example: "+447700900123", prefix: /^7\d{9}$/, page: "/uk-phone-number.html" },
  { id: "AU", name: "Australia", code: "61", min: 9, max: 9, trunk: true, pattern: "04xx xxx xxx", example: "+61491570006", prefix: /^4\d{8}$/, page: "/australia-phone-number.html" },
  { id: "CN", name: "China", code: "86", min: 11, max: 11, trunk: false, pattern: "1xx xxxx xxxx", example: "+8613012345678", prefix: /^1\d{10}$/, page: "/china-phone-number.html" },
  { id: "IN", name: "India", code: "91", min: 10, max: 10, trunk: false, pattern: "xxxxx xxxxx", example: "+919876543210", prefix: /^[6-9]\d{9}$/, page: "/india-phone-number.html" },
  { id: "DE", name: "Germany", code: "49", min: 7, max: 11, trunk: true, pattern: "01xx xxxxxxx", example: "+4915112345678", prefix: /^\d{7,11}$/, page: "/germany-phone-number.html" },
  { id: "FR", name: "France", code: "33", min: 9, max: 9, trunk: true, pattern: "06 xx xx xx xx", example: "+33639981234", prefix: /^[1-9]\d{8}$/, page: "/france-phone-number.html" },
  { id: "JP", name: "Japan", code: "81", min: 9, max: 10, trunk: true, pattern: "0x0-xxxx-xxxx", example: "+819012345678", prefix: /^\d{9,10}$/, page: "/japan-phone-number.html" },
  { id: "BR", name: "Brazil", code: "55", min: 10, max: 11, trunk: false, pattern: "(AA) 9xxxx-xxxx", example: "+5511987654321", prefix: /^[1-9]\d{9,10}$/, page: "/brazil-phone-number.html" },
  { id: "MX", name: "Mexico", code: "52", min: 10, max: 10, trunk: false, pattern: "xx xxxx xxxx", example: "+525512345678", prefix: /^[2-9]\d{9}$/, page: "/mexico-phone-number.html" },
  { id: "ES", name: "Spain", code: "34", min: 9, max: 9, trunk: false, pattern: "6xx xxx xxx", example: "+34612345678", prefix: /^[6-9]\d{8}$/, page: "/spain-phone-number.html" },
  { id: "IT", name: "Italy", code: "39", min: 10, max: 10, trunk: false, pattern: "3xx xxx xxxx", example: "+393123456789", prefix: /^3\d{9}$/, page: "/italy-phone-number.html" },
  { id: "NL", name: "Netherlands", code: "31", min: 9, max: 9, trunk: true, pattern: "06 xxxxxxxx", example: "+31612345678", prefix: /^6\d{8}$/, page: "/netherlands-phone-number.html" },
  { id: "SE", name: "Sweden", code: "46", min: 9, max: 9, trunk: true, pattern: "070-xxx xx xx", example: "+46701234567", prefix: /^7\d{8}$/, page: "/sweden-phone-number.html" },
  { id: "CH", name: "Switzerland", code: "41", min: 9, max: 9, trunk: true, pattern: "079 xxx xx xx", example: "+41791234567", prefix: /^7[5-9]\d{7}$/, page: "/switzerland-phone-number.html" },
  { id: "SG", name: "Singapore", code: "65", min: 8, max: 8, trunk: false, pattern: "9xxx xxxx", example: "+6591234567", prefix: /^[89]\d{7}$/, page: "/singapore-phone-number.html" },
  { id: "KR", name: "South Korea", code: "82", min: 10, max: 10, trunk: true, pattern: "010-xxxx-xxxx", example: "+821012345678", prefix: /^10\d{8}$/, page: "/south-korea-phone-number.html" },
  { id: "NZ", name: "New Zealand", code: "64", min: 8, max: 10, trunk: true, pattern: "021 xxx xxxx", example: "+64211234567", prefix: /^2\d{7,9}$/, page: "/new-zealand-phone-number.html" },
  { id: "AE", name: "United Arab Emirates", code: "971", min: 9, max: 9, trunk: true, pattern: "05x xxx xxxx", example: "+971501234567", prefix: /^5\d{8}$/, page: "/uae-phone-number.html" },
  { id: "ID", name: "Indonesia", code: "62", min: 9, max: 12, trunk: true, pattern: "08xx-xxxx-xxxx", example: "+6281234567890", prefix: /^8\d{8,11}$/, page: "/indonesia-phone-number.html" },
  { id: "PK", name: "Pakistan", code: "92", min: 10, max: 10, trunk: true, pattern: "03xx xxxxxxx", example: "+923001234567", prefix: /^3\d{9}$/, page: "/pakistan-phone-number.html" },
  { id: "NG", name: "Nigeria", code: "234", min: 10, max: 10, trunk: true, pattern: "0803 xxx xxxx", example: "+2348031234567", prefix: /^[789]\d{9}$/, page: "/nigeria-phone-number.html" },
  { id: "BD", name: "Bangladesh", code: "880", min: 10, max: 10, trunk: true, pattern: "01xxx-xxxxxx", example: "+8801711123456", prefix: /^1\d{9}$/, page: "/bangladesh-phone-number.html" },
  { id: "RU", name: "Russia", code: "7", min: 10, max: 10, trunk: "8", pattern: "8 900 xxx-xx-xx", example: "+79001234567", prefix: /^9\d{9}$/, page: "/russia-phone-number.html" },
  { id: "VN", name: "Vietnam", code: "84", min: 9, max: 9, trunk: true, pattern: "09x xxx xxxx", example: "+84912345678", prefix: /^[35789]\d{8}$/, page: "/vietnam-phone-number.html" },
  { id: "PH", name: "Philippines", code: "63", min: 10, max: 10, trunk: true, pattern: "09xx xxx xxxx", example: "+639171234567", prefix: /^9\d{9}$/, page: "/philippines-phone-number.html" },
  { id: "TR", name: "Turkey", code: "90", min: 10, max: 10, trunk: true, pattern: "05xx xxx xx xx", example: "+905321234567", prefix: /^5\d{9}$/, page: "/turkey-phone-number.html" },
  { id: "SA", name: "Saudi Arabia", code: "966", min: 9, max: 9, trunk: true, pattern: "05x xxx xxxx", example: "+966501234567", prefix: /^5\d{8}$/, page: "/saudi-arabia-phone-number.html" },
  { id: "EG", name: "Egypt", code: "20", min: 10, max: 10, trunk: true, pattern: "01x xxxx xxxx", example: "+201012345678", prefix: /^1\d{9}$/, page: "/egypt-phone-number.html" },
  { id: "PL", name: "Poland", code: "48", min: 9, max: 9, trunk: false, pattern: "xxx xxx xxx", example: "+48501123456", prefix: /^[4-8]\d{8}$/, page: "/poland-phone-number.html" }
];

const sharedCallingCodeLabels = {
  "1": "United States / Canada / other NANP regions",
  "7": "Russia / Kazakhstan"
};

function byId(id) { return plans.find((plan) => plan.id === id); }

export function lookupCallingCode(raw) {
  const input = String(raw || "").trim();
  let digitsOnly = input.replace(/[^0-9]/g, "");
  if (!digitsOnly) throw new Error("Enter a calling code or international phone number.");

  const internationalInput = input.startsWith("+") || digitsOnly.startsWith("00");
  if (digitsOnly.startsWith("00")) digitsOnly = digitsOnly.slice(2);
  const codes = [...new Set(plans.map((plan) => plan.code))].sort((left, right) => right.length - left.length);
  let code;

  if (!internationalInput) {
    if (digitsOnly.length > 3) throw new Error("Add + or 00 before a full international phone number.");
    code = codes.find((item) => item === digitsOnly);
  } else {
    code = codes.find((item) => digitsOnly.startsWith(item));
  }

  if (!code) throw new Error("That calling code is not in the 31-country dataset.");
  const candidates = plans.filter((plan) => plan.code === code);
  const sharedLabel = sharedCallingCodeLabels[code];
  return {
    callingCode: `+${code}`,
    countryLabel: sharedLabel || candidates.map((plan) => plan.name).join(" / "),
    candidates,
    shared: Boolean(sharedLabel),
    queryType: internationalInput && digitsOnly.length > code.length ? "international_number" : "calling_code"
  };
}
function digits(length) { return Array.from({ length }, () => Math.floor(Math.random() * 10)).join(""); }
function pick(values) { return values[Math.floor(Math.random() * values.length)]; }

function normalize(raw, plan) {
  const trimmed = raw.trim();
  let value = trimmed.replace(/[^0-9]/g, "");
  const international = trimmed.startsWith("+") || value.startsWith("00");
  if (value.startsWith("00")) value = value.slice(2);
  if (international && value.startsWith(plan.code)) value = value.slice(plan.code.length);
  else if (!international && plan.code === "1" && value.length === 11 && value.startsWith("1")) value = value.slice(1);
  else {
    const trunkPrefix = typeof plan.trunk === "string" ? plan.trunk : plan.trunk ? "0" : "";
    if (!international && trunkPrefix && value.startsWith(trunkPrefix)) value = value.slice(trunkPrefix.length);
  }
  return value;
}

function generate(plan) {
  const generators = {
    US: () => `+1${pick([202, 212, 312, 415, 617])}55501${digits(2)}`,
    CA: () => `+1${pick([403, 416, 514, 604])}55501${digits(2)}`,
    GB: () => `+447700900${digits(3)}`,
    AU: () => `+614915700${digits(2)}`,
    CN: () => `+86${pick([130, 150, 170, 199])}${digits(8)}`,
    IN: () => `+91${pick([6, 7, 8, 9])}${digits(9)}`,
    DE: () => `+49${pick([151, 160, 170, 176])}${digits(7)}`,
    FR: () => `+3363998${digits(4)}`,
    JP: () => `+81${pick([70, 80, 90])}${digits(8)}`,
    BR: () => `+55${pick([11, 21, 31, 41, 61])}9${digits(8)}`,
    MX: () => `+52${pick([55, 81, 33])}${digits(8)}`,
    ES: () => `+346${digits(8)}`,
    IT: () => `+393${digits(9)}`,
    NL: () => `+316${digits(8)}`,
    SE: () => `+4670${digits(7)}`,
    CH: () => `+4179${digits(7)}`,
    SG: () => `+659${digits(7)}`,
    KR: () => `+8210${digits(8)}`,
    NZ: () => `+6421${digits(7)}`,
    AE: () => `+97150${digits(7)}`,
    ID: () => `+62812${digits(8)}`,
    PK: () => `+92300${digits(7)}`,
    NG: () => `+234803${digits(7)}`,
    BD: () => `+8801711${digits(6)}`,
    RU: () => `+7900${digits(7)}`,
    VN: () => `+8491${digits(7)}`,
    PH: () => `+63917${digits(7)}`,
    TR: () => `+90532${digits(7)}`,
    SA: () => `+96650${digits(7)}`,
    EG: () => `+2010${digits(8)}`,
    PL: () => `+48501${digits(6)}`
  };
  return generators[plan.id]();
}

function display(e164, plan) {
  const national = e164.slice(plan.code.length + 1);
  return `+${plan.code} ${national}`;
}

function fillCountrySelects() {
  document.querySelectorAll("[data-country-select]").forEach((select) => {
    select.innerHTML = plans.map((plan) => `<option value="${plan.id}">${plan.name} (+${plan.code})</option>`).join("");
  });
}

function showStatus(element, message, type) {
  element.textContent = message;
  element.className = `status ${type}`;
}

function initializeCopyButtons() {
  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.copyTarget);
      window.GetPhoneNum.copy(target.textContent, button);
    });
  });
}

function initializeHomeGenerator() {
  const form = document.querySelector("#home-generator-form");
  if (!form) return;
  const number = document.querySelector("#home-generator-number");
  const pattern = document.querySelector("#home-generator-pattern");
  const guide = document.querySelector("#home-generator-guide");
  function render() {
    const plan = byId(form.elements.country.value);
    const e164 = generate(plan);
    number.textContent = e164;
    pattern.textContent = `Pattern: ${plan.pattern}`;
    guide.href = plan.page.replace(/\.html$/, "");
    guide.textContent = `View ${plan.name} guide`;
    window.GetPhoneNum.track("home_phone_generate", { country: plan.id });
  }
  form.addEventListener("submit", (event) => { event.preventDefault(); render(); });
}

function initializeValidator() {
  const form = document.querySelector("#validator-form");
  if (!form) return;
  const status = document.querySelector("#validator-status");
  const results = document.querySelector("#validator-results");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const plan = byId(form.elements.country.value);
    const national = normalize(form.elements.phone.value, plan);
    const lengthValid = national.length >= plan.min && national.length <= plan.max;
    const prefixValid = plan.prefix.test(national);
    const valid = lengthValid && prefixValid;
    document.querySelector("#validator-result-country").textContent = `${plan.name} (+${plan.code})`;
    document.querySelector("#validator-result-length").textContent = `${national.length} digits`;
    document.querySelector("#validator-result-e164").textContent = national ? `+${plan.code}${national}` : "—";
    document.querySelector("#validator-result-assessment").textContent = valid ? "Matches basic rules" : "Does not match basic rules";
    results.hidden = false;
    showStatus(status, valid ? "The number matches the selected country's basic structural rules." : `Expected ${plan.min === plan.max ? plan.min : `${plan.min}-${plan.max}`} national digits and the usual prefix pattern.`, valid ? "success" : "error");
    window.GetPhoneNum.track("phone_validator_submit", { country: plan.id, valid_structure: valid });
  });
}

function initializeCallingCode() {
  const form = document.querySelector("#calling-code-form");
  if (!form) return;
  const results = document.querySelector("#calling-results");
  const status = document.querySelector("#calling-code-status");
  function render() {
    const query = form.elements.query.value.trim();
    let candidates;
    let countryLabel;
    let callingCode;
    let shared = false;
    let direction = "country";

    try {
      if (query) {
        const lookup = lookupCallingCode(query);
        candidates = lookup.candidates;
        countryLabel = lookup.countryLabel;
        callingCode = lookup.callingCode;
        shared = lookup.shared;
        direction = "code";
      } else {
        const selected = byId(form.elements.country.value);
        candidates = [selected];
        countryLabel = selected.name;
        callingCode = `+${selected.code}`;
      }
    } catch (error) {
      results.hidden = true;
      showStatus(status, error.message, "error");
      return;
    }

    const plan = candidates[0];
    const patterns = [...new Set(candidates.map((item) => item.pattern))];
    const lengths = [...new Set(candidates.map((item) => item.min === item.max ? `${item.min} digits` : `${item.min}-${item.max} digits`))];
    document.querySelector("#calling-result-country").textContent = countryLabel;
    document.querySelector("#calling-result-code").textContent = callingCode;
    document.querySelector("#calling-result-pattern").textContent = patterns.join(" / ");
    document.querySelector("#calling-result-length").textContent = lengths.join(" / ");
    document.querySelector("#calling-result-example").textContent = plan.example;
    document.querySelector("#calling-guide").innerHTML = `Supported guides: ${candidates.map((item) => `<a href="${item.page}">${item.name}</a>`).join(" · ")}.`;
    results.hidden = false;
    showStatus(status, shared ? `${callingCode} is shared by ${countryLabel}; the code alone cannot identify one country.` : `Matched ${callingCode} to ${countryLabel}.`, "success");
    window.GetPhoneNum.track("calling_code_lookup", { country: candidates.map((item) => item.id).join("_"), lookup_direction: direction, shared_calling_code: shared });
  }
  form.addEventListener("submit", (event) => { event.preventDefault(); render(); });
  render();
}

function initializeRegexTester() {
  const form = document.querySelector("#regex-form");
  if (!form) return;
  const status = document.querySelector("#regex-status");
  const results = document.querySelector("#regex-results");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const regex = new RegExp(form.elements.pattern.value, form.elements.flags.value);
      const input = form.elements.input.value;
      const matches = form.elements.flags.value.includes("g") ? [...input.matchAll(regex)].map((match) => match[0]) : (input.match(regex) || []).slice(0, 1);
      document.querySelector("#regex-result-matches").textContent = matches.length ? matches.join("\n") : "No matches";
      results.hidden = false;
      showStatus(status, `${matches.length} match${matches.length === 1 ? "" : "es"} found.`, "success");
      window.GetPhoneNum.track("phone_regex_test", { match_count: matches.length });
    } catch (error) {
      results.hidden = true;
      showStatus(status, `Invalid regular expression: ${error.message}`, "error");
    }
  });
}

function download(name, type, content) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function initializeBulkGenerator() {
  const form = document.querySelector("#bulk-form");
  if (!form) return;
  const status = document.querySelector("#bulk-status");
  const results = document.querySelector("#bulk-results");
  const output = document.querySelector("#bulk-output");
  let records = [];
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const plan = byId(form.elements.country.value);
    const count = Math.min(100, Math.max(1, Number(form.elements.count.value) || 1));
    records = Array.from({ length: count }, (_, index) => {
      const e164 = generate(plan);
      return { id: index + 1, country: plan.id, e164, display: display(e164, plan) };
    });
    output.value = records.map((record) => form.elements.format.value === "display" ? record.display : record.e164).join("\n");
    results.hidden = false;
    showStatus(status, `${count} ${plan.name} fixtures generated locally.`, "success");
    window.GetPhoneNum.track("bulk_phone_generate", { country: plan.id, count });
  });
  document.querySelector("#bulk-copy").addEventListener("click", (event) => window.GetPhoneNum.copy(output.value, event.currentTarget));
  document.querySelector("#bulk-json").addEventListener("click", () => download("phone-fixtures.json", "application/json", JSON.stringify(records, null, 2)));
  document.querySelector("#bulk-csv").addEventListener("click", () => download("phone-fixtures.csv", "text/csv", `id,country,e164,display\n${records.map((record) => `${record.id},${record.country},${record.e164},"${record.display}"`).join("\n")}`));
}

if (typeof document !== "undefined") {
  fillCountrySelects();
  initializeHomeGenerator();
  initializeCopyButtons();
  initializeValidator();
  initializeCallingCode();
  initializeRegexTester();
  initializeBulkGenerator();
}
