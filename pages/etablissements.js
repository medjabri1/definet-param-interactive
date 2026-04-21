/* ═══════════════════════════════════════════════════════════════
   PARAMÉTRAGE DES ÉTABLISSEMENTS — Fiche + Capacités + Services + Géographie
   ═══════════════════════════════════════════════════════════════ */

const EtablissementsPage = (() => {

  const SUBTABS = [
    { id:'etablissements', icon:'apartment',    label:'Établissements' },
    { id:'capacites',      icon:'meeting_room', label:'Capacités' },
    { id:'services',       icon:'account_tree', label:'Services' },
  ];

  /* ───── Organismes ───── */
  const ORGANISMES = [
    { id:1, nom:'École Jean Jaurès',        sigle:'EJJ',  adresse:'12 rue de la Paix, 94100 Saint-Maur', places:240, prive:false, actif:true, days:[1,2,3,4,5], heure_ouv:'07:30', heure_fer:'18:30' },
    { id:2, nom:'Crèche Les Petits Loups',  sigle:'CPL',  adresse:'34 avenue des Tilleuls, 94100 Saint-Maur', places:48, prive:false, actif:true, days:[1,2,3,4,5], heure_ouv:'07:00', heure_fer:'19:00' },
    { id:3, nom:'ALSH Le Moulin',           sigle:'ALM',  adresse:'5 chemin du Moulin, 94100 Saint-Maur', places:120, prive:false, actif:true, days:[3,6], heure_ouv:'08:00', heure_fer:'18:00' },
    { id:4, nom:'École Saint-Exupéry',      sigle:'ESE',  adresse:'18 place Saint-Ex, 94100 Saint-Maur', places:320, prive:false, actif:true, days:[1,2,3,4,5], heure_ouv:'07:30', heure_fer:'18:30' },
    { id:5, nom:'Collège privé Sainte-Marie',sigle:'CPSM',adresse:'7 boulevard Maurice Berteaux', places:450, prive:true, actif:true, days:[1,2,3,4,5], heure_ouv:'07:45', heure_fer:'18:00' },
    { id:6, nom:'Multi-accueil Arc-en-Ciel',sigle:'MAC', adresse:'22 rue des Écoles', places:30, prive:false, actif:false, days:[1,2,3,4,5], heure_ouv:'07:30', heure_fer:'18:30' },
  ];

  const SECTIONS = {
    2: [ // crèche Les Petits Loups
      { nom:'Bébés',    places:12, age_min:2,  age_max:12, h_deb:'07:00', h_fin:'19:00' },
      { nom:'Moyens',   places:18, age_min:12, age_max:24, h_deb:'07:00', h_fin:'19:00' },
      { nom:'Grands',   places:18, age_min:24, age_max:36, h_deb:'07:00', h_fin:'19:00' },
    ],
    3: [ // ALSH Le Moulin
      { nom:'Maternels', places:40, age_min:36,  age_max:72,  h_deb:'08:00', h_fin:'18:00' },
      { nom:'Primaires', places:80, age_min:72,  age_max:132, h_deb:'08:00', h_fin:'18:00' },
    ],
  };

  const SERVICES = {
    2: [
      { id:1, nom:'Direction', sigle:'DIR', children:[
        { id:2, nom:'Secrétariat', sigle:'SEC', children:[] },
        { id:3, nom:'Comptabilité', sigle:'CPT', children:[] },
      ]},
      { id:4, nom:'Équipe pédagogique', sigle:'PED', periode_debut:'01/09/2025', periode_fin:'31/08/2026', children:[
        { id:5, nom:'Section Bébés',  sigle:'BEB', periode_debut:'01/09/2025', periode_fin:'31/08/2026', children:[] },
        { id:6, nom:'Section Moyens', sigle:'MOY', periode_debut:'01/09/2025', periode_fin:'31/08/2026', children:[] },
        { id:7, nom:'Section Grands', sigle:'GRA', periode_debut:'01/09/2025', periode_fin:'31/08/2026', children:[] },
      ]},
      { id:8, nom:'Restauration', sigle:'RES', children:[], inactif:true },
    ],
  };

  /* Les données géographiques (villes, pays, rues, périmètres, agglomérations, sites)
     ont été déplacées vers le module Paramétrage géographique (pages/geographie.js).
     Cette page ne couvre plus que : Établissements, Capacités, Services. */

  /* ───── State ───── */
  let subtab = 'etablissements';
  let selectedOrgaId = 1;
  let editOrgaMode = false;
  let selectedCapId = 2; // crèche
  let selectedServiceOrga = 2;
  let expandedNodes = new Set([1, 4]);

  function render(el, params) {
    if (params?.subtab && SUBTABS.find(t => t.id === params.subtab)) subtab = params.subtab;

    el.innerHTML = `
      <div class="params-shell">
        <div class="params-header">
          <div class="params-header-icon">
            <span class="material-icons-outlined">apartment</span>
          </div>
          <div>
            <h1>Paramétrage des Établissements</h1>
            <div class="subtitle">Organismes, capacités, services et référentiels géographiques</div>
          </div>
        </div>

        <div class="params-subtabs">
          ${SUBTABS.map(t => `
            <div class="params-subtab ${subtab === t.id ? 'active' : ''}"
                 onclick="EtablissementsPage._pickTab('${t.id}')">
              <span class="material-icons-outlined" style="font-size:14px;vertical-align:-2px;">${t.icon}</span>
              ${t.label}
            </div>
          `).join('')}
        </div>

        <div id="subtab-content">${_renderSubtab()}</div>
      </div>
    `;
  }

  function _renderSubtab() {
    switch (subtab) {
      case 'etablissements': return _renderEtablissements();
      case 'capacites':      return _renderCapacites();
      case 'services':       return _renderServices();
    }
  }

  /* ══════════════════════════════════════════════════════════
     SUB-TAB 1 : Établissements (list + detail)
     ══════════════════════════════════════════════════════════ */
  function _renderEtablissements() {
    const orga = ORGANISMES.find(o => o.id === selectedOrgaId) || ORGANISMES[0];

    return `
      <div class="split-layout">
        <aside class="split-sidebar" style="max-height:76vh;">
          <div style="padding:12px 14px;border-bottom:1px solid var(--c-border);display:flex;align-items:center;gap:10px;">
            <div style="flex:1;font-size:13px;font-weight:600;color:var(--c-text-1);">
              Établissements <span style="color:var(--c-text-4);font-weight:500;">(${ORGANISMES.length})</span>
            </div>
            <button class="btn btn-primary btn-sm" onclick="EtablissementsPage._addOrga()">
              <span class="material-icons-outlined">add</span>
            </button>
          </div>
          <div style="padding:10px 12px;border-bottom:1px solid var(--c-border-light);">
            <div class="input-wrap">
              <input class="input" placeholder="Rechercher par nom…">
              <span class="input-icon material-icons-outlined">search</span>
            </div>
            <label class="check-row" style="margin-top:8px;">
              <input type="checkbox"><span style="font-size:12px;">Afficher les inactifs</span>
            </label>
          </div>
          <div class="side-list">
            ${ORGANISMES.filter(o => o.actif).map(o => `
              <div class="orga-list-item ${selectedOrgaId === o.id ? 'active' : ''}"
                   onclick="EtablissementsPage._pickOrga(${o.id})">
                <div class="orga-avatar">${o.sigle.substring(0,2)}</div>
                <div class="orga-main">
                  <div class="orga-name">${o.nom}</div>
                  <div class="orga-sub">${o.adresse}</div>
                  <div>
                    <span class="orga-badge">${o.places} places</span>
                    ${o.prive ? '<span class="orga-badge" style="background:var(--c-purple-light);color:var(--c-purple);margin-left:4px;">Privé</span>' : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </aside>

        <div class="split-content">
          ${_renderOrgaDetail(orga)}
        </div>
      </div>
    `;
  }

  function _renderOrgaDetail(o) {
    const dayLabels = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
    const dayIndices = [1, 2, 3, 4, 5, 6, 0]; // JS Date convention: 0=dim, 1=lun...
    const ro = !editOrgaMode ? 'disabled' : '';
    return `
      <div class="bloc">
        <div class="bloc-header">
          <div class="bloc-icon"><span class="material-icons-outlined">apartment</span></div>
          <div style="flex:1;">
            <div class="bloc-title">${o.nom}</div>
            <div class="bloc-subtitle">${o.sigle}</div>
          </div>
          ${editOrgaMode ? `
            <button class="btn btn-ghost btn-sm" onclick="EtablissementsPage._cancelEdit()">Annuler</button>
            <button class="btn btn-primary btn-sm" style="margin-left:6px;" onclick="EtablissementsPage._saveEdit()">
              <span class="material-icons-outlined">check</span>Enregistrer
            </button>
          ` : `
            <button class="btn btn-primary btn-sm" onclick="EtablissementsPage._startEdit()">
              <span class="material-icons-outlined">edit</span>Modifier
            </button>
          `}
        </div>

        <div style="padding:4px 0 14px;">
          <div class="bloc-header" style="border-top:1px solid var(--c-border-light);border-bottom:1px solid var(--c-border-light);margin:0;">
            <div class="bloc-icon teal"><span class="material-icons-outlined">info</span></div>
            <div class="bloc-title">Informations générales</div>
          </div>
          <div class="form-grid fg-2">
            <div class="form-field">
              <label class="req">Nom</label>
              <input class="input" value="${o.nom}" ${ro}>
            </div>
            <div class="form-field">
              <label>Sigle</label>
              <input class="input" value="${o.sigle}" ${ro}>
            </div>
            <div class="form-field">
              <label>SIRET</label>
              <input class="input" value="21940067800019" maxlength="14" ${ro}>
            </div>
            <div class="form-field">
              <label>Nature</label>
              <select class="input" ${ro}>
                <option>Établissement scolaire</option>
                <option>Établissement d'accueil petite enfance</option>
                <option>Accueil de loisirs</option>
              </select>
            </div>
            <div class="form-field">
              <label>Email</label>
              <input class="input" type="email" value="contact@${o.sigle.toLowerCase()}.fr" ${ro}>
            </div>
            <div class="form-field">
              <label>Téléphone</label>
              <input class="input" value="01 45 11 65 00" ${ro}>
            </div>
            <label class="check-row">
              <input type="checkbox" ${o.prive?'checked':''} ${ro}><span>Établissement privé</span>
            </label>
            <div class="form-field">
              <label>Superficie (m²)</label>
              <input class="input" type="number" value="1850" ${ro}>
            </div>
          </div>

          <div class="bloc-header" style="border-top:1px solid var(--c-border-light);border-bottom:1px solid var(--c-border-light);margin:10px 0 0;">
            <div class="bloc-icon warn"><span class="material-icons-outlined">schedule</span></div>
            <div class="bloc-title">Horaires et capacité</div>
          </div>
          <div class="form-grid fg-2">
            <div class="form-field">
              <label>Heure d'ouverture</label>
              <input class="input" type="time" value="${o.heure_ouv}" ${ro}>
            </div>
            <div class="form-field">
              <label>Heure de fermeture</label>
              <input class="input" type="time" value="${o.heure_fer}" ${ro}>
            </div>
            <div class="form-field">
              <label>Nombre de places</label>
              <input class="input" type="number" min="0" value="${o.places}" ${ro}>
            </div>
            <div class="form-field full">
              <label>Jours d'ouverture</label>
              <div class="days-row">
                ${dayLabels.map((lbl, i) => {
                  const idx = dayIndices[i];
                  return `
                  <div class="day-chip ${o.days.includes(idx) ? 'active' : ''} ${!editOrgaMode ? 'readonly' : ''}"
                       onclick="${editOrgaMode ? `EtablissementsPage._toggleDay(${idx})` : ''}">${lbl}</div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <div class="bloc-header" style="border-top:1px solid var(--c-border-light);border-bottom:1px solid var(--c-border-light);margin:10px 0 0;">
            <div class="bloc-icon purple"><span class="material-icons-outlined">person</span></div>
            <div class="bloc-title">Responsable</div>
          </div>
          <div class="form-grid fg-2">
            <div class="form-field">
              <label>Nom du responsable</label>
              <input class="input" value="Marie DUPONT" ${ro}>
            </div>
            <div class="form-field">
              <label>Fonction</label>
              <input class="input" value="Directrice d'établissement" ${ro}>
            </div>
          </div>

          <div class="bloc-header" style="border-top:1px solid var(--c-border-light);border-bottom:1px solid var(--c-border-light);margin:10px 0 0;">
            <div class="bloc-icon"><span class="material-icons-outlined">location_on</span></div>
            <div class="bloc-title">Adresse</div>
          </div>
          <div class="form-grid fg-1">
            <div class="form-field">
              <div style="display:flex;gap:8px;align-items:center;">
                <input class="input" value="${o.adresse}" disabled style="flex:1;">
                <button class="btn btn-ghost btn-sm" onclick="Router.go('/params/geographie/sites?siteId=1')">
                  <span class="material-icons-outlined">link</span>Gérer le site principal
                </button>
              </div>
              <div class="hint">L'adresse provient du site principal. Utilisez l'onglet Sites pour la modifier.</div>
            </div>
          </div>

          <div class="tracability">
            <span class="material-icons-outlined">history</span>
            Dernière modification le 12/04/2026 à 09h15 par Paul MARTIN
          </div>
        </div>
      </div>
    `;
  }

  /* ══════════════════════════════════════════════════════════
     SUB-TAB 2 : Capacités
     ══════════════════════════════════════════════════════════ */
  function _renderCapacites() {
    const orga = ORGANISMES.find(o => o.id === selectedCapId);
    const sections = SECTIONS[selectedCapId] || [];
    const totalPlaces = sections.reduce((s, x) => s + x.places, 0);
    const overflow = orga && totalPlaces > orga.places;

    return `
      <div class="bloc">
        <div class="bloc-header">
          <div class="bloc-icon"><span class="material-icons-outlined">meeting_room</span></div>
          <div>
            <div class="bloc-title">Capacités par section</div>
            <div class="bloc-subtitle">Définition des sections d'accueil (requis PSU pour les crèches)</div>
          </div>
        </div>
        <div style="padding:14px 18px;border-bottom:1px solid var(--c-border-light);">
          <label style="font-size:12px;color:var(--c-text-3);font-weight:500;display:block;margin-bottom:6px;">Établissement</label>
          <select class="input" style="max-width:360px;" onchange="EtablissementsPage._pickCap(this.value)">
            ${ORGANISMES.filter(o => o.actif).map(o => `
              <option value="${o.id}" ${o.id===selectedCapId?'selected':''}>${o.nom} (${o.places} places)</option>
            `).join('')}
          </select>
        </div>

        <div style="padding:16px 18px;">
          ${overflow ? `
            <div class="banner warn">
              <span class="material-icons-outlined">warning</span>
              <span>La capacité totale des sections (${totalPlaces} places) dépasse la capacité de l'établissement (${orga.places} places).</span>
            </div>
          ` : ''}

          <div class="flex-between mb-3">
            <div style="font-size:13px;font-weight:600;color:var(--c-text-1);">
              Sections — ${orga?.nom} <span style="color:var(--c-text-4);font-weight:500;">(${sections.length})</span>
            </div>
            <button class="btn btn-primary btn-sm" onclick="EtablissementsPage._addSection()">
              <span class="material-icons-outlined">add</span>Ajouter une section
            </button>
          </div>

          ${sections.length > 0 ? sections.map(s => `
            <div class="section-card">
              <div class="section-name">${s.nom}</div>
              <div class="section-badges">
                <span class="chip blue"><span class="material-icons-outlined">groups</span>${s.places} places</span>
                ${s.age_min !== null ? `<span class="chip purple"><span class="material-icons-outlined">child_care</span>${s.age_min} à ${s.age_max} mois</span>` : ''}
                ${s.h_deb ? `<span class="chip" style="background:#FEF3C7;color:#D97706;"><span class="material-icons-outlined">schedule</span>${s.h_deb} – ${s.h_fin}</span>` : ''}
              </div>
              <div class="section-actions">
                <button class="icon-btn" onclick="EtablissementsPage._editSection('${s.nom}')">
                  <span class="material-icons-outlined">edit</span>
                </button>
                <button class="icon-btn danger">
                  <span class="material-icons-outlined">delete</span>
                </button>
              </div>
            </div>
          `).join('') : `
            <div class="empty-state">
              <span class="material-icons-outlined">meeting_room</span>
              <div class="title">Aucune section définie</div>
              <div class="desc">Utilisez le bouton « Ajouter une section » pour commencer.</div>
            </div>
          `}
        </div>
      </div>
    `;
  }

  /* ══════════════════════════════════════════════════════════
     SUB-TAB 3 : Services (tree)
     ══════════════════════════════════════════════════════════ */
  function _renderServices() {
    const orga = ORGANISMES.find(o => o.id === selectedServiceOrga);
    const tree = SERVICES[selectedServiceOrga] || [];

    return `
      <div class="bloc">
        <div class="bloc-header">
          <div class="bloc-icon"><span class="material-icons-outlined">account_tree</span></div>
          <div>
            <div class="bloc-title">Arborescence des services</div>
            <div class="bloc-subtitle">Hiérarchie services / sous-services d'un établissement</div>
          </div>
        </div>
        <div style="padding:14px 18px;border-bottom:1px solid var(--c-border-light);">
          <label style="font-size:12px;color:var(--c-text-3);font-weight:500;display:block;margin-bottom:6px;">Établissement</label>
          <select class="input" style="max-width:360px;" onchange="EtablissementsPage._pickServiceOrga(this.value)">
            ${ORGANISMES.filter(o => o.actif).map(o => `
              <option value="${o.id}" ${o.id===selectedServiceOrga?'selected':''}>${o.nom}</option>
            `).join('')}
          </select>
        </div>

        <div style="padding:14px 18px;">
          <div class="flex-between mb-3">
            <div style="font-size:13px;font-weight:600;color:var(--c-text-1);">
              Services — ${orga?.nom}
            </div>
            <button class="btn btn-primary btn-sm" onclick="EtablissementsPage._addServiceRoot()">
              <span class="material-icons-outlined">add</span>Ajouter un service racine
            </button>
          </div>

          <div class="tree-view">
            ${tree.length > 0
              ? tree.map(n => _renderTreeNode(n, 0)).join('')
              : `<div class="empty-state"><div class="desc">Aucun service défini pour cet établissement.</div></div>`}
          </div>
        </div>
      </div>
    `;
  }

  function _renderTreeNode(node, depth) {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const icon = hasChildren ? 'folder' : 'article';
    const period = (node.periode_debut || node.periode_fin)
      ? `<span class="tree-period">
           <span class="material-icons-outlined" style="font-size:12px;vertical-align:-2px;">event</span>
           Du ${node.periode_debut || '—'}${node.periode_fin ? ' au ' + node.periode_fin : ''}
         </span>`
      : '';
    return `
      <div class="tree-node ${node.inactif ? 'inactive' : ''} ${isExpanded ? 'expanded' : ''}"
           onclick="EtablissementsPage._toggleNode(${node.id})">
        <span class="tree-expand">
          ${hasChildren ? '<span class="material-icons-outlined">chevron_right</span>' : ''}
        </span>
        <span class="tree-icon"><span class="material-icons-outlined">${icon}</span></span>
        <span class="tree-label">${node.nom}<span class="tree-sigle">(${node.sigle})</span></span>
        ${period}
        <div class="tree-actions" onclick="event.stopPropagation();">
          <button class="icon-btn sm" title="Ajouter sous-service"><span class="material-icons-outlined">add</span></button>
          <button class="icon-btn sm" title="Modifier" onclick="EtablissementsPage._editService(${node.id})"><span class="material-icons-outlined">edit</span></button>
          <button class="icon-btn sm danger" title="Désactiver" onclick="event.stopPropagation();EtablissementsPage._disableService(${node.id})"><span class="material-icons-outlined">block</span></button>
        </div>
      </div>
      ${hasChildren ? `
        <div class="tree-children ${isExpanded ? '' : 'collapsed'}">
          ${node.children.map(c => _renderTreeNode(c, depth + 1)).join('')}
        </div>
      ` : ''}
    `;
  }


  /* ══════════════════════════════════════════════════════════
     DRAWER FORMS
     ══════════════════════════════════════════════════════════ */
  function _addSection() {
    Drawer.open({
      title: 'Nouvelle section', icon: 'add',
      body: `
        <div class="form-grid fg-2" style="padding:0;">
          <div class="form-field full"><label class="req">Nom</label><input class="input" placeholder="Ex : Bébés"></div>
          <div class="form-field full"><label class="req">Nombre de places</label><input class="input" type="number" min="0" placeholder="12"></div>
          <div class="form-field"><label>Âge minimum (mois)</label><input class="input" type="number" placeholder="2"></div>
          <div class="form-field"><label>Âge maximum (mois)</label><input class="input" type="number" placeholder="12"></div>
          <div class="form-field"><label>Heure de début</label><input class="input" type="time" value="07:00"></div>
          <div class="form-field"><label>Heure de fin</label><input class="input" type="time" value="19:00"></div>
        </div>
      `,
      footer: `
        <button class="btn btn-ghost" onclick="Drawer.close()">Annuler</button>
        <button class="btn btn-primary" onclick="Drawer.close();Utils.toast('Section enregistrée','success');">Enregistrer</button>
      `
    });
  }

  function _editSection(nom) { _addSection(); }

  function _addServiceRoot() {
    Drawer.open({
      title: 'Nouveau service', icon: 'add',
      body: `
        <div class="form-grid fg-1" style="padding:0;">
          <div class="form-field"><label class="req">Nom</label><input class="input"></div>
          <div class="form-field"><label>Sigle</label><input class="input"></div>
          <div class="form-field"><label>Description</label><textarea class="input"></textarea></div>
          <div class="form-field"><label>Service parent</label>
            <select class="input"><option>(Racine)</option><option>Direction</option><option>Équipe pédagogique</option></select>
          </div>
          <div class="form-field"><label>Ordre d'affichage</label><input class="input" type="number"></div>
          <div class="form-grid fg-2" style="padding:0;">
            <div class="form-field"><label>Période de début</label><input class="input" type="date"></div>
            <div class="form-field"><label>Période de fin</label><input class="input" type="date"></div>
          </div>
        </div>
      `,
      footer: `
        <button class="btn btn-ghost" onclick="Drawer.close()">Annuler</button>
        <button class="btn btn-primary" onclick="Drawer.close();Utils.toast('Service enregistré','success');">Enregistrer</button>
      `
    });
  }

  function _editService(id) { _addServiceRoot(); }

  function _findService(id, tree) {
    for (const n of (tree || SERVICES[selectedServiceOrga] || [])) {
      if (n.id === id) return n;
      const found = _findService(id, n.children);
      if (found) return found;
    }
    return null;
  }

  function _countDescendants(node) {
    let c = 0;
    for (const child of node.children || []) {
      c += 1 + _countDescendants(child);
    }
    return c;
  }

  function _disableService(id) {
    const node = _findService(id);
    if (!node) return;
    const descendants = _countDescendants(node);
    const hasChildren = descendants > 0;
    Modals.confirm({
      title: 'Désactiver ce service ?',
      message: `Le service « ${node.nom} » sera désactivé.`,
      confirmText: 'Désactiver',
      danger: true,
      extraHtml: hasChildren ? `
        <div style="margin-top:12px;padding:10px 12px;background:var(--c-warning-light);border:1px solid #FDE68A;border-radius:var(--r-sm);">
          <div style="font-size:12px;color:var(--c-warning);font-weight:500;margin-bottom:8px;">
            Ce service contient ${descendants} sous-service${descendants > 1 ? 's' : ''}.
          </div>
          <label class="check-row" style="height:auto;">
            <input type="checkbox" id="cascade-check" checked>
            <span style="font-size:12px;">Désactiver aussi les sous-services</span>
          </label>
        </div>
      ` : '',
      onConfirm: (snapshot) => {
        const cascade = snapshot['cascade-check'] === true;
        node.inactif = true;
        if (cascade && hasChildren) {
          const markInactive = (n) => { n.inactif = true; (n.children || []).forEach(markInactive); };
          (node.children || []).forEach(markInactive);
        }
        render(document.getElementById('router-outlet'));
        Utils.toast(
          hasChildren
            ? (cascade ? `Service et ${descendants} sous-service(s) désactivés` : 'Service désactivé (sous-services conservés)')
            : 'Service désactivé',
          'info'
        );
      }
    });
  }


  function _addOrga() {
    Drawer.open({
      title: 'Nouvel établissement', icon: 'add', wide: true,
      body: `
        <div class="form-grid fg-2" style="padding:0;">
          <div class="form-field full"><label class="req">Nom</label><input class="input" placeholder="Ex : École Jean Jaurès"></div>
          <div class="form-field"><label>Sigle</label><input class="input"></div>
          <div class="form-field"><label>SIRET</label><input class="input" maxlength="14"></div>
          <div class="form-field full"><label>Nature</label>
            <select class="input">
              <option>Établissement scolaire</option>
              <option>Crèche / Multi-accueil</option>
              <option>Accueil de loisirs</option>
            </select>
          </div>
          <div class="form-field"><label>Email</label><input class="input" type="email"></div>
          <div class="form-field"><label>Téléphone</label><input class="input"></div>
        </div>
      `,
      footer: `
        <button class="btn btn-ghost" onclick="Drawer.close()">Annuler</button>
        <button class="btn btn-primary" onclick="Drawer.close();Utils.toast('Établissement créé','success');">Créer</button>
      `
    });
  }

  /* ══════════════════════════════════════════════════════════
     NAV + STATE
     ══════════════════════════════════════════════════════════ */
  function _pickTab(id)       { subtab = id; location.hash = `#/params/etablissements/${id}`; }
  function _pickOrga(id)      { selectedOrgaId = id; editOrgaMode = false; render(document.getElementById('router-outlet')); }
  function _startEdit()       { editOrgaMode = true; render(document.getElementById('router-outlet')); }
  function _cancelEdit()      { editOrgaMode = false; render(document.getElementById('router-outlet')); Utils.toast('Modifications annulées','info'); }
  function _saveEdit()        { editOrgaMode = false; render(document.getElementById('router-outlet')); Utils.toast('Fiche enregistrée','success'); }
  function _toggleDay(i)      {
    const o = ORGANISMES.find(x => x.id === selectedOrgaId);
    if (!o) return;
    const idx = o.days.indexOf(i);
    if (idx >= 0) o.days.splice(idx, 1); else o.days.push(i);
    render(document.getElementById('router-outlet'));
  }
  function _pickCap(id)       { selectedCapId = parseInt(id); render(document.getElementById('router-outlet')); }
  function _pickServiceOrga(id){ selectedServiceOrga = parseInt(id); render(document.getElementById('router-outlet')); }
  function _toggleNode(id)    {
    if (expandedNodes.has(id)) expandedNodes.delete(id); else expandedNodes.add(id);
    render(document.getElementById('router-outlet'));
  }

  return {
    render,
    _pickTab, _pickOrga, _startEdit, _cancelEdit, _saveEdit, _toggleDay,
    _pickCap, _addSection, _editSection,
    _pickServiceOrga, _toggleNode, _addServiceRoot, _editService,
    _addOrga,
    _disableService,
  };
})();
window.EtablissementsPage = EtablissementsPage;
