(function () {
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

})();
