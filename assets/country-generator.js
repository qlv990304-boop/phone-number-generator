(function () {
  const plans = {
    US: { generate: () => `+1 (${pick([202, 212, 312, 415, 617])}) 555-01${digits(2)}` },
    GB: { generate: () => `+44 7700 900${digits(3)}` },
    CA: { generate: () => `+1 (${pick([403, 416, 514, 604])}) 555-01${digits(2)}` },
    AU: { generate: () => `+61 491 570 0${digits(2)}` },
    CN: { generate: () => `+86 ${pick([130, 150, 170, 199])} ${digits(4)} ${digits(4)}` },
    IN: { generate: () => `+91 ${pick([6, 7, 8, 9])}${digits(4)} ${digits(5)}` },
    DE: { generate: () => `+49 ${pick([151, 160, 170, 176])} ${digits(7)}` },
    FR: { generate: () => `+33 6 39 98 ${digits(2)} ${digits(2)}` },
    JP: { generate: () => `+81 ${pick([70, 80, 90])} ${digits(4)} ${digits(4)}` },
    BR: { generate: () => `+55 (${pick([11, 21, 31, 41, 61])}) 9${digits(4)}-${digits(4)}` }
  };

  function digits(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
  }

  function pick(values) {
    return values[Math.floor(Math.random() * values.length)];
  }

  const country = document.body.dataset.country;
  const result = document.querySelector("#country-result");
  const generateButton = document.querySelector("#generate-country-number");
  const copyButton = document.querySelector("#copy-country-number");
  const plan = plans[country];

  if (!plan || !result || !generateButton || !copyButton) return;

  function generate() {
    result.textContent = plan.generate();
    window.GetPhoneNum.track("country_generate", { country });
  }

  generateButton.addEventListener("click", generate);
  copyButton.addEventListener("click", function () {
    window.GetPhoneNum.copy(result.textContent, copyButton);
  });
})();
