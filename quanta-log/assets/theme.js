(function () {
  // Apply theme immediately before first paint to prevent flash
  var saved = localStorage.getItem('ql-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  window.toggleTheme = function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ql-theme', next);
  };

  window.handleSubscribe = function () {
    var input = document.querySelector('.sub-input');
    var btn = document.querySelector('.subscribe-row button');
    if (!input || !btn) return;

    var email = input.value.trim();
    if (!email) return;

    // Success state
    btn.textContent = 'subscribed ✓';
    btn.style.color = 'var(--green)';
    input.value = '';
    input.placeholder = "you're in.";
  };
})();
