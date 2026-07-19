(async function () {
  const select = document.querySelector("#widget-country");
  const result = document.querySelector("#widget-result");
  if (!select || !result) return;

  try {
    const response = await fetch("/data/country-phone-formats.json");
    if (!response.ok) throw new Error("Dataset unavailable");
    const dataset = await response.json();
    const records = dataset.records || [];
    select.innerHTML = records.map((record) => `<option value="${record.iso2}">${record.country} (${record.callingCode})</option>`).join("");
    const requested = new URLSearchParams(window.location.search).get("country");
    if (requested && records.some((record) => record.iso2 === requested.toUpperCase())) select.value = requested.toUpperCase();

    function render() {
      const record = records.find((item) => item.iso2 === select.value);
      if (!record) return;
      document.querySelector("#widget-code").textContent = record.callingCode;
      document.querySelector("#widget-pattern").textContent = record.nationalPattern;
      document.querySelector("#widget-example").textContent = record.e164Example;
      document.querySelector("#widget-length").textContent = record.nationalDigits;
      result.hidden = false;
      if (typeof window.gtag === "function") window.gtag("event", "widget_country_change", { country: record.iso2 });
    }

    select.addEventListener("change", render);
    render();
  } catch {
    select.innerHTML = '<option>Format data unavailable</option>';
    select.disabled = true;
  }
})();
