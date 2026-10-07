import { makeAddressBatch, formatAddress, addressesToCSV } from "./address-core.mjs";

const root = document.querySelector("[data-address-generator]");
if (root) {
  const form = root.querySelector("form");
  const output = root.querySelector("[data-address-output]");
  const status = root.querySelector("[data-address-status]");
  const preview = root.querySelector("[data-address-fields]");
  let rows = [];

  function render() {
    const locationId = root.dataset.addressGenerator === "los-angeles" ? "los-angeles" : form.elements.location.value;
    rows = makeAddressBatch({
      locationId,
      count: Number(form.elements.count.value),
      includeUnit: form.elements.unit.checked,
      seed: form.elements.seed.value
    });
    output.textContent = rows.map(formatAddress).join("\n\n");
    root.querySelector("[data-result-title]").textContent = rows.length === 1 ? "Your sample address" : `${rows.length} sample addresses`;
    preview.replaceChildren();
    for (const [label, value] of [["City", rows[0].city], ["State", `${rows[0].state} · ${rows[0].state_name}`], ["ZIP Code", rows[0].postal_code], ["Country", "United States"]]) {
      const item = document.createElement("div");
      const term = document.createElement("dt");
      const detail = document.createElement("dd");
      term.textContent = label;
      detail.textContent = value;
      item.append(term, detail);
      preview.append(item);
    }
    status.textContent = `${rows.length} synthetic ${rows.length === 1 ? "address" : "addresses"} ready. ${form.elements.seed.value.trim() ? "Same seed and settings will repeat this batch." : ""}`;
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    try { render(); } catch (error) { status.textContent = error.message; }
  });

  root.querySelector("[data-copy-address]").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(output.textContent);
      status.textContent = `Copied ${rows.length} ${rows.length === 1 ? "address" : "addresses"}.`;
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(output);
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = "Address text selected. Use your browser's Copy command.";
    }
  });

  for (const button of root.querySelectorAll("[data-export-address]")) {
    button.addEventListener("click", () => {
      const format = button.dataset.exportAddress;
      const content = format === "json" ? JSON.stringify(rows, null, 2) : addressesToCSV(rows);
      const blob = new Blob([content], { type: format === "json" ? "application/json;charset=utf-8" : "text/csv;charset=utf-8" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `getphonenum-addresses.${format}`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = `${format.toUpperCase()} export downloaded for ${rows.length} ${rows.length === 1 ? "address" : "addresses"}.`;
    });
  }
  render();
}
