(function () {
  const pageSlugs = {
    RU: "russia-page",
    IT: "italy-page",
    BR: "brazil-page",
    FR: "france-page"
  };

  function init() {
    const affiliate = window.GetPhoneNumAffiliate;
    const pageSlug = pageSlugs[document.body?.dataset.country];
    if (!affiliate || !pageSlug) return;

    document.querySelectorAll(".aff-module").forEach((module) => {
      affiliate.renderAffiliateBlock(module, { pageSlug });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
