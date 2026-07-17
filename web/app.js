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
const size = document.querySelector('[data-map-size]');
const overlay = document.querySelector('[data-map-overlay]');
const overlayClose = document.querySelector('[data-map-overlay-close]');
const layout = document.querySelector('.guide-layout');
const sideTabs = typeof document.querySelectorAll === 'function'
  ? [...document.querySelectorAll('[data-map-side-tab]')]
  : [];
const sideViews = typeof document.querySelectorAll === 'function'
  ? [...document.querySelectorAll('[data-map-default]')]
  : [];

if (sideTabs.length && sideViews.length) {
  const validSides = new Set(['t', 'ct']);

  function applyMapSide(side) {
    const selected = validSides.has(side) ? side : 't';

    sideTabs.forEach((tab) => {
      const isSelected = tab.dataset.mapSideTab === selected;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });
    sideViews.forEach((view) => {
      view.hidden = view.dataset.mapDefault !== selected;
    });
    writePreference('cs2-guide-map-side', selected);
  }

  sideTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => applyMapSide(tab.dataset.mapSideTab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === 'ArrowLeft' ? -1 : 1;
      const nextIndex = event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? sideTabs.length - 1
          : (index + direction + sideTabs.length) % sideTabs.length;
      const nextTab = sideTabs[nextIndex];
      nextTab.focus();
      applyMapSide(nextTab.dataset.mapSideTab);
    });
  });

  applyMapSide(readPreference('cs2-guide-map-side', 't'));
}

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

if (size && overlay && overlayClose && layout) {
  const storedSize = readPreference('cs2-guide-map-size', '1');
  const supportsDialog =
    typeof overlay.showModal === 'function' && typeof overlay.close === 'function';
  let savedInlineSize = ['1', '2', '3'].includes(storedSize) ? storedSize : '1';

  function applyMapSize(value) {
    const selected = ['1', '2', '3', '4'].includes(value) ? value : '1';

    if (selected === '4') {
      if (supportsDialog) {
        overlay.showModal();
        return;
      }

      size.value = savedInlineSize;
      applyMapSize(savedInlineSize);
      return;
    }

    layout.classList.remove('map-size-1', 'map-size-2', 'map-size-3');
    layout.classList.add('map-size-' + selected);
    size.value = selected;
    savedInlineSize = selected;
    writePreference('cs2-guide-map-size', selected);
  }

  applyMapSize(savedInlineSize);

  size.addEventListener('change', () => applyMapSize(size.value));
  overlayClose.addEventListener('click', () => {
    if (supportsDialog) {
      overlay.close();
    }
  });
  overlay.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && supportsDialog) {
      event.preventDefault();
      overlay.close();
    }
  });
  overlay.addEventListener('close', () => {
    size.value = savedInlineSize;
    size.focus();
  });
}
