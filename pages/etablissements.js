/* ═══════════════════════════════════════════════════════════════
   PARAMÉTRAGE DES ÉTABLISSEMENTS — Fiche + Capacités + Services + Géographie
   ═══════════════════════════════════════════════════════════════ */

const EtablissementsPage = (() => {

  const SUBTABS = [
    { id:'etablissements', icon:'apartment',    label:'Établissements' },
    { id:'capacites',      icon:'meeting_room', label:'Capacités' },
    { id:'services',       icon:'account_tree', label:'Services' },
    { id:'villes',         icon:'location_city',label:'Villes' },
    { id:'pays',           icon:'public',       label:'Pays' },
    { id:'rues',           icon:'signpost',     label:'Rues' },
    { id:'perimetres',     icon:'map',          label:'Périmètres & Quartiers' },
    { id:'agglo',          icon:'hub',          label:'Agglomérations' },
    { id:'sites',          icon:'place',        label:'Sites' },
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

  /* ───── Géographie demo data ───── */
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
  const TYPES_VOIE = [
    { nom:'Avenue',   sigle:'AV' },
    { nom:'Boulevard',sigle:'BD' },
    { nom:'Rue',      sigle:'RUE' },
    { nom:'Place',    sigle:'PL' },
    { nom:'Chemin',   sigle:'CH' },
    { nom:'Impasse',  sigle:'IMP' },
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
    { nom:'Site principal mairie', tel:'01 45 11 65 00', adresse:'Place Charles de Gaulle, 94100 Saint-Maur-des-Fossés', debut:'01/01/2015', fin:null },
    { nom:'Annexe technique',      tel:'01 45 11 65 15', adresse:'22 rue des Écoles, 94100 Saint-Maur-des-Fossés',      debut:'01/01/2018', fin:null },
    { nom:'Centre administratif',  tel:'01 45 11 65 20', adresse:'5 avenue de la République, 94100 Saint-Maur-des-Fossés', debut:'01/09/2020', fin:null },
  ];

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
      case 'villes':         return _renderVilles();
      case 'pays':           return _renderPays();
      case 'rues':           return _renderRues();
      case 'perimetres':     return _renderPerimetres();
      case 'agglo':          return _renderAgglo();
      case 'sites':          return _renderSites();
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
                <button class="btn btn-ghost btn-sm" onclick="EtablissementsPage._pickTab('sites')">
                  <span class="material-icons-outlined">link</span>Gérer site principal
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
     SUB-TAB 4 : Villes
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
            <button class="btn btn-primary btn-sm" onclick="EtablissementsPage._addVille()">
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
     SUB-TAB 5 : Pays
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
            <button class="btn btn-primary btn-sm" onclick="EtablissementsPage._addPays()">
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
     SUB-TAB 6 : Rues
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
     SUB-TAB 7 : Périmètres + Quartiers
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
     SUB-TAB 8 : Agglomérations
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
                  <button class="btn btn-ghost btn-sm" onclick="EtablissementsPage._agglomVilles('${a.nom}')">
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
     SUB-TAB 9 : Sites
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
            <button class="btn btn-primary btn-sm" onclick="EtablissementsPage._addSite()">
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

  function _addSite() {
    Drawer.open({
      title: 'Nouveau site d\'activité', icon: 'add', wide: true,
      body: `
        <div class="form-grid fg-2" style="padding:0;">
          <div class="form-field full">
            <label class="req">Nom</label>
            <input class="input" placeholder="Ex : Site principal mairie">
          </div>
          <div class="form-field full">
            <label>Description</label>
            <textarea class="input"></textarea>
          </div>
          <div class="form-field">
            <label>Téléphone</label>
            <input class="input" placeholder="01 45 11 65 00">
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
          <div class="form-field"><label>Période de début</label><input class="input" type="date" value="2026-01-01"></div>
          <div class="form-field"><label>Période de fin</label><input class="input" type="date"></div>
        </div>
      `,
      footer: `
        <button class="btn btn-ghost" onclick="Drawer.close()">Annuler</button>
        <button class="btn btn-primary" onclick="Drawer.close();Utils.toast('Site enregistré','success');">Enregistrer</button>
      `
    });
  }

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
    _addVille, _addPays, _addSite, _addOrga, _agglomVilles,
    _disableService,
  };
})();
window.EtablissementsPage = EtablissementsPage;
