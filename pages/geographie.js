/* ═══════════════════════════════════════════════════════════════
   PARAMÉTRAGE GÉOGRAPHIQUE — 6 sous-onglets (Villes, Pays, Rues,
   Périmètres & Quartiers, Agglomérations, Sites)
   ═══════════════════════════════════════════════════════════════ */

const GeographiePage = (() => {

  const SUBTABS = [
    { id:'villes',     icon:'location_city', label:'Villes' },
    { id:'pays',       icon:'public',        label:'Pays' },
    { id:'rues',       icon:'signpost',      label:'Rues' },
    { id:'perimetres', icon:'map',           label:'Périmètres & Quartiers' },
    { id:'agglo',      icon:'hub',           label:'Agglomérations' },
    { id:'sites',      icon:'place',         label:'Sites' },
  ];

  /* ───── Demo data ───── */
  const VILLES = [
    { nom:'Saint-Maur-des-Fossés', cp:'94100', insee:'94068', pays:'France', actif:true },
    { nom:'Créteil',               cp:'94000', insee:'94028', pays:'France', actif:true },
    { nom:'Vincennes',             cp:'94300', insee:'94080', pays:'France', actif:true },
    { nom:'Nogent-sur-Marne',      cp:'94130', insee:'94052', pays:'France', actif:true },
    { nom:'Joinville-le-Pont',     cp:'94340', insee:'94042', pays:'France', actif:true },
  ];
  const PAYS = [
    { nom:'France',   iso:'FR', actif:true },
    { nom:'Belgique', iso:'BE', actif:true },
    { nom:'Suisse',   iso:'CH', actif:true },
    { nom:'Canada',   iso:'CA', actif:true },
  ];
  const RUES = [
    { nom:'de la Paix',        type:'Rue',      ville:'Saint-Maur-des-Fossés', complement:'' },
    { nom:'des Tilleuls',      type:'Avenue',   ville:'Saint-Maur-des-Fossés', complement:'' },
    { nom:'du Moulin',         type:'Chemin',   ville:'Saint-Maur-des-Fossés', complement:'' },
    { nom:'Maurice Berteaux',  type:'Boulevard',ville:'Saint-Maur-des-Fossés', complement:'' },
    { nom:'Saint-Exupéry',     type:'Place',    ville:'Saint-Maur-des-Fossés', complement:'' },
  ];
  const PERIMETRES = [
    { nom:'Quartier Adamville',        ville:'Saint-Maur-des-Fossés', type:'Quartier' },
    { nom:'Quartier La Varenne',       ville:'Saint-Maur-des-Fossés', type:'Quartier' },
    { nom:'Secteur Champignol',        ville:'Saint-Maur-des-Fossés', type:'Quartier' },
    { nom:'Arrondissement 1',          ville:'Paris',                 type:'Arrondissement' },
  ];
  const AGGLOMERATIONS = [
    { nom:'Grand Paris Sud Est Avenir', code:'GPSEA',  nature:'Métropole',               pays:'France', nb_villes:16, debut:'01/01/2016', fin:null },
    { nom:'Paris Est Marne & Bois',     code:'PEMB',   nature:'Communauté d\'agglomération', pays:'France', nb_villes:13, debut:'01/01/2016', fin:null },
  ];
  const SITES = [
    { id:1, nom:'Site principal mairie', tel:'01 45 11 65 00', adresse:'Place Charles de Gaulle, 94100 Saint-Maur-des-Fossés', debut:'01/01/2015', fin:null },
    { id:2, nom:'Annexe technique',      tel:'01 45 11 65 15', adresse:'22 rue des Écoles, 94100 Saint-Maur-des-Fossés',      debut:'01/01/2018', fin:null },
    { id:3, nom:'Centre administratif',  tel:'01 45 11 65 20', adresse:'5 avenue de la République, 94100 Saint-Maur-des-Fossés', debut:'01/09/2020', fin:null },
  ];

  /* ───── State ───── */
  let subtab = 'villes';

  function render(el, params) {
    if (params?.subtab && SUBTABS.find(t => t.id === params.subtab)) subtab = params.subtab;

    // Cross-link depuis fiche établissement / collectivité : ?siteId=X → ouvre le drawer
    const hashParts = location.hash.split('?');
    const query = hashParts.length > 1 ? new URLSearchParams(hashParts[1]) : new URLSearchParams();
    const siteIdParam = query.get('siteId');

    el.innerHTML = `
      <div class="params-shell">
        <div class="params-header">
          <div class="params-header-icon">
            <span class="material-icons-outlined">public</span>
          </div>
          <div>
            <h1>Paramétrage géographique</h1>
            <div class="subtitle">Référentiels territoriaux partagés : villes, pays, rues, périmètres, agglomérations, sites</div>
          </div>
        </div>

        <div class="params-subtabs">
          ${SUBTABS.map(t => `
            <div class="params-subtab ${subtab === t.id ? 'active' : ''}"
                 onclick="GeographiePage._pickTab('${t.id}')">
              <span class="material-icons-outlined" style="font-size:14px;vertical-align:-2px;">${t.icon}</span>
              ${t.label}
            </div>
          `).join('')}
        </div>

        <div id="geo-subtab-content">${_renderSubtab()}</div>
      </div>
    `;

    // Auto-ouverture du drawer si ?siteId=X et onglet Sites actif
    if (siteIdParam && subtab === 'sites') {
      const site = SITES.find(s => s.id === parseInt(siteIdParam));
      if (site) setTimeout(() => _editSite(site.id), 150);
    }
  }

  function _renderSubtab() {
    switch (subtab) {
      case 'villes':     return _renderVilles();
      case 'pays':       return _renderPays();
      case 'rues':       return _renderRues();
      case 'perimetres': return _renderPerimetres();
      case 'agglo':      return _renderAgglo();
      case 'sites':      return _renderSites();
    }
  }

  /* ══════════════════════════════════════════════════════════
     SUB-TAB 1 : Villes
     ══════════════════════════════════════════════════════════ */
  function _renderVilles() {
    return `
      <div class="bloc">
        <div class="bloc-header">
          <div class="bloc-icon"><span class="material-icons-outlined">location_city</span></div>
          <div>
            <div class="bloc-title">Villes</div>
            <div class="bloc-subtitle">Référentiel des villes</div>
          </div>
          <div style="margin-left:auto;">
            <button class="btn btn-primary btn-sm" onclick="GeographiePage._addVille()">
              <span class="material-icons-outlined">add</span>Ajouter
            </button>
          </div>
        </div>
        <div class="filter-bar" style="margin:0;border:none;border-radius:0;border-bottom:1px solid var(--c-border);">
          <div class="input-wrap search-input">
            <input class="input" placeholder="Rechercher par nom ou code postal…">
            <span class="input-icon material-icons-outlined">search</span>
          </div>
          <select class="input select-filter">
            <option>Tous les pays</option>
            <option>France</option>
            <option>Belgique</option>
          </select>
          <label class="check-row" style="margin-left:auto;">
            <input type="checkbox">
            <span>Afficher les inactifs</span>
          </label>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Code postal</th>
              <th>Code INSEE</th>
              <th>Pays</th>
              <th>Statut</th>
              <th style="width:100px;text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${VILLES.map(v => `
              <tr>
                <td style="font-weight:500;color:var(--c-text-1);">${v.nom}</td>
                <td><code style="background:var(--c-bg);padding:2px 6px;border-radius:var(--r-xs);font-size:11px;">${v.cp}</code></td>
                <td><code style="background:var(--c-bg);padding:2px 6px;border-radius:var(--r-xs);font-size:11px;">${v.insee}</code></td>
                <td>${v.pays}</td>
                <td><span class="chip green">Actif</span></td>
                <td style="text-align:right;">
                  <button class="icon-btn"><span class="material-icons-outlined">edit</span></button>
                  <button class="icon-btn danger"><span class="material-icons-outlined">block</span></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /* ══════════════════════════════════════════════════════════
     SUB-TAB 2 : Pays
     ══════════════════════════════════════════════════════════ */
  function _renderPays() {
    return `
      <div class="bloc">
        <div class="bloc-header">
          <div class="bloc-icon"><span class="material-icons-outlined">public</span></div>
          <div>
            <div class="bloc-title">Pays</div>
            <div class="bloc-subtitle">Référentiel des pays</div>
          </div>
          <div style="margin-left:auto;">
            <button class="btn btn-primary btn-sm" onclick="GeographiePage._addPays()">
              <span class="material-icons-outlined">add</span>Ajouter
            </button>
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Code ISO</th>
              <th>Statut</th>
              <th style="width:100px;text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${PAYS.map(p => `
              <tr>
                <td style="font-weight:500;color:var(--c-text-1);">${p.nom}</td>
                <td><code style="background:var(--c-bg);padding:2px 6px;border-radius:var(--r-xs);">${p.iso}</code></td>
                <td><span class="chip green">Actif</span></td>
                <td style="text-align:right;">
                  <button class="icon-btn"><span class="material-icons-outlined">edit</span></button>
                  <button class="icon-btn danger"><span class="material-icons-outlined">block</span></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /* ══════════════════════════════════════════════════════════
     SUB-TAB 3 : Rues
     ══════════════════════════════════════════════════════════ */
  function _renderRues() {
    return `
      <div class="banner info" style="margin-bottom:14px;">
        <span class="material-icons-outlined">info</span>
        <span>Les <strong>types de voie</strong> (Rue, Avenue, Boulevard, etc.) sont gérés dans <a href="#/params/referentiels/typevoie" style="color:var(--c-primary);font-weight:500;text-decoration:none;">Paramétrage des Référentiels → Types de voie</a>.</span>
      </div>

      <div class="bloc">
        <div class="bloc-header">
          <div class="bloc-icon"><span class="material-icons-outlined">signpost</span></div>
          <div>
            <div class="bloc-title">Rues</div>
            <div class="bloc-subtitle">Référentiel des rues par ville</div>
          </div>
          <div style="margin-left:auto;">
            <button class="btn btn-primary btn-sm"><span class="material-icons-outlined">add</span>Ajouter</button>
          </div>
        </div>
        <div class="filter-bar" style="margin:0;border:none;border-radius:0;border-bottom:1px solid var(--c-border);">
          <div class="input-wrap search-input">
            <input class="input" placeholder="Rechercher par nom…">
            <span class="input-icon material-icons-outlined">search</span>
          </div>
          <select class="input select-filter"><option>Toutes les villes</option></select>
          <select class="input select-filter"><option>Tous les types</option></select>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Nom</th><th>Type de voie</th><th>Ville</th><th>Complément</th><th style="width:100px;text-align:right;">Actions</th></tr>
          </thead>
          <tbody>
            ${RUES.map(r => `
              <tr>
                <td style="font-weight:500;">${r.nom}</td>
                <td><span class="chip blue">${r.type}</span></td>
                <td>${r.ville}</td>
                <td style="color:var(--c-text-4);">${r.complement || '—'}</td>
                <td style="text-align:right;">
                  <button class="icon-btn"><span class="material-icons-outlined">edit</span></button>
                  <button class="icon-btn danger"><span class="material-icons-outlined">delete</span></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /* ══════════════════════════════════════════════════════════
     SUB-TAB 4 : Périmètres + Quartiers
     ══════════════════════════════════════════════════════════ */
  function _renderPerimetres() {
    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <div class="bloc">
          <div class="bloc-header">
            <div class="bloc-icon"><span class="material-icons-outlined">map</span></div>
            <div>
              <div class="bloc-title">Périmètres</div>
              <div class="bloc-subtitle">(${PERIMETRES.length})</div>
            </div>
            <div style="margin-left:auto;">
              <button class="btn btn-primary btn-sm"><span class="material-icons-outlined">add</span>Ajouter</button>
            </div>
          </div>
          <table class="data-table">
            <thead><tr><th>Nom</th><th>Ville</th><th>Type</th><th style="text-align:right;">Actions</th></tr></thead>
            <tbody>
              ${PERIMETRES.map(p => `
                <tr>
                  <td style="font-weight:500;">${p.nom}</td>
                  <td>${p.ville}</td>
                  <td><span class="chip ${p.type === 'Quartier' ? 'blue' : 'purple'}">${p.type}</span></td>
                  <td style="text-align:right;">
                    <button class="icon-btn"><span class="material-icons-outlined">edit</span></button>
                    <button class="icon-btn danger"><span class="material-icons-outlined">delete</span></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="bloc">
          <div class="bloc-header">
            <div class="bloc-icon teal"><span class="material-icons-outlined">place</span></div>
            <div>
              <div class="bloc-title">Quartiers</div>
              <div class="bloc-subtitle">(${PERIMETRES.filter(p => p.type === 'Quartier').length})</div>
            </div>
            <div style="margin-left:auto;">
              <button class="btn btn-primary btn-sm"><span class="material-icons-outlined">add</span>Ajouter</button>
            </div>
          </div>
          <table class="data-table">
            <thead><tr><th>Nom</th><th>Ville</th><th style="text-align:right;">Actions</th></tr></thead>
            <tbody>
              ${PERIMETRES.filter(p => p.type === 'Quartier').map(p => `
                <tr>
                  <td style="font-weight:500;">${p.nom}</td>
                  <td>${p.ville}</td>
                  <td style="text-align:right;">
                    <button class="icon-btn"><span class="material-icons-outlined">edit</span></button>
                    <button class="icon-btn danger"><span class="material-icons-outlined">delete</span></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="padding:10px 14px;font-size:11px;color:var(--c-text-4);border-top:1px solid var(--c-border-light);">
            <span class="material-icons-outlined" style="font-size:13px;vertical-align:middle;">info</span>
            La création d'un quartier insère automatiquement un périmètre parent (PK = FK).
          </div>
        </div>
      </div>
    `;
  }

  /* ══════════════════════════════════════════════════════════
     SUB-TAB 5 : Agglomérations
     ══════════════════════════════════════════════════════════ */
  function _renderAgglo() {
    return `
      <div class="bloc">
        <div class="bloc-header">
          <div class="bloc-icon"><span class="material-icons-outlined">hub</span></div>
          <div>
            <div class="bloc-title">Agglomérations</div>
            <div class="bloc-subtitle">Groupements de communes</div>
          </div>
          <div style="margin-left:auto;">
            <button class="btn btn-primary btn-sm"><span class="material-icons-outlined">add</span>Ajouter</button>
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Code</th>
              <th>Nature</th>
              <th>Pays</th>
              <th>Nb villes</th>
              <th>Période</th>
              <th style="width:180px;text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${AGGLOMERATIONS.map(a => `
              <tr>
                <td style="font-weight:500;color:var(--c-text-1);">${a.nom}</td>
                <td><code style="background:var(--c-bg);padding:2px 6px;border-radius:var(--r-xs);">${a.code}</code></td>
                <td><span class="chip blue">${a.nature}</span></td>
                <td>${a.pays}</td>
                <td><span class="chip purple">${a.nb_villes} villes</span></td>
                <td>Depuis le ${a.debut}</td>
                <td style="text-align:right;">
                  <button class="btn btn-ghost btn-sm" onclick="GeographiePage._agglomVilles('${a.nom}')">
                    <span class="material-icons-outlined">location_city</span>Villes
                  </button>
                  <button class="icon-btn"><span class="material-icons-outlined">edit</span></button>
                  <button class="icon-btn danger"><span class="material-icons-outlined">block</span></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /* ══════════════════════════════════════════════════════════
     SUB-TAB 6 : Sites
     ══════════════════════════════════════════════════════════ */
  function _renderSites() {
    return `
      <div class="bloc">
        <div class="bloc-header">
          <div class="bloc-icon"><span class="material-icons-outlined">place</span></div>
          <div>
            <div class="bloc-title">Sites d'activité</div>
            <div class="bloc-subtitle">Lieux physiques d'accueil (adresse en cascade)</div>
          </div>
          <div style="margin-left:auto;">
            <button class="btn btn-primary btn-sm" onclick="GeographiePage._addSite()">
              <span class="material-icons-outlined">add</span>Ajouter
            </button>
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Période</th>
              <th style="width:100px;text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${SITES.map(s => `
              <tr>
                <td style="font-weight:500;color:var(--c-text-1);">${s.nom}</td>
                <td>${s.tel}</td>
                <td style="color:var(--c-text-3);">${s.adresse}</td>
                <td>Depuis le ${s.debut}</td>
                <td style="text-align:right;">
                  <button class="icon-btn" onclick="GeographiePage._editSite(${s.id})"><span class="material-icons-outlined">edit</span></button>
                  <button class="icon-btn danger"><span class="material-icons-outlined">block</span></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /* ══════════════════════════════════════════════════════════
     DRAWER FORMS
     ══════════════════════════════════════════════════════════ */
  function _addVille() {
    Drawer.open({
      title: 'Nouvelle ville', icon: 'add',
      body: `
        <div class="form-grid fg-2" style="padding:0;">
          <div class="form-field full"><label class="req">Nom</label><input class="input" placeholder="Ex : Paris"></div>
          <div class="form-field"><label>Code postal</label><input class="input" placeholder="75001"></div>
          <div class="form-field"><label>Code INSEE</label><input class="input" placeholder="75056"></div>
          <div class="form-field full"><label class="req">Pays</label>
            <select class="input">${PAYS.map(p => `<option>${p.nom}</option>`).join('')}</select>
          </div>
        </div>
      `,
      footer: `
        <button class="btn btn-ghost" onclick="Drawer.close()">Annuler</button>
        <button class="btn btn-primary" onclick="Drawer.close();Utils.toast('Ville enregistrée','success');">Enregistrer</button>
      `
    });
  }

  function _addPays() {
    Drawer.open({
      title: 'Nouveau pays', icon: 'add',
      body: `
        <div class="form-grid fg-1" style="padding:0;">
          <div class="form-field"><label class="req">Nom</label><input class="input" placeholder="Ex : Espagne"></div>
          <div class="form-field"><label class="req">Code ISO (2 lettres)</label><input class="input" maxlength="2" placeholder="ES"></div>
        </div>
      `,
      footer: `
        <button class="btn btn-ghost" onclick="Drawer.close()">Annuler</button>
        <button class="btn btn-primary" onclick="Drawer.close();Utils.toast('Pays enregistré','success');">Enregistrer</button>
      `
    });
  }

  function _siteFormBody(site) {
    const existing = site || {};
    return `
      <div class="form-grid fg-2" style="padding:0;">
        <div class="form-field full">
          <label class="req">Nom</label>
          <input class="input" value="${existing.nom || ''}" placeholder="Ex : Site principal mairie">
        </div>
        <div class="form-field full">
          <label>Description</label>
          <textarea class="input"></textarea>
        </div>
        <div class="form-field">
          <label>Téléphone</label>
          <input class="input" value="${existing.tel || ''}" placeholder="01 45 11 65 00">
        </div>
        <div class="form-field">
          <label>Fax</label>
          <input class="input">
        </div>
      </div>

      <div style="margin-top:14px;padding:14px;background:var(--c-bg);border-radius:var(--r-md);">
        <div style="font-size:12px;font-weight:600;color:var(--c-text-2);margin-bottom:10px;">
          <span class="material-icons-outlined" style="font-size:14px;vertical-align:-2px;">location_on</span>
          Adresse du site
        </div>
        <div class="form-grid fg-2" style="padding:0;">
          <div class="form-field"><label>Numéro</label><input class="input" placeholder="12"></div>
          <div class="form-field"><label>Rue</label>
            <select class="input"><option>(Choisir une rue)</option>${RUES.map(r => `<option>${r.type} ${r.nom}</option>`).join('')}</select>
          </div>
          <div class="form-field full"><label>Complément</label><input class="input" placeholder="Bâtiment B, 3e étage"></div>
          <div class="form-field"><label>Code postal</label><input class="input" placeholder="94100"></div>
          <div class="form-field"><label>Ville</label><input class="input" disabled value="(auto depuis la rue)"></div>
        </div>
      </div>

      <div class="form-grid fg-2" style="padding:0;margin-top:14px;">
        <div class="form-field"><label>Période de début</label><input class="input" type="date" value="${existing.debut ? '2026-01-01' : '2026-01-01'}"></div>
        <div class="form-field"><label>Période de fin</label><input class="input" type="date"></div>
      </div>
    `;
  }

  function _addSite() {
    Drawer.open({
      title: 'Nouveau site d\'activité', icon: 'add', wide: true,
      body: _siteFormBody(null),
      footer: `
        <button class="btn btn-ghost" onclick="Drawer.close()">Annuler</button>
        <button class="btn btn-primary" onclick="Drawer.close();Utils.toast('Site enregistré','success');">Enregistrer</button>
      `
    });
  }

  function _editSite(id) {
    const site = SITES.find(s => s.id === id);
    if (!site) return;
    Drawer.open({
      title: `Modifier — ${site.nom}`, icon: 'edit', wide: true,
      body: _siteFormBody(site),
      footer: `
        <button class="btn btn-ghost" onclick="Drawer.close()">Annuler</button>
        <button class="btn btn-primary" onclick="Drawer.close();Utils.toast('Site enregistré','success');">Enregistrer</button>
      `
    });
  }

  function _agglomVilles(nom) {
    Drawer.open({
      title: `Villes membres — ${nom}`, icon: 'location_city', wide: true,
      body: `
        <div class="banner info" style="margin-bottom:14px;">
          <span class="material-icons-outlined">info</span>
          <span>Les villes membres d'une agglomération sont utilisées pour déterminer l'éligibilité géographique des familles (tarifs, quotients) et pour les statistiques par territoire.</span>
        </div>

        <div style="display:flex;gap:8px;margin-bottom:14px;align-items:center;">
          <div style="flex:1;font-size:12px;color:var(--c-text-3);font-weight:500;">
            ${VILLES.length} ville${VILLES.length > 1 ? 's' : ''} associée${VILLES.length > 1 ? 's' : ''}
          </div>
          <button class="btn btn-primary btn-sm">
            <span class="material-icons-outlined">add</span>Associer une ville
          </button>
        </div>

        <div style="display:flex;flex-direction:column;gap:6px;">
          ${VILLES.map(v => `
            <div style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:var(--c-surface);border:1px solid var(--c-border);border-radius:var(--r-md);transition:all .15s;">
              <div style="width:32px;height:32px;border-radius:var(--r-sm);background:var(--c-primary-light);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <span class="material-icons-outlined" style="color:var(--c-primary);font-size:18px;">location_city</span>
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:600;color:var(--c-text-1);">${v.nom}</div>
                <div style="font-size:11px;color:var(--c-text-3);">
                  <code style="background:var(--c-bg);padding:1px 5px;border-radius:var(--r-xs);">${v.cp}</code>
                  <span style="margin-left:6px;">${v.pays}</span>
                </div>
              </div>
              <button class="icon-btn danger" title="Dissocier de l'agglomération" onclick="Utils.toast('(Démo) Ville dissociée','info')">
                <span class="material-icons-outlined">link_off</span>
              </button>
            </div>
          `).join('')}
        </div>
      `
    });
  }

  /* ══════════════════════════════════════════════════════════
     NAV
     ══════════════════════════════════════════════════════════ */
  function _pickTab(id) { subtab = id; location.hash = `#/params/geographie/${id}`; }

  return {
    render,
    _pickTab,
    _addVille, _addPays, _addSite, _editSite, _agglomVilles,
  };
})();
window.GeographiePage = GeographiePage;
