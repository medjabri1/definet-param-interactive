/* ═══════════════════════════════════════════════════════════════
   RÉFÉRENTIELS — 20 référentiels + CRUD générique
   ═══════════════════════════════════════════════════════════════ */

const ReferentielsPage = (() => {

  /* ───── Référentiels config ───── */
  const REFS = [
    { id:'activites',   icon:'sports_soccer',     label:'Types d\'activité',          count:12,
      extraCols:[
        {key:'icon_name', label:'Icône', type:'icon'},
        {key:'description', label:'Description'},
      ],
      extraFields:[
        {key:'icon_name', type:'icon_picker', label:'Icône Material'},
        {key:'description', type:'textarea', label:'Description'},
        {key:'couleur', type:'color', label:'Couleur'},
      ] },
    { id:'motifs',      icon:'event_busy',        label:'Motifs d\'absence',          count:8,
      extraCols:[
        {key:'facturable', label:'Facturable', type:'bool'},
        {key:'justificatif', label:'Justificatif', type:'bool'},
      ],
      extraFields:[
        {key:'facturable', type:'check', label:'L\'absence avec ce motif est facturable', default:true},
        {key:'justificatif', type:'check', label:'Un justificatif doit être fourni'},
        {key:'couleur', type:'color', label:'Couleur'},
      ] },
    { id:'annulation',  icon:'cancel',            label:'Motifs d\'annulation',       count:6,
      extraCols:[{key:'type_entite', label:'Type d\'entité', type:'chip'}],
      extraFields:[{key:'type_entite', type:'select', label:'Applicable à',
        options:['Inscriptions','Demandes','Factures','Toutes les entités']}] },
    { id:'sortie',      icon:'logout',            label:'Motifs de sortie',           count:5 },
    { id:'niveaux',     icon:'school',            label:'Niveaux scolaires',          count:14,
      extraCols:[
        {key:'cycle', label:'Cycle', type:'chip'},
        {key:'ordre', label:'Ordre', type:'num'},
      ],
      extraFields:[
        {key:'cycle', type:'select', label:'Cycle scolaire', options:['Maternelle','Élémentaire','Collège']},
        {key:'ordre', type:'number', label:'Ordre de tri'},
      ] },
    { id:'quotient',    icon:'calculate',         label:'Quotients', special:'quotient', count:24 },
    { id:'dossier',     icon:'folder',            label:'Types de dossier',           count:4 },
    { id:'dossier_org', icon:'domain',            label:'Organismes (référentiel)',   count:9,
      extraCols:[{key:'type', label:'Type', type:'chip'}],
      extraFields:[{key:'type', type:'select', label:'Type d\'organisme',
        options:['Financier','Social','Médical']}] },
    { id:'protocole',   icon:'description',       label:'Protocoles',                 count:7,
      extraCols:[{key:'description', label:'Description'}],
      extraFields:[{key:'description', type:'textarea', label:'Description'}] },
    { id:'fonction',    icon:'badge',             label:'Fonctions',                  count:16 },
    { id:'lien',        icon:'family_restroom',   label:'Liens familiaux',            count:11,
      extraCols:[
        {key:'resp_legal', label:'Resp. légal', type:'bool'},
        {key:'inverse', label:'Lien inverse'},
      ],
      extraFields:[
        {key:'resp_legal', type:'check', label:'Ce lien confère la responsabilité légale'},
        {key:'inverse', type:'select', label:'Lien inverse', options:['(Aucun)','Père','Mère','Fils','Fille','Frère','Sœur']},
      ] },
    { id:'politesse',   icon:'face',              label:'Politesses',                 count:4 },
    { id:'typecontact', icon:'contact_page',      label:'Types de contact',           count:6,
      extraCols:[{key:'categorie', label:'Catégorie', type:'chip'}],
      extraFields:[{key:'categorie', type:'select', label:'Catégorie fonctionnelle',
        options:['Urgence','Raccompagnateur','Administratif','Médical']}] },
    { id:'consommation',icon:'restaurant',        label:'Consommations',              count:5,
      extraCols:[{key:'unite', label:'Unité'}],
      extraFields:[{key:'unite', type:'select', label:'Unité de mesure',
        options:['Heure','Demi-journée','Journée','Repas','Unité']}] },
    { id:'demande',     icon:'assignment',        label:'Types de demande', special:'demande', count:8,
      extraCols:[{key:'commission', label:'Commission', type:'bool', tooltip:'Nécessite un passage en commission'}],
      extraFields:[{key:'commission', type:'check', label:'Nécessite une commission'}] },
    { id:'mode',        icon:'home_work',         label:'Modes d\'accueil',           count:6 },
    { id:'typedoc',     icon:'article',           label:'Types de document',          count:15,
      extraCols:[
        {key:'categorie', label:'Catégorie', type:'chip'},
        {key:'conservation', label:'Conservation'},
        {key:'obligatoire', label:'Obligatoire', type:'bool'},
      ],
      extraFields:[
        {key:'categorie', type:'select', label:'Catégorie', options:['Identité','Médical','Financier','Administratif','Scolaire']},
        {key:'conservation', type:'number', label:'Durée de conservation (mois)'},
        {key:'obligatoire', type:'check', label:'Document obligatoire — le dossier famille sera considéré comme incomplet si absent'},
      ] },
    { id:'natagglo',    icon:'public',            label:'Natures d\'agglomération',   count:4 },
    { id:'natorga',     icon:'account_balance',   label:'Natures d\'organisme',       count:9 },
    { id:'typevoie',    icon:'commit',            label:'Types de voie',              count:6 },
  ];

  /* ───── Demo data for each referentiel ───── */
  const ROWS = {
    activites: [
      { nom:'Football',  sigle:'FOOT', description:'Sport collectif en extérieur', actif:true,  couleur:'#1A9E5C', icon_name:'sports_soccer' },
      { nom:'Tennis',    sigle:'TEN',  description:'Sport individuel de raquette', actif:true,  couleur:'#D97706', icon_name:'sports_tennis' },
      { nom:'Danse',     sigle:'DAN',  description:'Activité artistique',          actif:true,  couleur:'#7C3AED', icon_name:'theater_comedy' },
      { nom:'Natation',  sigle:'NAT',  description:'Sport aquatique',              actif:true,  couleur:'#0091C2', icon_name:'pool' },
      { nom:'Musique',   sigle:'MUS',  description:'Éveil musical',                actif:false, couleur:'#D93025', icon_name:'music_note' },
    ],
    motifs: [
      { nom:'Maladie enfant', sigle:'MAL', facturable:false, justificatif:true, actif:true, couleur:'#D93025' },
      { nom:'Maladie parent', sigle:'MPAR', facturable:false, justificatif:true, actif:true, couleur:'#E88C00' },
      { nom:'Rendez-vous médical', sigle:'RDV', facturable:true, justificatif:true, actif:true, couleur:'#0091C2' },
      { nom:'Convenance personnelle', sigle:'CONV', facturable:true, justificatif:false, actif:true, couleur:'#7C3AED' },
      { nom:'Congés familiaux', sigle:'CONG', facturable:false, justificatif:false, actif:true, couleur:'#1A9E5C' },
    ],
    annulation: [
      { nom:'Demande du responsable', sigle:'RESP', type_entite:'Toutes', actif:true },
      { nom:'Paiement refusé', sigle:'PAIE', type_entite:'Factures', actif:true },
      { nom:'Place indisponible', sigle:'PLAC', type_entite:'Inscriptions', actif:true },
      { nom:'Demande erronée', sigle:'ERR', type_entite:'Demandes', actif:true },
    ],
    sortie: [
      { nom:'Départ famille', sigle:'DEPF', actif:true },
      { nom:'Changement d\'école', sigle:'ECO', actif:true },
      { nom:'Dépassement âge', sigle:'AGE', actif:true },
      { nom:'Fin de scolarité', sigle:'FIN', actif:true },
    ],
    niveaux: [
      { nom:'Petite section', sigle:'PS', cycle:'Maternelle', ordre:1, actif:true },
      { nom:'Moyenne section', sigle:'MS', cycle:'Maternelle', ordre:2, actif:true },
      { nom:'Grande section', sigle:'GS', cycle:'Maternelle', ordre:3, actif:true },
      { nom:'CP', sigle:'CP', cycle:'Élémentaire', ordre:4, actif:true },
      { nom:'CE1', sigle:'CE1', cycle:'Élémentaire', ordre:5, actif:true },
      { nom:'CE2', sigle:'CE2', cycle:'Élémentaire', ordre:6, actif:true },
      { nom:'CM1', sigle:'CM1', cycle:'Élémentaire', ordre:7, actif:true },
      { nom:'CM2', sigle:'CM2', cycle:'Élémentaire', ordre:8, actif:true },
      { nom:'6ème', sigle:'6E', cycle:'Collège', ordre:9, actif:true },
    ],
    dossier: [
      { nom:'Dossier famille standard', sigle:'STD', actif:true },
      { nom:'Dossier famille simplifié', sigle:'SIMP', actif:true },
      { nom:'Dossier crèche', sigle:'CRE', actif:true },
    ],
    dossier_org: [
      { nom:'CAF Val-de-Marne', sigle:'CAF94', type:'Financier', actif:true },
      { nom:'MSA', sigle:'MSA', type:'Financier', actif:true },
      { nom:'PMI', sigle:'PMI', type:'Médical', actif:true },
      { nom:'Assistante sociale', sigle:'AS', type:'Social', actif:true },
    ],
    protocole: [
      { nom:'Protocole asthme', sigle:'ASM', description:'Traitement en cas de crise', actif:true },
      { nom:'Protocole épilepsie', sigle:'EPI', description:'Conduite à tenir', actif:true },
      { nom:'PAI allergies alimentaires', sigle:'PAI', description:'Projet d\'accueil individualisé', actif:true },
    ],
    fonction: [
      { nom:'Directeur', sigle:'DIR', actif:true },
      { nom:'ATSEM', sigle:'ATSEM', actif:true },
      { nom:'Animateur', sigle:'ANIM', actif:true },
      { nom:'Éducateur jeunes enfants', sigle:'EJE', actif:true },
      { nom:'Cuisinier', sigle:'CUIS', actif:true },
      { nom:'Agent d\'entretien', sigle:'AGE', actif:true },
    ],
    lien: [
      { nom:'Père', sigle:'PERE', resp_legal:true, inverse:'Fils/Fille', actif:true },
      { nom:'Mère', sigle:'MERE', resp_legal:true, inverse:'Fils/Fille', actif:true },
      { nom:'Grand-père', sigle:'GPER', resp_legal:false, inverse:'Petit-enfant', actif:true },
      { nom:'Grand-mère', sigle:'GMER', resp_legal:false, inverse:'Petit-enfant', actif:true },
      { nom:'Tuteur légal', sigle:'TUT', resp_legal:true, inverse:'Pupille', actif:true },
      { nom:'Oncle', sigle:'ONC', resp_legal:false, inverse:'Neveu/Nièce', actif:true },
    ],
    politesse: [
      { nom:'Monsieur', sigle:'M.', actif:true },
      { nom:'Madame', sigle:'Mme', actif:true },
      { nom:'Mademoiselle', sigle:'Mlle', actif:false },
    ],
    typecontact: [
      { nom:'Contact urgence principal', sigle:'URG1', categorie:'Urgence', actif:true },
      { nom:'Contact urgence secondaire', sigle:'URG2', categorie:'Urgence', actif:true },
      { nom:'Raccompagnateur école', sigle:'RACC', categorie:'Raccompagnateur', actif:true },
      { nom:'Médecin traitant', sigle:'MED', categorie:'Médical', actif:true },
      { nom:'Contact administratif', sigle:'ADM', categorie:'Administratif', actif:true },
    ],
    consommation: [
      { nom:'Heure d\'accueil', sigle:'HEU', unite:'Heure', actif:true },
      { nom:'Demi-journée ALSH', sigle:'DJA', unite:'Demi-journée', actif:true },
      { nom:'Journée ALSH', sigle:'JA', unite:'Journée', actif:true },
      { nom:'Repas cantine', sigle:'CANT', unite:'Repas', actif:true },
      { nom:'Forfait mensuel', sigle:'FORF', unite:'Unité', actif:true },
    ],
    demande: [
      { nom:'Inscription ALSH', sigle:'ALSH', commission:false, actif:true },
      { nom:'Inscription crèche', sigle:'CRE', commission:true, actif:true },
      { nom:'Inscription cantine', sigle:'CANT', commission:false, actif:true },
      { nom:'Demande aide financière', sigle:'AID', commission:true, actif:true },
      { nom:'Inscription périscolaire', sigle:'PERI', commission:false, actif:true },
    ],
    mode: [
      { nom:'Accueil régulier', sigle:'REG', actif:true },
      { nom:'Accueil occasionnel', sigle:'OCC', actif:true },
      { nom:'Accueil d\'urgence', sigle:'URG', actif:true },
    ],
    typedoc: [
      { nom:'Livret de famille', sigle:'LIV', categorie:'Identité', conservation:60, obligatoire:true, actif:true },
      { nom:'Carte d\'identité', sigle:'CNI', categorie:'Identité', conservation:36, obligatoire:true, actif:true },
      { nom:'Carnet de vaccination', sigle:'VAC', categorie:'Médical', conservation:120, obligatoire:true, actif:true },
      { nom:'Avis d\'imposition', sigle:'AVIS', categorie:'Financier', conservation:24, obligatoire:true, actif:true },
      { nom:'Justificatif de domicile', sigle:'JUST', categorie:'Administratif', conservation:12, obligatoire:true, actif:true },
      { nom:'Certificat médical', sigle:'CMED', categorie:'Médical', conservation:60, obligatoire:false, actif:true },
    ],
    natagglo: [
      { nom:'Métropole', sigle:'MET', actif:true },
      { nom:'Communauté d\'agglomération', sigle:'CA', actif:true },
      { nom:'Communauté urbaine', sigle:'CU', actif:true },
      { nom:'Communauté de communes', sigle:'CC', actif:true },
    ],
    natorga: [
      { nom:'Mairie',                        sigle:'MAI',   actif:true },
      { nom:'Commune',                       sigle:'COM',   actif:true },
      { nom:'Crèche municipale',             sigle:'CRM',   actif:true },
      { nom:'École maternelle',              sigle:'EMA',   actif:true },
      { nom:'École élémentaire',             sigle:'EEL',   actif:true },
      { nom:'Collège',                       sigle:'COL',   actif:true },
      { nom:'Lycée',                         sigle:'LYC',   actif:true },
      { nom:'Communauté de communes',        sigle:'CDC',   actif:true },
      { nom:'Communauté d\'agglomération',   sigle:'CDA',   actif:true },
      { nom:'Centre communal d\'action sociale', sigle:'CCAS', actif:false },
    ],
    typevoie: [
      { nom:'Avenue',    sigle:'AV',   actif:true },
      { nom:'Boulevard', sigle:'BD',   actif:true },
      { nom:'Rue',       sigle:'RUE',  actif:true },
      { nom:'Place',     sigle:'PL',   actif:true },
      { nom:'Chemin',    sigle:'CH',   actif:true },
      { nom:'Impasse',   sigle:'IMP',  actif:true },
    ],
  };

  /* ───── Quotient data (special) ───── */
  const GRILLES = [
    { code:'A', nb:5, debut:'01/01/2026', fin:null, active:true },
    { code:'B', nb:4, debut:'01/01/2026', fin:null, active:true },
    { code:'C', nb:6, debut:'01/01/2025', fin:'31/12/2025', active:false },
  ];
  const TRANCHES = {
    A: [
      { nom:'QF1', sigle:'QF1', valeur:720,  debut:'01/01/2026', fin:null, actif:true },
      { nom:'QF2', sigle:'QF2', valeur:1200, debut:'01/01/2026', fin:null, actif:true },
      { nom:'QF3', sigle:'QF3', valeur:1800, debut:'01/01/2026', fin:null, actif:true },
      { nom:'QF4', sigle:'QF4', valeur:2600, debut:'01/01/2026', fin:null, actif:true },
      { nom:'QF5', sigle:'QF5', valeur:4500, debut:'01/01/2026', fin:null, actif:true },
    ],
    B: [
      { nom:'T1', sigle:'T1', valeur:900,  debut:'01/01/2026', fin:null, actif:true },
      { nom:'T2', sigle:'T2', valeur:1500, debut:'01/01/2026', fin:null, actif:true },
      { nom:'T3', sigle:'T3', valeur:2400, debut:'01/01/2026', fin:null, actif:true },
      { nom:'T4', sigle:'T4', valeur:3600, debut:'01/01/2026', fin:null, actif:true },
    ],
  };

  let currentRef = 'activites';
  let search = '';
  let refSearch = '';
  let showInactive = false;
  let selectedGrille = 'A';

  function render(el, params) {
    if (params?.ref && REFS.find(r => r.id === params.ref)) currentRef = params.ref;
    const ref = REFS.find(r => r.id === currentRef);

    el.innerHTML = `
      <div class="params-shell">
        <div class="params-header">
          <div class="params-header-icon">
            <span class="material-icons-outlined">list_alt</span>
          </div>
          <div>
            <h1>Paramétrage des Référentiels</h1>
            <div class="subtitle">Gestion des 20 référentiels métier utilisés par l'application</div>
          </div>
        </div>

        <div class="split-layout">
          <aside class="split-sidebar">
            <div class="side-list-search">
              <div class="input-wrap">
                <input class="input" placeholder="Rechercher un référentiel…"
                       value="${refSearch}" oninput="ReferentielsPage._setRefSearch(this.value)">
                <span class="input-icon material-icons-outlined">search</span>
              </div>
            </div>
            <div class="side-list">
              ${REFS.filter(r => !refSearch || r.label.toLowerCase().includes(refSearch.toLowerCase()))
                .sort((a, b) => a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' }))
                .map(r => `
                  <div class="side-list-item ${currentRef === r.id ? 'active' : ''}"
                       onclick="ReferentielsPage._pickRef('${r.id}')">
                    <span class="material-icons-outlined">${r.icon}</span>
                    <span>${r.label}</span>
                    <span class="sli-count">${r.count}</span>
                  </div>
                `).join('')}
            </div>
          </aside>

          <div class="split-content">
            ${ref.special === 'quotient' ? _renderQuotient() : _renderGeneric(ref)}
          </div>
        </div>
      </div>
    `;
  }

  /* ══════════════════════════════════════════════════════════
     GENERIC REFERENTIEL RENDERER
     ══════════════════════════════════════════════════════════ */
  function _renderGeneric(ref) {
    const rows = (ROWS[ref.id] || []).filter(r => {
      if (!showInactive && !r.actif) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!r.nom.toLowerCase().includes(s) && !(r.sigle || '').toLowerCase().includes(s)) return false;
      }
      return true;
    });

    const activeCount = (ROWS[ref.id] || []).filter(r => r.actif).length;

    return `
      <div class="bloc">
        <div class="bloc-header">
          <div class="bloc-icon">
            <span class="material-icons-outlined">${ref.icon}</span>
          </div>
          <div>
            <div class="bloc-title">${ref.label}</div>
            <div class="bloc-subtitle">${activeCount} valeur${activeCount > 1 ? 's' : ''} active${activeCount > 1 ? 's' : ''}</div>
          </div>
          <div style="margin-left:auto;">
            <button class="btn btn-primary btn-sm" onclick="ReferentielsPage._openForm('${ref.id}')">
              <span class="material-icons-outlined">add</span>Ajouter
            </button>
          </div>
        </div>

        <div class="filter-bar" style="margin:0;border:none;border-radius:0;border-bottom:1px solid var(--c-border);">
          <div class="input-wrap search-input">
            <input class="input" placeholder="Rechercher par nom ou sigle…"
                   value="${search}" oninput="ReferentielsPage._setSearch(this.value)">
            <span class="input-icon material-icons-outlined">search</span>
          </div>
          <label class="check-row" style="margin-left:auto;">
            <input type="checkbox" ${showInactive?'checked':''} onchange="ReferentielsPage._toggleInactive()">
            <span>Afficher les inactifs</span>
          </label>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Sigle</th>
              ${(ref.extraCols || []).map(c => `<th>${c.label}</th>`).join('')}
              <th>Statut</th>
              <th style="width:130px;text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => _genericRow(r, ref)).join('')}
          </tbody>
        </table>
        ${rows.length === 0 ? `
          <div class="empty-state">
            <span class="material-icons-outlined">inventory_2</span>
            <div class="title">Aucune valeur</div>
            <div class="desc">Utilisez le bouton « Ajouter » pour créer une première valeur.</div>
          </div>
        ` : ''}
      </div>

    `;
  }

  function _genericRow(r, ref) {
    const cols = (ref.extraCols || []).map(c => {
      const v = r[c.key];
      if (c.type === 'bool') {
        const tip = c.tooltip ? ` title="${c.tooltip}"` : '';
        return `<td${tip}>${v
          ? `<span class="material-icons-outlined" style="color:var(--c-success);font-size:18px;cursor:${c.tooltip?'help':'default'};"${tip}>check_circle</span>`
          : `<span class="material-icons-outlined" style="color:var(--c-text-4);font-size:18px;cursor:${c.tooltip?'help':'default'};"${tip}>remove_circle_outline</span>`}</td>`;
      }
      if (c.type === 'chip') {
        return `<td>${v ? `<span class="chip blue">${v}</span>` : '—'}</td>`;
      }
      if (c.type === 'num') return `<td>${v ?? '—'}</td>`;
      if (c.type === 'icon') {
        return `<td>${v
          ? `<span style="display:inline-flex;align-items:center;gap:6px;">
               <span class="material-icons-outlined" style="color:${r.couleur || 'var(--c-primary)'};font-size:20px;">${v}</span>
               <code style="font-size:10px;color:var(--c-text-4);">${v}</code>
             </span>`
          : '<span style="color:var(--c-text-4);">—</span>'}</td>`;
      }
      return `<td style="color:var(--c-text-3);">${v || '—'}</td>`;
    }).join('');
    const colorDot = r.couleur ? `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${r.couleur};margin-right:8px;vertical-align:middle;"></span>` : '';
    return `
      <tr style="${!r.actif ? 'opacity:.55;' : ''}">
        <td style="font-weight:500;color:var(--c-text-1);">${colorDot}${r.nom}</td>
        <td style="color:var(--c-text-3);font-family:monospace;font-size:11px;">${r.sigle || '—'}</td>
        ${cols}
        <td>${r.actif
          ? '<span class="chip green"><span class="material-icons-outlined">check_circle</span>Actif</span>'
          : '<span class="chip" style="background:#F0F2F7;color:#6B7280;">Inactif</span>'}</td>
        <td style="text-align:right;">
          <button class="icon-btn" title="Modifier" onclick="ReferentielsPage._openForm('${ref.id}','${r.nom}')">
            <span class="material-icons-outlined">edit</span>
          </button>
          <button class="icon-btn" title="${r.actif?'Désactiver':'Réactiver'}"
                  onclick="ReferentielsPage._toggleActif('${ref.id}','${r.nom}')">
            <span class="material-icons-outlined">${r.actif ? 'block' : 'refresh'}</span>
          </button>
          <button class="icon-btn danger" title="Supprimer"
                  onclick="ReferentielsPage._delete('${ref.id}','${r.nom}')">
            <span class="material-icons-outlined">delete</span>
          </button>
        </td>
      </tr>
    `;
  }

  /* ══════════════════════════════════════════════════════════
     QUOTIENT (two-level: grilles + tranches)
     ══════════════════════════════════════════════════════════ */
  function _renderQuotient() {
    return `
      <div class="bloc">
        <div class="bloc-header">
          <div class="bloc-icon"><span class="material-icons-outlined">calculate</span></div>
          <div>
            <div class="bloc-title">Grilles de quotient</div>
            <div class="bloc-subtitle">Chaque grille regroupe plusieurs tranches de quotient familial. Pour créer une nouvelle grille, ajoutez une tranche avec une nouvelle lettre.</div>
          </div>
        </div>
        <div style="padding:16px;">
          <div class="grille-grid">
            ${GRILLES.map(g => `
              <div class="grille-card ${selectedGrille === g.code ? 'active' : ''}"
                   onclick="ReferentielsPage._pickGrille('${g.code}')">
                <div class="grille-badge">${g.code}</div>
                <div class="grille-name">Grille ${g.code}</div>
                <div class="grille-meta">${g.nb} tranche${g.nb > 1 ? 's' : ''}</div>
                <div class="grille-meta">Depuis le ${g.debut}</div>
                <div style="margin-top:8px;">
                  ${g.active
                    ? '<span class="chip green" style="font-size:10px;">En vigueur</span>'
                    : '<span class="chip" style="background:#F0F2F7;color:#6B7280;font-size:10px;">Archivée</span>'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="bloc" style="margin-top:14px;">
        <div class="bloc-header">
          <div class="bloc-icon purple"><span class="material-icons-outlined">format_list_numbered</span></div>
          <div>
            <div class="bloc-title">Tranches de la grille ${selectedGrille}</div>
            <div class="bloc-subtitle">Les tranches ne doivent pas se chevaucher sur la période</div>
          </div>
          <div style="margin-left:auto;">
            <button class="btn btn-primary btn-sm" onclick="ReferentielsPage._openTrancheForm()">
              <span class="material-icons-outlined">add</span>Ajouter une tranche
            </button>
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Sigle</th>
              <th>Valeur</th>
              <th>Début validité</th>
              <th>Fin validité</th>
              <th>Statut</th>
              <th style="width:130px;text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${(TRANCHES[selectedGrille] || []).map(t => `
              <tr>
                <td style="font-weight:500;color:var(--c-text-1);">${t.nom}</td>
                <td style="color:var(--c-text-3);font-family:monospace;font-size:11px;">${t.sigle}</td>
                <td style="font-weight:600;color:var(--c-primary);">${t.valeur.toLocaleString('fr-FR')}</td>
                <td>${t.debut}</td>
                <td>${t.fin || '—'}</td>
                <td><span class="chip green"><span class="material-icons-outlined">check_circle</span>Actif</span></td>
                <td style="text-align:right;">
                  <button class="icon-btn"><span class="material-icons-outlined">edit</span></button>
                  <button class="icon-btn"><span class="material-icons-outlined">block</span></button>
                  <button class="icon-btn danger"><span class="material-icons-outlined">delete</span></button>
                </td>
              </tr>
            `).join('')}
            ${!TRANCHES[selectedGrille] || TRANCHES[selectedGrille].length === 0 ? `
              <tr><td colspan="7">
                <div class="empty-state" style="padding:24px;">
                  <div class="desc">Cette grille n'a pas encore de tranche.</div>
                </div>
              </td></tr>
            ` : ''}
          </tbody>
        </table>
      </div>
    `;
  }

  /* ══════════════════════════════════════════════════════════
     FORMS
     ══════════════════════════════════════════════════════════ */
  function _openForm(refId, nom) {
    const ref = REFS.find(r => r.id === refId);
    const row = nom ? (ROWS[refId] || []).find(r => r.nom === nom) : {};
    const title = nom ? `Modifier — ${nom}` : `Nouvelle valeur — ${ref.label}`;

    let body = `
      <div class="form-grid fg-1" style="padding:0;" data-ref-id="${ref.id}" data-editing-name="${row?.nom || ''}">
        <div class="form-field">
          <label class="req">Nom</label>
          <input class="input" id="ref-form-nom" value="${row?.nom || ''}" placeholder="Saisir le nom"
                 oninput="ReferentielsPage._validateField(this, 'nom')">
          <div class="hint" id="hint-nom">Nom unique · obligatoire</div>
        </div>
        <div class="form-field">
          <label>Sigle</label>
          <input class="input" id="ref-form-sigle" value="${row?.sigle || ''}" placeholder="Ex : ABC" maxlength="20"
                 oninput="ReferentielsPage._validateField(this, 'sigle')">
          <div class="hint" id="hint-sigle">Code court optionnel · max 20 caractères · unique si renseigné</div>
        </div>
    `;

    (ref.extraFields || []).forEach(f => {
      const v = row?.[f.key];
      if (f.type === 'textarea') {
        body += `<div class="form-field">
          <label>${f.label}</label>
          <textarea class="input">${v || ''}</textarea>
        </div>`;
      } else if (f.type === 'select') {
        body += `<div class="form-field">
          <label>${f.label}</label>
          <select class="input">
            ${f.options.map(o => `<option ${v===o?'selected':''}>${o}</option>`).join('')}
          </select>
        </div>`;
      } else if (f.type === 'check') {
        body += `<label class="check-row" style="margin-top:4px;">
          <input type="checkbox" ${v || f.default ? 'checked' : ''}>
          <span>${f.label}</span>
        </label>`;
      } else if (f.type === 'number') {
        body += `<div class="form-field">
          <label>${f.label}</label>
          <input class="input" type="number" value="${v || ''}">
        </div>`;
      } else if (f.type === 'color') {
        body += `<div class="form-field">
          <label>${f.label}</label>
          <div style="display:flex;gap:8px;align-items:center;">
            <input type="color" value="${v || '#0D5BBE'}" style="width:42px;height:34px;border:1.5px solid var(--c-border);border-radius:var(--r-sm);cursor:pointer;">
            <input class="input" value="${v || '#0D5BBE'}" style="flex:1;">
          </div>
        </div>`;
      } else if (f.type === 'icon_picker') {
        const suggested = ['sports_soccer','sports_tennis','sports_basketball','pool','music_note','theater_comedy','palette','directions_run','school','restaurant','computer','library_books','extension','celebration','hiking','nature_people'];
        body += `<div class="form-field">
          <label>${f.label}</label>
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
            <div id="icon-preview" style="width:42px;height:42px;border:1.5px solid var(--c-border);border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;background:var(--c-bg);">
              <span class="material-icons-outlined" style="font-size:22px;color:var(--c-primary);" id="icon-preview-span">${v || 'category'}</span>
            </div>
            <input class="input" value="${v || ''}" placeholder="ex: sports_soccer" style="flex:1;"
                   oninput="document.getElementById('icon-preview-span').textContent=this.value||'category'">
          </div>
          <div style="font-size:11px;color:var(--c-text-3);margin-bottom:6px;">Icônes suggérées (cliquer pour choisir) :</div>
          <div style="display:flex;gap:4px;flex-wrap:wrap;padding:8px;background:var(--c-bg);border-radius:var(--r-sm);border:1px solid var(--c-border-light);">
            ${suggested.map(ic => `
              <button type="button" title="${ic}"
                      style="width:34px;height:34px;border:1.5px solid var(--c-border);background:white;border-radius:var(--r-sm);cursor:pointer;display:flex;align-items:center;justify-content:center;${v===ic?'border-color:var(--c-primary);background:var(--c-primary-light);':''}"
                      onclick="var inp=this.parentElement.parentElement.querySelector('input.input'); inp.value='${ic}'; document.getElementById('icon-preview-span').textContent='${ic}';this.parentElement.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--c-border)';b.style.background='white';});this.style.borderColor='var(--c-primary)';this.style.background='var(--c-primary-light)';">
                <span class="material-icons-outlined" style="font-size:18px;color:var(--c-text-2);">${ic}</span>
              </button>
            `).join('')}
          </div>
          <div class="hint">Nom technique de l'icône <a href="https://fonts.google.com/icons" target="_blank" style="color:var(--c-primary);text-decoration:none;">Material Symbols</a> (ex : <code>sports_soccer</code>)</div>
        </div>`;
      }
    });

    body += '</div>';

    Drawer.open({
      title,
      icon: nom ? 'edit' : 'add',
      body,
      footer: `
        <button class="btn btn-ghost" onclick="Drawer.close()">Annuler</button>
        <button class="btn btn-primary" onclick="ReferentielsPage._submit()">Enregistrer</button>
      `
    });
  }

  function _openTrancheForm() {
    Drawer.open({
      title: `Nouvelle tranche — Grille ${selectedGrille}`,
      icon: 'add',
      body: `
        <div class="form-grid fg-2" style="padding:0;">
          <div class="form-field">
            <label class="req">Nom</label>
            <input class="input" placeholder="QF6">
          </div>
          <div class="form-field">
            <label>Sigle</label>
            <input class="input" placeholder="QF6">
          </div>
          <div class="form-field">
            <label class="req">Grille</label>
            <input class="input" maxlength="1" value="${selectedGrille}"
                   style="text-transform:uppercase;font-weight:600;text-align:center;letter-spacing:2px;max-width:80px;"
                   oninput="this.value=this.value.toUpperCase().replace(/[^A-Z]/g,'')"
                   placeholder="A">
            <div class="hint">Une lettre A–Z. Saisir une nouvelle lettre crée une nouvelle grille.</div>
          </div>
          <div class="form-field">
            <label class="req">Valeur</label>
            <input class="input" type="number" placeholder="6000">
          </div>
          <div class="form-field">
            <label class="req">Date de début</label>
            <input class="input" type="date" value="2026-01-01">
          </div>
          <div class="form-field">
            <label>Date de fin</label>
            <input class="input" type="date">
          </div>
        </div>
        <div class="banner warn" style="margin-top:14px;">
          <span class="material-icons-outlined">warning</span>
          <span>Les tranches de cette grille ne doivent pas se chevaucher sur la même période.</span>
        </div>
      `,
      footer: `
        <button class="btn btn-ghost" onclick="Drawer.close()">Annuler</button>
        <button class="btn btn-primary" onclick="ReferentielsPage._submit()">Enregistrer</button>
      `
    });
  }

  /* ══════════════════════════════════════════════════════════
     ACTIONS
     ══════════════════════════════════════════════════════════ */
  function _validateField(el, field) {
    const wrap = el.closest('.form-grid');
    if (!wrap) return true;
    const refId = wrap.dataset.refId;
    const editingName = wrap.dataset.editingName || '';
    const val = (el.value || '').trim();
    const hint = document.getElementById(`hint-${field}`);

    // Required nom
    if (field === 'nom' && !val) {
      el.classList.add('error'); el.classList.remove('valid');
      if (hint) { hint.className = 'hint error'; hint.textContent = 'Le nom est obligatoire'; }
      return false;
    }

    // Empty sigle is OK
    if (field === 'sigle' && !val) {
      el.classList.remove('error', 'valid');
      if (hint) { hint.className = 'hint'; hint.textContent = 'Code court optionnel · max 20 caractères · unique si renseigné'; }
      return true;
    }

    // Uniqueness check (case-insensitive, skip self when editing)
    const rows = ROWS[refId] || [];
    const duplicate = rows.find(r =>
      (r[field] || '').toLowerCase() === val.toLowerCase() &&
      r.nom !== editingName
    );

    if (duplicate) {
      el.classList.add('error'); el.classList.remove('valid');
      if (hint) {
        hint.className = 'hint error';
        hint.textContent = field === 'nom' ? 'Ce nom existe déjà' : 'Ce sigle existe déjà';
      }
      return false;
    }

    el.classList.remove('error'); el.classList.add('valid');
    if (hint) {
      hint.className = 'hint success';
      hint.textContent = '✓ Disponible';
    }
    return true;
  }

  function _submit() {
    const nomInput = document.getElementById('ref-form-nom');
    const sigleInput = document.getElementById('ref-form-sigle');
    if (nomInput && sigleInput) {
      const nomOk = _validateField(nomInput, 'nom');
      const sigleOk = _validateField(sigleInput, 'sigle');
      if (!nomOk || !sigleOk) {
        Utils.toast('Corrigez les erreurs avant d\'enregistrer', 'error');
        return;
      }
    }
    Drawer.close();
    Utils.toast('Valeur enregistrée', 'success');
    render(document.getElementById('router-outlet'));
  }
  function _toggleActif(refId, nom) {
    const r = (ROWS[refId] || []).find(x => x.nom === nom);
    if (!r) return;
    Modals.confirm({
      title: r.actif ? 'Désactiver cette valeur ?' : 'Réactiver cette valeur ?',
      message: r.actif
        ? `La valeur « ${nom} » ne sera plus proposée dans les formulaires de création. Elle restera visible sur les enregistrements existants.`
        : `La valeur « ${nom} » sera de nouveau proposée dans les formulaires de création.`,
      confirmText: r.actif ? 'Désactiver' : 'Réactiver',
      onConfirm: () => {
        r.actif = !r.actif;
        render(document.getElementById('router-outlet'));
        Utils.toast(r.actif ? 'Valeur réactivée' : 'Valeur désactivée', 'info');
      }
    });
  }
  function _delete(refId, nom) {
    Modals.confirm({
      title: 'Supprimer cette valeur ?',
      message: `La valeur « ${nom} » sera supprimée de manière irréversible. Si elle est utilisée par des enregistrements existants, la suppression échouera.`,
      confirmText: 'Supprimer',
      danger: true,
      onConfirm: () => {
        const arr = ROWS[refId];
        if (arr) ROWS[refId] = arr.filter(x => x.nom !== nom);
        render(document.getElementById('router-outlet'));
        Utils.toast('Valeur supprimée', 'success');
      }
    });
  }
  function _pickRef(id) {
    currentRef = id;
    search = '';
    showInactive = false;
    location.hash = `#/params/referentiels/${id}`;
  }
  function _setRefSearch(v) { refSearch = v; render(document.getElementById('router-outlet')); }
  function _setSearch(v)    { search = v; render(document.getElementById('router-outlet')); }
  function _toggleInactive(){ showInactive = !showInactive; render(document.getElementById('router-outlet')); }
  function _pickGrille(c)   { selectedGrille = c; render(document.getElementById('router-outlet')); }

  return {
    render,
    _openForm, _openTrancheForm, _submit, _toggleActif, _delete,
    _pickRef, _setRefSearch, _setSearch, _toggleInactive, _pickGrille,
    _validateField,
  };
})();
window.ReferentielsPage = ReferentielsPage;
