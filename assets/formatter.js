const plans = {
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

const form = document.querySelector("#formatter-form");
const status = document.querySelector("#formatter-status");
const results = document.querySelector("#formatter-results");

function normalize(raw, plan) {
  let digits = raw.trim().replace(/[^0-9]/g, "");
  const hasInternationalPrefix = raw.trim().startsWith("+") || digits.startsWith("00");

  if (digits.startsWith("00")) digits = digits.slice(2);
  if (hasInternationalPrefix && digits.startsWith(plan.code)) {
    digits = digits.slice(plan.code.length);
  } else if (!hasInternationalPrefix && plan.code === "1" && digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  } else {
    const trunkPrefix = typeof plan.trunk === "string" ? plan.trunk : plan.trunk ? "0" : "";
    if (!hasInternationalPrefix && trunkPrefix && digits.startsWith(trunkPrefix)) {
      digits = digits.slice(trunkPrefix.length);
    }
  }

  return digits;
}

function showStatus(message, type) {
  status.textContent = message;
  status.className = "status " + type;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const country = form.elements.country.value;
  const plan = plans[country];
  const national = normalize(form.elements.phone.value, plan);

  if (national.length < plan.min || national.length > plan.max) {
    results.hidden = true;
    showStatus(
      `This number has ${national.length} national digits; ${plan.name} expects ${plan.min === plan.max ? plan.min : `${plan.min}–${plan.max}`}.`,
      "error"
    );
    return;
  }

  const e164 = `+${plan.code}${national}`;
  document.querySelector("#result-e164").textContent = e164;
  document.querySelector("#result-international").textContent = `+${plan.code} ${national}`;
  const trunkPrefix = typeof plan.trunk === "string" ? plan.trunk : plan.trunk ? "0" : "";
  document.querySelector("#result-national").textContent = `${trunkPrefix}${national}`;
  document.querySelector("#result-rfc").textContent = `tel:${e164}`;
  results.hidden = false;
  showStatus("The number matches the selected country's basic length rules.", "success");
  window.GetPhoneNum.track("formatter_submit", { country: country, valid_length: true });
});
document.querySelectorAll("[data-copy-target]").forEach(function (button) {
  button.addEventListener("click", function () {
    const target = document.querySelector(button.dataset.copyTarget);
    window.GetPhoneNum.copy(target.textContent, button);
  });
});
