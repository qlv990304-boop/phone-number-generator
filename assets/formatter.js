export const plans = {
  US: { name: "United States", code: "1", min: 10, max: 10, trunk: false },
  CA: { name: "Canada", code: "1", min: 10, max: 10, trunk: false },
  GB: { name: "United Kingdom", code: "44", min: 10, max: 10, trunk: true },
  CN: { name: "China", code: "86", min: 11, max: 11, trunk: false },
  IN: { name: "India", code: "91", min: 10, max: 10, trunk: false },
  DE: { name: "Germany", code: "49", min: 7, max: 11, trunk: true },
  FR: { name: "France", code: "33", min: 9, max: 9, trunk: true },
  JP: { name: "Japan", code: "81", min: 9, max: 10, trunk: true },
  BR: { name: "Brazil", code: "55", min: 10, max: 11, trunk: false },
  AU: { name: "Australia", code: "61", min: 9, max: 9, trunk: true },
  MX: { name: "Mexico", code: "52", min: 10, max: 10, trunk: false },
  ES: { name: "Spain", code: "34", min: 9, max: 9, trunk: false },
  IT: { name: "Italy", code: "39", min: 10, max: 10, trunk: false },
  NL: { name: "Netherlands", code: "31", min: 9, max: 9, trunk: true },
  SE: { name: "Sweden", code: "46", min: 9, max: 9, trunk: true },
  CH: { name: "Switzerland", code: "41", min: 9, max: 9, trunk: true },
  SG: { name: "Singapore", code: "65", min: 8, max: 8, trunk: false },
  KR: { name: "South Korea", code: "82", min: 10, max: 10, trunk: true },
  NZ: { name: "New Zealand", code: "64", min: 8, max: 10, trunk: true },
  AE: { name: "United Arab Emirates", code: "971", min: 9, max: 9, trunk: true },
  ID: { name: "Indonesia", code: "62", min: 9, max: 12, trunk: true },
  PK: { name: "Pakistan", code: "92", min: 10, max: 10, trunk: true },
  NG: { name: "Nigeria", code: "234", min: 10, max: 10, trunk: true },
  BD: { name: "Bangladesh", code: "880", min: 10, max: 10, trunk: true },
  RU: { name: "Russia", code: "7", min: 10, max: 10, trunk: "8" },
  VN: { name: "Vietnam", code: "84", min: 9, max: 9, trunk: true },
  PH: { name: "Philippines", code: "63", min: 10, max: 10, trunk: true },
  TR: { name: "Turkey", code: "90", min: 10, max: 10, trunk: true },
  SA: { name: "Saudi Arabia", code: "966", min: 9, max: 9, trunk: true },
  EG: { name: "Egypt", code: "20", min: 10, max: 10, trunk: true },
  PL: { name: "Poland", code: "48", min: 9, max: 9, trunk: false }
};

const sharedCallingCodeLabels = {
  "1": "United States / Canada / other NANP regions",
  "7": "Russia / Kazakhstan"
};

function trunkPrefix(plan) {
  return typeof plan.trunk === "string" ? plan.trunk : plan.trunk ? "0" : "";
}

export function parsePhoneNumber(raw, defaultCountry) {
  const input = String(raw || "").trim();
  let digits = input.replace(/[^0-9]/g, "");
  if (!digits) throw new Error("Enter at least one digit.");

  const internationalInput = input.startsWith("+") || digits.startsWith("00");
  if (digits.startsWith("00")) digits = digits.slice(2);

  let candidates;
  let plan;
  let national;

  if (internationalInput) {
    const codes = [...new Set(Object.values(plans).map((item) => item.code))]
      .sort((left, right) => right.length - left.length);
    const code = codes.find((item) => digits.startsWith(item));
    if (!code) throw new Error("The international calling code is not in the 31-country dataset.");
    candidates = Object.entries(plans).filter(([, item]) => item.code === code);
    plan = candidates.find(([id]) => id === defaultCountry)?.[1] || candidates[0][1];
    national = digits.slice(code.length);
  } else {
    plan = plans[defaultCountry];
    if (!plan) throw new Error("Choose a default country for a national number.");
    candidates = [[defaultCountry, plan]];
    national = digits;
    if (plan.code === "1" && national.length === 11 && national.startsWith("1")) national = national.slice(1);
    const trunk = trunkPrefix(plan);
    if (trunk && national.startsWith(trunk)) national = national.slice(trunk.length);
  }

  const validLength = candidates.some(([, item]) => national.length >= item.min && national.length <= item.max);
  const countryIds = candidates.map(([id]) => id);
  const sharedLabel = internationalInput ? sharedCallingCodeLabels[plan.code] : undefined;
  const countryLabel = sharedLabel || candidates.map(([, item]) => item.name).join(" / ");
  const e164 = `+${plan.code}${national}`;

  return {
    countryIds,
    countryLabel,
    callingCode: `+${plan.code}`,
    national,
    e164,
    international: `+${plan.code} ${national}`,
    nationalDisplay: `${trunkPrefix(plan)}${national}`,
    rfc3966: `tel:${e164}`,
    internationalInput,
    ambiguousCountry: Boolean(sharedLabel),
    validLength,
    expectedLength: plan.min === plan.max ? String(plan.min) : `${plan.min}–${plan.max}`
  };
}

if (typeof document !== "undefined") {
  const form = document.querySelector("#formatter-form");
  const status = document.querySelector("#formatter-status");
  const results = document.querySelector("#formatter-results");

  function showStatus(message, type) {
    status.textContent = message;
    status.className = "status " + type;
  }

  if (form && status && results) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      let parsed;
      try {
        parsed = parsePhoneNumber(form.elements.phone.value, form.elements.country.value);
      } catch (error) {
        results.hidden = true;
        showStatus(error.message, "error");
        return;
      }

      if (!parsed.validLength) {
        results.hidden = true;
        showStatus(
          `This number has ${parsed.national.length} national digits; ${parsed.countryLabel} expects ${parsed.expectedLength}.`,
          "error"
        );
        window.GetPhoneNum.track("formatter_submit", { country: parsed.countryIds.join("_"), valid_length: false });
        return;
      }

      document.querySelector("#result-country").textContent = parsed.countryLabel;
      document.querySelector("#result-calling-code").textContent = parsed.callingCode;
      document.querySelector("#result-national-digits").textContent = parsed.national;
      document.querySelector("#result-e164").textContent = parsed.e164;
      document.querySelector("#result-international").textContent = parsed.international;
      document.querySelector("#result-national").textContent = parsed.nationalDisplay;
      document.querySelector("#result-rfc").textContent = parsed.rfc3966;
      results.hidden = false;
      showStatus(
        parsed.ambiguousCountry
          ? `${parsed.callingCode} is shared by ${parsed.countryLabel}; the calling code alone cannot identify one country.`
          : `Parsed as ${parsed.countryLabel} using basic calling-code and length rules.`,
        "success"
      );
      window.GetPhoneNum.track("formatter_submit", {
        country: parsed.countryIds.join("_"),
        international_input: parsed.internationalInput,
        shared_calling_code: parsed.ambiguousCountry,
        valid_length: true
      });
    });

    document.querySelectorAll("[data-copy-target]").forEach(function (button) {
      button.addEventListener("click", function () {
        const target = document.querySelector(button.dataset.copyTarget);
        window.GetPhoneNum.copy(target.textContent, button);
      });
    });
  }
}
