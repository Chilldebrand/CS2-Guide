function readPreference(key, fallback) {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function writePreference(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Current-session behavior remains available when storage is unavailable.
  }
}

const follow = document.querySelector('[data-map-follow]');
const collapse = document.querySelector('[data-map-collapse]');
const panel = document.querySelector('[data-map-panel]');

if (follow && collapse && panel) {
  function applyFollowScroll(enabled) {
    follow.checked = enabled;
    panel.classList.toggle('is-sticky', enabled);
    writePreference('cs2-guide-map-follow', String(enabled));
  }

  function applyCollapsed(collapsed) {
    panel.classList.toggle('is-collapsed', collapsed);
    collapse.setAttribute('aria-expanded', String(!collapsed));
    collapse.textContent = collapsed ? 'Show map' : 'Collapse map';
    writePreference('cs2-guide-map-collapsed', String(collapsed));
  }

  applyFollowScroll(readPreference('cs2-guide-map-follow', 'true') !== 'false');
  applyCollapsed(readPreference('cs2-guide-map-collapsed', 'false') === 'true');

  follow.addEventListener('change', () => applyFollowScroll(follow.checked));
  collapse.addEventListener('click', () => {
    applyCollapsed(!panel.classList.contains('is-collapsed'));
  });
}
