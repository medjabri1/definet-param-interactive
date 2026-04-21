/* ═══════════════════════════════════════════════════════════════
   SIDENAV — Left navigation (params-focused demo)
   ═══════════════════════════════════════════════════════════════ */

const Sidenav = (() => {

  const NAV_ITEMS = [
    { id: 'home', icon: 'dashboard', label: 'Accueil', route: '/' },
    null,
    {
      id: 'params', icon: 'settings', label: 'Paramétrage', route: '/params', open: true,
      children: [
        { id: 'p-organisation',   icon: 'business',  label: 'Paramétrage de l\'Organisation', route: '/params/organisation' },
        { id: 'p-etablissement',  icon: 'apartment', label: 'Paramétrage des Établissements', route: '/params/etablissements' },
        { id: 'p-geographie',     icon: 'public',    label: 'Paramétrage géographique',       route: '/params/geographie' },
        { id: 'p-referentiels',   icon: 'list_alt',  label: 'Paramétrage des Référentiels',   route: '/params/referentiels' },
        { id: 'p-reglementation', icon: 'policy',    label: 'Réglementation',                 route: '/params/reglementation' },
      ]
    }
  ];

  function render() {
    const el = document.getElementById('sidenav');
    if (!el) return;

    const openGroups = State.get('navOpenGroups') || { params: true };

    el.innerHTML = `
      <div class="snav-brand" onclick="Router.go('/')" title="Definet">
        <div class="sidenav-logo">D</div>
        <span class="snav-name">Definet</span>
      </div>

      ${NAV_ITEMS.map(item => {
        if (!item) return `<div class="nav-divider"></div>`;

        if (item.children) {
          const isOpen = openGroups[item.id] !== false;
          return `
            <div class="nav-item nav-group${isOpen ? ' open' : ''}" id="nav-${item.id}"
                 data-route="${item.route}"
                 data-tooltip="${item.label}"
                 onclick="Sidenav.handleGroupClick('${item.id}')">
              <span class="material-icons-outlined">${item.icon}</span>
              <span class="nav-label">${item.label}</span>
              <span class="nav-group-arrow material-icons-outlined">expand_more</span>
            </div>
            <div class="nav-sub-items${isOpen ? ' open' : ''}" id="nav-sub-${item.id}">
              ${item.children.map(child => {
                if (!child) return `<div style="height:6px;border-top:1px solid rgba(255,255,255,.08);margin:4px 14px;"></div>`;
                const disabled = child.disabled ? ' disabled' : '';
                const onclick = child.disabled
                  ? "event.stopPropagation();Utils.toast('Bientôt disponible','info');"
                  : `event.stopPropagation();Router.go('${child.route}')`;
                return `
                  <div class="nav-sub-item${disabled}" id="nav-${child.id}"
                       data-route="${child.route}"
                       title="${child.disabled ? 'Bientôt disponible' : ''}"
                       onclick="${onclick}">
                    <span class="material-icons-outlined">${child.icon}</span>
                    <span class="nav-label">${child.label}</span>
                    ${child.disabled ? '<span class="material-icons-outlined" style="font-size:13px;margin-left:auto;opacity:.5">lock</span>' : ''}
                  </div>`;
              }).join('')}
            </div>`;
        }

        return `
          <div class="nav-item" id="nav-${item.id}"
               data-route="${item.route}"
               data-tooltip="${item.label}"
               onclick="Router.go('${item.route}')">
            <span class="material-icons-outlined">${item.icon}</span>
            <span class="nav-label">${item.label}</span>
          </div>`;
      }).join('')}

      <div class="nav-bottom">
        <button class="nav-toggle" onclick="Sidenav.toggle()" title="Réduire / Agrandir">
          <span class="material-icons-outlined">chevron_right</span>
        </button>
      </div>
    `;

    const navExpanded = State.get('navExpanded') ?? true;
    el.classList.toggle('expanded', navExpanded);
    _updateActive();
  }

  function toggle() {
    const el = document.getElementById('sidenav');
    if (!el) return;
    const expanded = el.classList.toggle('expanded');
    State.set('navExpanded', expanded);
  }

  function handleGroupClick(id) {
    const el = document.getElementById('sidenav');
    if (!el.classList.contains('expanded')) {
      el.classList.add('expanded');
      State.set('navExpanded', true);
    }
    const groups = State.get('navOpenGroups') || {};
    groups[id] = !groups[id];
    State.set('navOpenGroups', groups);
    render();
  }

  function _updateActive() {
    const route = State.get('route') || '';
    Utils.qsa('.nav-item, .nav-sub-item').forEach(el => {
      const r = el.dataset.route;
      el.classList.toggle('active', r && r !== '/params/disabled' && (route === r || (r !== '/' && route.startsWith(r))));
    });
  }

  State.on('route', _updateActive);

  return { render, toggle, handleGroupClick };
})();
window.Sidenav = Sidenav;

/* Disabled sub-item styling */
(function injectNavParamsStyle(){
  if (document.getElementById('nav-params-style')) return;
  const s = document.createElement('style');
  s.id = 'nav-params-style';
  s.textContent = `
    .nav-sub-item.disabled { opacity: 0.5; cursor: not-allowed; }
    .nav-sub-item.disabled:hover { background: transparent !important; }
  `;
  document.head.appendChild(s);
})();
