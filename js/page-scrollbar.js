(function () {
"use strict";
  function initPageScrollbar() {
    var rail = document.querySelector("[data-page-scrollbar]");
    var thumb = document.querySelector("[data-scroll-thumb]");
    if (!rail || !thumb) return;
    var hideTimer, frame, dragging = false, dragStart = 0, scrollStart = 0;
    var travel = 1, maxScroll = 1;
    function show() {
      rail.classList.add("is-visible");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { if (!dragging) rail.classList.remove("is-visible"); }, 1000);
    }
    function render() {
      frame = null;
      var height = rail.clientHeight;
      maxScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
      var thumbHeight = Math.max(40, height * innerHeight / Math.max(innerHeight, document.documentElement.scrollHeight));
      travel = Math.max(1, height - thumbHeight);
      var progress = maxScroll ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
      thumb.style.height = thumbHeight + "px";
      thumb.style.transform = "translateY(" + (progress * travel) + "px)";
      rail.setAttribute("aria-valuenow", Math.round(progress * 100));
    }
    function onScroll() { show(); if (!frame) frame = requestAnimationFrame(render); }
    rail.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      event.preventDefault();
      render(); dragging = true; show(); rail.setPointerCapture(event.pointerId);
      if (event.target !== thumb) {
        var position = event.clientY - rail.getBoundingClientRect().top - thumb.clientHeight / 2;
        window.scrollTo({ top: Math.max(0, Math.min(1, position / travel)) * maxScroll, behavior: "instant" });
      }
      dragStart = event.clientY; scrollStart = scrollY;
    });
    rail.addEventListener("pointermove", function (event) {
      if (dragging) window.scrollTo({ top: scrollStart + (event.clientY - dragStart) / travel * maxScroll, behavior: "instant" });
    });
    function endDrag() { dragging = false; show(); }
    rail.addEventListener("pointerup", endDrag);
    rail.addEventListener("pointercancel", endDrag);
    rail.addEventListener("keydown", function (event) {
      var offsets = { ArrowDown: 80, ArrowUp: -80, PageDown: innerHeight * 0.85, PageUp: -innerHeight * 0.85, Home: -Infinity, End: Infinity };
      if (!(event.key in offsets)) return;
      event.preventDefault(); render();
      window.scrollTo({ top: Math.max(0, Math.min(maxScroll, scrollY + offsets[event.key])), behavior: "instant" });
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", render);
    window.addEventListener("pointermove", function (event) { if (event.pointerType === "mouse" && event.clientX > innerWidth - 20) show(); }, { passive: true });
    document.documentElement.classList.add("has-overlay-scrollbar");
    render();
  }

initPageScrollbar();
})();
