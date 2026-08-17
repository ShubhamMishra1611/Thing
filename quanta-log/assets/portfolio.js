(() => {
  "use strict";

  const sections = ["work", "research", "writing", "profile"];
  const labels = { work: "Work", research: "Research", writing: "Writing", profile: "Profile" };
  const drawer = document.querySelector("#registry-drawer");
  const backdrop = document.querySelector(".drawer-backdrop");
  const title = document.querySelector("#drawer-title");
  const panels = [...document.querySelectorAll("[data-panel]")];
  const sectionButtons = [...document.querySelectorAll("button[data-section]")];
  const closeButtons = [...document.querySelectorAll("[data-close-drawer]")];
  const copyButtons = [...document.querySelectorAll("[data-copy-profile]")];
  let activeSection = null;
  let returnFocus = null;

  const sectionFromHash = () => {
    const value = window.location.hash.slice(1).toLowerCase();
    return sections.includes(value) ? value : null;
  };

  const focusableItems = () => [...drawer.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter((element) => !element.closest("[hidden]"));

  function renderSection(section, focusDrawer = false) {
    activeSection = section;
    title.textContent = labels[section];
    panels.forEach((panel) => { panel.hidden = panel.dataset.panel !== section; });
    sectionButtons.forEach((button) => {
      const active = button.dataset.section === section;
      button.setAttribute("aria-expanded", String(active));
      if (button.closest(".drawer-nav")) {
        active ? button.setAttribute("aria-current", "true") : button.removeAttribute("aria-current");
      }
    });
    drawer.hidden = false;
    backdrop.removeAttribute("hidden");
    document.body.classList.add("drawer-open");
    drawer.querySelector(".drawer-body").scrollTop = 0;
    if (focusDrawer) {
      window.requestAnimationFrame(() => {
        drawer.querySelector(`.drawer-nav button[data-section="${section}"]`)?.focus();
      });
    }
  }

  const landingTrigger = (section) => document.querySelector(
    `.registry-entry[data-section="${section}"]`
  );

  function hideDrawer({ restoreFocus = true } = {}) {
    if (!activeSection) return;
    const closingSection = activeSection;
    activeSection = null;
    document.body.classList.remove("drawer-open");
    sectionButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      button.removeAttribute("aria-current");
    });
    const finishHiding = () => {
      if (!activeSection) {
        drawer.hidden = true;
        backdrop.hidden = true;
      }
    };
    drawer.addEventListener("transitionend", finishHiding, { once: true });
    window.setTimeout(finishHiding, 250);
    const state = window.history.state || {};
    const focusTarget = state.portfolioDirect
      ? landingTrigger(closingSection)
      : returnFocus || landingTrigger(closingSection);
    if (restoreFocus && focusTarget?.isConnected) focusTarget.focus();
  }

  function navigateTo(section, sourceButton) {
    if (!sections.includes(section)) return;
    if (sourceButton && !sourceButton.closest(".drawer")) returnFocus = sourceButton;
    if (activeSection === section) return;
    const state = window.history.state || {};
    const nextState = { portfolioSection: section, portfolioDirect: Boolean(state.portfolioDirect) };
    if (activeSection) {
      window.history.replaceState(nextState, "", `#${section}`);
    } else {
      window.history.pushState({ ...nextState, portfolioDirect: false }, "", `#${section}`);
    }
    renderSection(section, true);
  }

  function closeDrawer() {
    if (!activeSection) return;
    const state = window.history.state || {};
    if (!state.portfolioDirect) {
      hideDrawer();
      window.history.back();
      return;
    }
    const cleanUrl = `${window.location.pathname}${window.location.search}`;
    hideDrawer();
    window.history.replaceState({ portfolioSection: null, portfolioDirect: false }, "", cleanUrl);
  }

  sectionButtons.forEach((button) => {
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => navigateTo(button.dataset.section, button));
  });
  closeButtons.forEach((button) => button.addEventListener("click", closeDrawer));

  window.addEventListener("popstate", () => {
    const section = sectionFromHash();
    if (section) renderSection(section, true);
    else hideDrawer();
  });

  document.addEventListener("keydown", (event) => {
    if (!activeSection) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeDrawer();
      return;
    }
    if (event.key !== "Tab") return;
    const items = focusableItems();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  function legacyCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    if (!copied) throw new Error("Copy command was rejected");
  }

  async function copyProfile(button) {
    const text = document.querySelector("#ai-profile").content.textContent.trim();
    const action = button.closest(".copy-action");
    const copyStatus = action.querySelector('[role="status"]');
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) await navigator.clipboard.writeText(text);
      else legacyCopy(text);
      copyStatus.textContent = "AI-readable profile copied to clipboard.";
    } catch (error) {
      copyStatus.textContent = "Automatic copy failed. Select and copy the profile from the text box below.";
      let fallback = action.querySelector(".copy-fallback");
      if (!fallback) {
        fallback = document.createElement("textarea");
        fallback.className = "copy-fallback";
        fallback.setAttribute("aria-label", "AI-readable profile text");
        fallback.rows = 10;
        copyStatus.after(fallback);
      }
      fallback.value = text;
      fallback.focus();
      fallback.select();
    }
  }
  copyButtons.forEach((button) => {
    button.addEventListener("click", () => copyProfile(button));
  });

  const initialSection = sectionFromHash();
  if (initialSection) {
    window.history.replaceState({ portfolioSection: initialSection, portfolioDepth: 0, portfolioDirect: true }, "", `#${initialSection}`);
    renderSection(initialSection, true);
  } else {
    window.history.replaceState({ portfolioSection: null, portfolioDepth: 0, portfolioDirect: false }, "", window.location.href);
  }
})();
