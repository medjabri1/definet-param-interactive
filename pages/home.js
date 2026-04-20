/* ═══════════════════════════════════════════════════════════════
   HOME — Entry point of the parametrage module
   ═══════════════════════════════════════════════════════════════ */

const HomePage = (() => {

  const ACTIVE_MODULES = [
    {
      id: 'organisation', icon: 'business',
      title: 'Paramétrage de l\'Organisation',
      desc: 'Fiche d\'identité de la collectivité : raison sociale, SIRET/SIREN, coordonnées, responsable.',
      route: '/params/organisation',
    },
    {
      id: 'etablissements', icon: 'apartment',
      title: 'Paramétrage des Établissements',
      desc: 'Fiche détaillée des organismes, capacités par section, arborescence des services, référentiels géographiques.',
      route: '/params/etablissements',
    },
    {
      id: 'referentiels', icon: 'list_alt',
      title: 'Paramétrage des Référentiels',
      desc: 'Gestion des 20 référentiels métier : motifs, niveaux, quotients, types de document, natures d\'organisme, types de voie, etc.',
      route: '/params/referentiels',
    },
    {
      id: 'reglementation', icon: 'policy',
      title: 'Réglementation',
      desc: 'Paramètres réglementaires nationaux (CAF, PSU, fiscal) avec historisation des valeurs par période.',
      route: '/params/reglementation',
    },
  ];

  const DISABLED_MODULES = [
    { icon: 'receipt_long',    title: 'Régie facturation' },
    { icon: 'payments',        title: 'Régie encaissement' },
    { icon: 'category',        title: 'Prestations' },
    { icon: 'sell',            title: 'Tarifs' },
    { icon: 'calendar_today',  title: 'Calendriers' },
    { icon: 'manage_accounts', title: 'Profils' },
    { icon: 'person',          title: 'Utilisateurs' },
    { icon: 'tablet',          title: 'Tablettes' },
    { icon: 'brush',           title: 'Perso. éditions' },
    { icon: 'palette',         title: 'Perso. graphique' },
    { icon: 'archive',         title: 'Archivage' },
    { icon: 'system_update',   title: 'Mise à jour logiciel' },
  ];

  function render(el) {
    el.innerHTML = `
      <div class="params-shell">
        <div class="params-header">
          <div class="params-header-icon">
            <span class="material-icons-outlined">settings</span>
          </div>
          <div>
            <h1>Paramétrage &amp; administration</h1>
            <div class="subtitle">Configuration des données de référence utilisées dans DeFinet</div>
          </div>
        </div>

        <div class="banner info">
          <span class="material-icons-outlined">info</span>
          <span>Cette maquette interactive présente les 4 modules du périmètre actuel. Les autres modules listés ci-dessous sont prévus pour des cartes ultérieures.</span>
        </div>

        <h2 style="font-size:14px;font-weight:600;color:var(--c-text-3);text-transform:uppercase;letter-spacing:.04em;margin:22px 0 10px 0;">Modules actifs</h2>
        <div class="entry-grid">
          ${ACTIVE_MODULES.map(m => `
            <div class="entry-card" onclick="Router.go('${m.route}')">
              <div class="entry-badge ready">Disponible</div>
              <div class="entry-icon">
                <span class="material-icons-outlined">${m.icon}</span>
              </div>
              <div class="entry-title">${m.title}</div>
              <div class="entry-sub">${m.desc}</div>
            </div>
          `).join('')}
        </div>

        <h2 style="font-size:14px;font-weight:600;color:var(--c-text-3);text-transform:uppercase;letter-spacing:.04em;margin:28px 0 10px 0;">Hors périmètre — prévus ultérieurement</h2>
        <div class="entry-grid">
          ${DISABLED_MODULES.map(m => `
            <div class="entry-card disabled" title="Bientôt disponible">
              <div class="entry-badge">À venir</div>
              <div class="entry-icon">
                <span class="material-icons-outlined">${m.icon}</span>
              </div>
              <div class="entry-title">${m.title}</div>
              <div class="entry-sub">Module non inclus dans le périmètre actuel.</div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top:36px;padding:18px;background:var(--c-surface);border:1px solid var(--c-border);border-radius:var(--r-lg);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <span class="material-icons-outlined" style="color:var(--c-primary);">insights</span>
            <div style="font-size:14px;font-weight:600;color:var(--c-text-1);">Synthèse du périmètre</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;">
            <div class="kv-row" style="flex-direction:column;align-items:flex-start;border:1px solid var(--c-border-light);border-radius:var(--r-sm);padding:10px;">
              <span class="kv-label">Tables à créer</span>
              <span class="kv-val" style="font-size:18px;">2</span>
            </div>
            <div class="kv-row" style="flex-direction:column;align-items:flex-start;border:1px solid var(--c-border-light);border-radius:var(--r-sm);padding:10px;">
              <span class="kv-label">Tables à modifier</span>
              <span class="kv-val" style="font-size:18px;">14</span>
            </div>
            <div class="kv-row" style="flex-direction:column;align-items:flex-start;border:1px solid var(--c-border-light);border-radius:var(--r-sm);padding:10px;">
              <span class="kv-label">Référentiels couverts</span>
              <span class="kv-val" style="font-size:18px;">20</span>
            </div>
            <div class="kv-row" style="flex-direction:column;align-items:flex-start;border:1px solid var(--c-border-light);border-radius:var(--r-sm);padding:10px;">
              <span class="kv-label">Patterns RPC backend</span>
              <span class="kv-val" style="font-size:18px;">~130</span>
            </div>
            <div class="kv-row" style="flex-direction:column;align-items:flex-start;border:1px solid var(--c-border-light);border-radius:var(--r-sm);padding:10px;">
              <span class="kv-label">Routes Gateway HTTP</span>
              <span class="kv-val" style="font-size:18px;">~60</span>
            </div>
            <div class="kv-row" style="flex-direction:column;align-items:flex-start;border:1px solid var(--c-border-light);border-radius:var(--r-sm);padding:10px;">
              <span class="kv-label">Composants Angular</span>
              <span class="kv-val" style="font-size:18px;">~15</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return { render };
})();
window.HomePage = HomePage;
