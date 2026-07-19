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
    BR: { generate: () => `+55 (${pick([11, 21, 31, 41, 61])}) 9${digits(4)}-${digits(4)}` },
    MX: { generate: () => `+52 ${pick([55, 81, 33])} ${digits(4)} ${digits(4)}` },
    ES: { generate: () => `+34 6${digits(2)} ${digits(3)} ${digits(3)}` },
    IT: { generate: () => `+39 3${digits(2)} ${digits(3)} ${digits(4)}` },
    NL: { generate: () => `+31 6 ${digits(8)}` },
    SE: { generate: () => `+46 70 ${digits(3)} ${digits(2)} ${digits(2)}` },
    CH: { generate: () => `+41 79 ${digits(3)} ${digits(2)} ${digits(2)}` },
    SG: { generate: () => `+65 9${digits(3)} ${digits(4)}` },
    KR: { generate: () => `+82 10 ${digits(4)} ${digits(4)}` },
    NZ: { generate: () => `+64 21 ${digits(3)} ${digits(4)}` },
    AE: { generate: () => `+971 50 ${digits(3)} ${digits(4)}` },
    ID: { generate: () => `+62 812 ${digits(4)} ${digits(4)}` },
    PK: { generate: () => `+92 300 ${digits(7)}` },
    NG: { generate: () => `+234 803 ${digits(3)} ${digits(4)}` },
    BD: { generate: () => `+880 1711 ${digits(6)}` },
    RU: { generate: () => `+7 900 ${digits(3)}-${digits(2)}-${digits(2)}` },
    VN: { generate: () => `+84 91 ${digits(3)} ${digits(4)}` },
    PH: { generate: () => `+63 917 ${digits(3)} ${digits(4)}` },
    TR: { generate: () => `+90 532 ${digits(3)} ${digits(2)} ${digits(2)}` },
    SA: { generate: () => `+966 50 ${digits(3)} ${digits(4)}` },
    EG: { generate: () => `+20 10 ${digits(4)} ${digits(4)}` },
    PL: { generate: () => `+48 501 ${digits(3)} ${digits(3)}` }
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
