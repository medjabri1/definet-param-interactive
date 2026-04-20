/* ═══════════════════════════════════════════════════════════════
   RÉGLEMENTATION — Paramètres réglementaires avec historisation
   ═══════════════════════════════════════════════════════════════ */

const ReglementationPage = (() => {

  const CATEGORIE_COLORS = {
    CAF:     { bg: '#EBF2FF', fg: '#0D5BBE' },
    FISCAL:  { bg: '#F0FDFA', fg: '#0D9488' },
    SOCIAL:  { bg: '#EDE9FD', fg: '#7C3AED' },
    ACCUEIL: { bg: '#FEF3C7', fg: '#D97706' },
  };

  const PARAMS = [
    { id:1, code:'PLAFOND_CAF',     nom:'Plafond mensuel ressources CAF',       valeur:'4 520,00 €', type:'DECIMAL', cat:'CAF',     debut:'01/01/2026', fin:null, source:'Circulaire CNAF 2026-01', statut:'current' },
    { id:2, code:'TAUX_PSU',        nom:'Taux d\'effort PSU',                   valeur:'0,0611',     type:'DECIMAL', cat:'CAF',     debut:'01/01/2026', fin:null, source:'Barème PSU 2026',        statut:'current' },
    { id:3, code:'SMIC_HORAIRE',    nom:'SMIC horaire brut',                    valeur:'11,88 €',    type:'DECIMAL', cat:'SOCIAL',  debut:'01/01/2026', fin:null, source:'Décret n° 2025-1542',     statut:'current' },
    { id:4, code:'QF_PLANCHER',     nom:'Plancher quotient familial',           valeur:'720',        type:'INTEGER', cat:'CAF',     debut:'01/01/2026', fin:null, source:'Circulaire CNAF 2026-02', statut:'current' },
    { id:5, code:'QF_PLAFOND',      nom:'Plafond quotient familial',            valeur:'4 500',      type:'INTEGER', cat:'CAF',     debut:'01/01/2026', fin:null, source:'Circulaire CNAF 2026-02', statut:'current' },
    { id:6, code:'MIN_FACTURATION', nom:'Montant min. de facturation',          valeur:'2,50 €',     type:'DECIMAL', cat:'FISCAL',  debut:'01/01/2026', fin:null, source:'Délibération du conseil', statut:'current' },
    { id:7, code:'MAJOR_ABSENCE',   nom:'Majoration absence non justifiée',     valeur:'Oui',        type:'BOOLEAN', cat:'ACCUEIL', debut:'01/09/2025', fin:null, source:'Règlement intérieur 2025-2026', statut:'current' },
    { id:8, code:'PLAFOND_CAF',     nom:'Plafond mensuel ressources CAF',       valeur:'4 420,00 €', type:'DECIMAL', cat:'CAF',     debut:'01/01/2025', fin:'31/12/2025', source:'Circulaire CNAF 2025-01', statut:'expired' },
    { id:9, code:'TAUX_PSU',        nom:'Taux d\'effort PSU',                   valeur:'0,0608',     type:'DECIMAL', cat:'CAF',     debut:'01/01/2025', fin:'31/12/2025', source:'Barème PSU 2025',        statut:'expired' },
    { id:10, code:'BONUS_INCLUSION', nom:'Bonus inclusion handicap',            valeur:'1 400,00 €', type:'DECIMAL', cat:'ACCUEIL', debut:'01/01/2024', fin:'31/12/2025', source:'CNAF 2024-04',            statut:'inactive' },
  ];

  let filterCat = 'ALL';
  let showInactive = false;
  let search = '';

  function render(el) {
    el.innerHTML = `
      <div class="params-shell">
        <div class="params-header">
          <div class="params-header-icon">
            <span class="material-icons-outlined">policy</span>
          </div>
          <div style="flex:1;">
            <h1>Réglementation</h1>
            <div class="subtitle">Paramètres réglementaires nationaux avec historisation par période</div>
          </div>
          <button class="btn btn-primary" onclick="ReglementationPage._openCreate()">
            <span class="material-icons-outlined">add</span>Nouveau paramètre
          </button>
        </div>

        <div class="filter-bar">
          <div class="input-wrap search-input">
            <input class="input" placeholder="Rechercher par nom ou code…"
                   value="${search}" oninput="ReglementationPage._setSearch(this.value)">
            <span class="input-icon material-icons-outlined">search</span>
          </div>
          <select class="input select-filter" onchange="ReglementationPage._setCat(this.value)">
            <option value="ALL" ${filterCat==='ALL'?'selected':''}>Toutes les catégories</option>
            <option value="CAF" ${filterCat==='CAF'?'selected':''}>CAF</option>
            <option value="FISCAL" ${filterCat==='FISCAL'?'selected':''}>Fiscal</option>
            <option value="SOCIAL" ${filterCat==='SOCIAL'?'selected':''}>Social</option>
            <option value="ACCUEIL" ${filterCat==='ACCUEIL'?'selected':''}>Accueil</option>
          </select>
          <label class="check-row" style="margin-left:auto;">
            <input type="checkbox" ${showInactive?'checked':''} onchange="ReglementationPage._toggleInactive()">
            <span>Afficher les inactifs</span>
          </label>
        </div>

        <div class="bloc">
          <table class="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Nom</th>
                <th>Valeur</th>
                <th>Catégorie</th>
                <th>Période</th>
                <th>Statut</th>
                <th style="width:140px;text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${_filtered().map(p => _row(p)).join('')}
            </tbody>
          </table>
          ${_filtered().length === 0 ? `
            <div class="empty-state">
              <span class="material-icons-outlined">inventory_2</span>
              <div class="title">Aucun paramètre ne correspond à la recherche</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  function _filtered() {
    return PARAMS.filter(p => {
      if (!showInactive && p.statut === 'inactive') return false;
      if (filterCat !== 'ALL' && p.cat !== filterCat) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!p.nom.toLowerCase().includes(s) && !p.code.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }

  function _row(p) {
    const col = CATEGORIE_COLORS[p.cat];
    const periode = p.fin
      ? `Du ${p.debut} au ${p.fin}`
      : `Depuis le ${p.debut}`;
    const statutChip = p.statut === 'current'
      ? '<span class="chip green"><span class="material-icons-outlined">check_circle</span>En vigueur</span>'
      : p.statut === 'expired'
      ? '<span class="chip" style="background:#F0F2F7;color:#6B7280;"><span class="material-icons-outlined">schedule</span>Expiré</span>'
      : '<span class="chip" style="background:#FEF3C7;color:#D97706;"><span class="material-icons-outlined">block</span>Inactif</span>';
    return `
      <tr style="${p.statut==='inactive'?'opacity:.55;':''}">
        <td style="font-family:monospace;font-size:11px;color:var(--c-text-3);">${p.code}</td>
        <td style="font-weight:500;color:var(--c-text-1);">${p.nom}</td>
        <td style="font-weight:600;color:var(--c-text-1);">${p.valeur}</td>
        <td><span class="chip" style="background:${col.bg};color:${col.fg};">${p.cat}</span></td>
        <td>${periode}</td>
        <td>${statutChip}</td>
        <td style="text-align:right;">
          <button class="icon-btn" title="Modifier" onclick="ReglementationPage._openEdit(${p.id})">
            <span class="material-icons-outlined">edit</span>
          </button>
          <button class="icon-btn" title="Historique" onclick="ReglementationPage._openHistory('${p.code}','${p.nom}')">
            <span class="material-icons-outlined">history</span>
          </button>
          <button class="icon-btn danger" title="Désactiver" onclick="ReglementationPage._disable(${p.id})">
            <span class="material-icons-outlined">block</span>
          </button>
        </td>
      </tr>
    `;
  }

  function _formBody(p) {
    const initialType = p?.type || 'DECIMAL';
    const cleanVal = (p?.valeur || '').replace(/[€\s]/g,'').trim();
    return `
      <div class="form-grid fg-2" style="padding:0;">
        <div class="form-field">
          <label class="req">Code</label>
          <input class="input" value="${p?.code || ''}" ${p?'disabled':''} placeholder="PLAFOND_CAF">
          <div class="hint">Identifiant technique unique · immutable après création</div>
        </div>
        <div class="form-field">
          <label class="req">Nom</label>
          <input class="input" value="${p?.nom || ''}" placeholder="Plafond mensuel ressources CAF">
        </div>
        <div class="form-field">
          <label class="req">Type de valeur</label>
          <select class="input" id="regl-type-select" onchange="ReglementationPage._updateValeurField(this.value)">
            <option value="DECIMAL"  ${initialType==='DECIMAL' ?'selected':''}>Décimal</option>
            <option value="INTEGER"  ${initialType==='INTEGER' ?'selected':''}>Entier</option>
            <option value="TEXT"     ${initialType==='TEXT'    ?'selected':''}>Texte</option>
            <option value="BOOLEAN"  ${initialType==='BOOLEAN' ?'selected':''}>Oui / Non</option>
            <option value="DATE"     ${initialType==='DATE'    ?'selected':''}>Date</option>
          </select>
        </div>
        <div class="form-field">
          <label class="req">Catégorie</label>
          <select class="input">
            <option>CAF</option>
            <option>Fiscal</option>
            <option>Social</option>
            <option>Accueil</option>
          </select>
        </div>
        <div class="form-field" id="regl-valeur-container">
          <label class="req">Valeur</label>
          ${_valeurInputHTML(initialType, cleanVal)}
        </div>
        <div class="form-field">
          <label>Source</label>
          <input class="input" value="${p?.source || ''}" placeholder="Circulaire CNAF 2026-01">
        </div>
        <div class="form-field">
          <label class="req">Date de début</label>
          <input class="input" type="date" value="2026-01-01">
        </div>
        <div class="form-field">
          <label>Date de fin</label>
          <input class="input" type="date">
          <div class="hint">Optionnelle · postérieure au début</div>
        </div>
      </div>
      ${p?.statut === 'current' ? `
        <div class="banner info" style="margin-top:14px;">
          <span class="material-icons-outlined">info</span>
          <span>Ce paramètre est en vigueur. La modification créera un nouvel enregistrement et clôturera automatiquement l'ancien.</span>
        </div>
      ` : ''}
    `;
  }

  function _valeurInputHTML(type, value) {
    const v = value || '';
    switch (type) {
      case 'DECIMAL': return `<input class="input" type="number" step="0.01" value="${v}" placeholder="4520.00"><div class="hint">Nombre décimal (2 décimales)</div>`;
      case 'INTEGER': return `<input class="input" type="number" step="1" value="${v}" placeholder="720"><div class="hint">Nombre entier</div>`;
      case 'TEXT':    return `<input class="input" value="${v}" placeholder="Texte libre"><div class="hint">Chaîne de caractères</div>`;
      case 'BOOLEAN': return `
        <label class="check-row" style="margin-top:8px;border:1.5px solid var(--c-border);border-radius:var(--r-sm);padding:0 10px;">
          <input type="checkbox" ${v==='Oui'||v==='true'||v===true?'checked':''}>
          <span>Activé</span>
        </label>
        <div class="hint">Valeur booléenne (oui/non)</div>`;
      case 'DATE':    return `<input class="input" type="date" value="${v}"><div class="hint">Date au format JJ/MM/AAAA</div>`;
      default:        return `<input class="input" value="${v}">`;
    }
  }

  function _updateValeurField(type) {
    const container = document.getElementById('regl-valeur-container');
    if (!container) return;
    container.innerHTML = `<label class="req">Valeur</label>` + _valeurInputHTML(type, '');
  }

  function _openCreate() {
    Drawer.open({
      title: 'Nouveau paramètre réglementaire',
      icon: 'add',
      body: _formBody(null),
      footer: `
        <button class="btn btn-ghost" onclick="Drawer.close()">Annuler</button>
        <button class="btn btn-primary" onclick="ReglementationPage._submit()">Enregistrer</button>
      `,
    });
  }

  function _openEdit(id) {
    const p = PARAMS.find(x => x.id === id);
    Drawer.open({
      title: `Modifier — ${p.nom}`,
      icon: 'edit',
      body: _formBody(p),
      footer: `
        <button class="btn btn-ghost" onclick="Drawer.close()">Annuler</button>
        <button class="btn btn-primary" onclick="ReglementationPage._submit()">Enregistrer</button>
      `,
    });
  }

  function _openHistory(code, nom) {
    const entries = PARAMS.filter(p => p.code === code).sort((a,b) =>
      (a.statut === 'current' ? -1 : 1) - (b.statut === 'current' ? -1 : 1)
    );
    const body = entries.length > 0
      ? entries.map(e => `
          <div class="history-item ${e.statut}">
            <div class="history-value">${e.valeur}</div>
            <div class="history-period">${e.fin ? `Du ${e.debut} au ${e.fin}` : `Depuis le ${e.debut}`}</div>
            ${e.source ? `<div class="history-source"><span class="material-icons-outlined" style="font-size:12px;vertical-align:middle;">description</span> ${e.source}</div>` : ''}
            <div class="history-meta">Créé le 05/01/2026 par Sophie LEFEBVRE</div>
          </div>
        `).join('')
      : '<div class="empty-state"><div class="desc">Aucun historique disponible.</div></div>';
    Drawer.open({
      title: `Historique — ${nom}`,
      icon: 'history',
      iconClass: 'purple',
      body,
    });
  }

  function _disable(id) {
    const p = PARAMS.find(x => x.id === id);
    Modals.confirm({
      title: 'Désactiver ce paramètre ?',
      message: `Le paramètre « ${p.nom} » ne sera plus en vigueur. Les calculs tarifaires utiliseront la dernière valeur active. Cette action est réversible.`,
      confirmText: 'Désactiver',
      onConfirm: () => {
        p.statut = 'inactive';
        render(document.getElementById('router-outlet'));
        Utils.toast('Paramètre désactivé', 'info');
      }
    });
  }

  function _submit() {
    Drawer.close();
    Utils.toast('Paramètre enregistré', 'success');
  }

  function _setSearch(v) { search = v; render(document.getElementById('router-outlet')); }
  function _setCat(v)    { filterCat = v; render(document.getElementById('router-outlet')); }
  function _toggleInactive() { showInactive = !showInactive; render(document.getElementById('router-outlet')); }

  return { render, _openCreate, _openEdit, _openHistory, _disable, _submit, _setSearch, _setCat, _toggleInactive, _updateValeurField };
})();
window.ReglementationPage = ReglementationPage;
