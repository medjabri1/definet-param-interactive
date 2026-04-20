/* ═══════════════════════════════════════════════════════════════
   ROUTER — Params demo
   ═══════════════════════════════════════════════════════════════ */

const Router = (() => {

  const ROUTES = [
    { pattern: /^\/$/,                              page: 'HomePage' },
    { pattern: /^\/params\/organisation$/,          page: 'CollectivitePage' },
    { pattern: /^\/params\/etablissements$/,        page: 'EtablissementsPage' },
    { pattern: /^\/params\/etablissements\/(.+)$/,  page: 'EtablissementsPage', param: 'subtab' },
    { pattern: /^\/params\/referentiels$/,          page: 'ReferentielsPage' },
    { pattern: /^\/params\/referentiels\/(.+)$/,    page: 'ReferentielsPage', param: 'ref' },
    { pattern: /^\/params\/reglementation$/,        page: 'ReglementationPage' },
  ];

  function _getRoute() {
    return decodeURIComponent(location.hash.slice(1)) || '/';
  }

  function _resolve(path) {
    for (const route of ROUTES) {
      const m = path.match(route.pattern);
      if (m) {
        const params = {};
        if (route.param) params[route.param] = m[1];
        return { page: route.page, params };
      }
    }
    return { page: null, params: { path } };
  }

  function navigate(path) {
    State.set('route', path);
    document.body.className = 'is-app';
    Topbar.render();
    const outlet = document.getElementById('router-outlet');
    if (!outlet) return;

    const { page, params } = _resolve(path);
    let handler = null;
    if (page) {
      try { handler = (new Function(`return typeof ${page} !== 'undefined' ? ${page} : null;`))(); }
      catch (e) { handler = null; }
    }

    if (handler && typeof handler.render === 'function') {
      outlet.innerHTML = '';
      handler.render(outlet, params);
    } else {
      outlet.innerHTML = `
        <div class="params-shell">
          <div class="empty-state">
            <span class="material-icons-outlined">construction</span>
            <div class="title">Page introuvable</div>
            <div class="desc">Route : <code>${path}</code></div>
          </div>
        </div>`;
    }
  }

  function go(path) {
    if (path === (location.hash.slice(1) || '/')) {
      navigate(path);
      return;
    }
    location.hash = '#' + path;
  }

  function init() {
    window.addEventListener('hashchange', () => navigate(_getRoute()));
    navigate(_getRoute());
  }

  return { go, init };
})();
window.Router = Router;
