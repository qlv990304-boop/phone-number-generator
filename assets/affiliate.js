(function () {
  const OFFERS = [
  {
    id: "sms-activate",
    name: "SMS-Activate",
    bestFor: "One-off SMS verification, widest country coverage",
    covers: "TBD",
    numberFrom: "TBD",
    url: "TBD",
    note: "Retail commission, supports USDT / Perfect Money"
  },
  {
    id: "sms-man",
    name: "SMS-Man",
    bestFor: "Rentals and eSIM, when you need a number longer than one code",
    covers: "TBD",
    numberFrom: "TBD",
    url: "TBD",
    note: "Crypto payout (USDT TRC-20)"
  }
  ];

  function withSubid(url, pageSlug) {
    return `${url}${url.includes("?") ? "&" : "?"}subid=${encodeURIComponent(pageSlug)}`;
  }

  function setField(row, field, value) {
    const cell = row.querySelector(`[data-affiliate-field="${field}"]`);
    if (!cell) return;
    cell.textContent = value;
    if (value === "TBD") cell.setAttribute("data-needs-verification", "true");
    else cell.removeAttribute("data-needs-verification");
  }

  function renderAffiliateBlock(mountEl, { pageSlug } = {}) {
    const module = mountEl?.matches(".aff-module") ? mountEl : mountEl?.querySelector(".aff-module");
    if (!module) return null;

    OFFERS.forEach((offer) => {
      const row = [...module.querySelectorAll("[data-offer-id]")].find((item) => item.dataset.offerId === offer.id);
      if (!row) return;

      setField(row, "name", offer.name);
      setField(row, "bestFor", offer.bestFor);
      setField(row, "covers", offer.covers);
      setField(row, "numberFrom", offer.numberFrom);

      const tryCell = row.querySelector('[data-affiliate-field="tryIt"]');
      if (!tryCell) return;

      if (!offer.url || offer.url === "TBD") {
        const placeholder = document.createElement("span");
        placeholder.className = "muted";
        placeholder.dataset.needsVerification = "true";
        placeholder.textContent = "TBD";
        tryCell.replaceChildren(placeholder);
        return;
      }

      tryCell.replaceChildren();

      const link = document.createElement("a");
      link.href = withSubid(offer.url, pageSlug);
      link.rel = "sponsored nofollow";
      link.target = "_blank";
      link.dataset.event = "affiliate_click";
      link.textContent = "Try it";
      tryCell.append(link);
    });

    return module;
  }

  window.GetPhoneNumAffiliate = { OFFERS, renderAffiliateBlock };
})();
