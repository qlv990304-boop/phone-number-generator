(function () {
  function alignHomeCopy() {
    if (document.body.dataset.page !== "home" || window.location.pathname !== "/") return;
    document.title = "International Phone Number Generator for Testing | GetPhoneNum";

    document.querySelectorAll("a, span").forEach(function (element) {
      if (element.childElementCount === 0 && element.textContent.trim() === "NUMGEN") {
        element.textContent = "GetPhoneNum";
      }
    });

    document.querySelectorAll("p").forEach(function (paragraph) {
      if (paragraph.textContent.trim() === "Easily generate phone numbers for top countries. Perfect for testing, verification, and high-performance applications.") {
        paragraph.textContent = "Generate international phone test data for software development, QA, and form validation.";
      }
    });

    const replacements = {
      "Phone Number Generator with SMS": "Phone Number Test Data",
      "Phone Number Generator for Verification": "Phone Number Generator for Testing",
      "Free Virtual Phone Number Generator": "Free Test Phone Number Generator"
    };
    document.querySelectorAll("h2, h3").forEach(function (heading) {
      const replacement = replacements[heading.textContent.trim()];
      if (replacement) heading.textContent = replacement;
    });
  }

  function track(eventName, parameters) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, parameters || {});
    }
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("[data-event]");
    if (!target) return;
    track(target.dataset.event, {
      link_url: target.getAttribute("href") || undefined,
      link_text: target.textContent.trim().slice(0, 80)
    });
  });

  window.GetPhoneNum = {
    track: track,
    copy: function (value, button) {
      if (!value) return;
      navigator.clipboard.writeText(value).then(function () {
        var original = button.textContent;
        button.textContent = "Copied";
        setTimeout(function () { button.textContent = original; }, 1400);
        track("copy_result");
      });
    }
  };

  alignHomeCopy();
  const copyObserver = new MutationObserver(alignHomeCopy);
  copyObserver.observe(document.querySelector("#root") || document.body, { childList: true, subtree: true });
  let copyAlignmentAttempts = 0;
  const copyAlignmentTimer = window.setInterval(function () {
    alignHomeCopy();
    copyAlignmentAttempts += 1;
    if (copyAlignmentAttempts >= 20) window.clearInterval(copyAlignmentTimer);
  }, 250);
  window.setTimeout(function () {
    alignHomeCopy();
    copyObserver.disconnect();
  }, 5000);
})();
