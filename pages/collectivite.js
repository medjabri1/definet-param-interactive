/* ═══════════════════════════════════════════════════════════════
   PARAMÉTRAGE DE L'ORGANISATION — Fiche identité collectivité
   ═══════════════════════════════════════════════════════════════ */

const CollectivitePage = (() => {

  const DATA = {
    raison_sociale:     'Ville de Saint-Maur-des-Fossés',
    sigle:              'VSMF',
    siret:              '21940067800019',
    siren:              '219400678',
    code_ape:           '8411Z',
    nature_juridique:   'Commune',
    telephone:          '01 45 11 65 00',
    email:              'contact@saint-maur.com',
    site_web:           'https://www.saint-maur.com',
    nom_responsable:    'Marie DUPONT',
    fonction_responsable: 'Directrice Générale des Services',
    adresse:            'Place Charles de Gaulle, 94100 Saint-Maur-des-Fossés',
    last_modified:      '15/04/2026 à 14h32',
    last_modified_by:   'Sophie LEFEBVRE',
  };

  let editMode = false;

  function render(el) {
    el.innerHTML = `
      <div class="params-shell">
        <div class="params-header">
          <div class="params-header-icon">
            <span class="material-icons-outlined">business</span>
          </div>
          <div style="flex:1;">
            <h1>Fiche d'identité de la collectivité</h1>
            <div class="subtitle">Informations officielles reprises dans les en-têtes de documents et exports</div>
          </div>
          <div id="fiche-actions">${_actionsHTML()}</div>
        </div>

        <div class="bloc">
          <div class="bloc-header">
            <div class="bloc-icon">
              <span class="material-icons-outlined">apartment</span>
            </div>
            <div class="bloc-title">Informations générales</div>
          </div>

          <div style="padding:18px;">
            <div>
              <div class="form-grid fg-2" style="padding:0;">
                <div class="form-field">
                  <label class="req">Raison sociale</label>
                  <input class="input" value="${DATA.raison_sociale}" ${!editMode ? 'disabled' : ''}>
                </div>
                <div class="form-field">
                  <label>Sigle</label>
                  <input class="input" value="${DATA.sigle}" ${!editMode ? 'disabled' : ''}>
                </div>
                <div class="form-field">
                  <label>N° SIRET</label>
                  <input class="input" value="${DATA.siret}" maxlength="14" ${!editMode ? 'disabled' : ''}>
                </div>
                <div class="form-field">
                  <label>N° SIREN</label>
                  <input class="input" value="${DATA.siren}" maxlength="9" ${!editMode ? 'disabled' : ''}>
                </div>
                <div class="form-field">
                  <label>Code APE</label>
                  <input class="input" value="${DATA.code_ape}" maxlength="5" ${!editMode ? 'disabled' : ''}>
                </div>
                <div class="form-field">
                  <label>Nature juridique</label>
                  <select class="input" ${!editMode ? 'disabled' : ''}>
                    <option>Commune</option>
                    <option>Communauté de communes</option>
                    <option>Communauté d'agglomération</option>
                    <option>Métropole</option>
                    <option>Département</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bloc" style="margin-top:14px;">
          <div class="bloc-header">
            <div class="bloc-icon teal">
              <span class="material-icons-outlined">call</span>
            </div>
            <div class="bloc-title">Coordonnées</div>
          </div>
          <div class="form-grid fg-2">
            <div class="form-field">
              <label>Téléphone</label>
              <input class="input" value="${DATA.telephone}" ${!editMode ? 'disabled' : ''}>
            </div>
            <div class="form-field">
              <label>Email</label>
              <input class="input" type="email" value="${DATA.email}" ${!editMode ? 'disabled' : ''}>
            </div>
            <div class="form-field full">
              <label>Site web</label>
              <input class="input" value="${DATA.site_web}" ${!editMode ? 'disabled' : ''}>
            </div>
            <div class="form-field full">
              <label>Adresse (via site principal)</label>
              <div style="display:flex;gap:8px;align-items:center;">
                <input class="input" value="${DATA.adresse}" disabled style="flex:1;">
                <button class="btn btn-ghost btn-sm">
                  <span class="material-icons-outlined">edit_location</span>
                  Modifier l'adresse
                </button>
              </div>
              <div class="hint">L'adresse est gérée via le site principal (ongle Sites).</div>
            </div>
          </div>
        </div>

        <div class="bloc" style="margin-top:14px;">
          <div class="bloc-header">
            <div class="bloc-icon purple">
              <span class="material-icons-outlined">person</span>
            </div>
            <div class="bloc-title">Responsable</div>
          </div>
          <div class="form-grid fg-2">
            <div class="form-field">
              <label>Nom du responsable</label>
              <input class="input" value="${DATA.nom_responsable}" ${!editMode ? 'disabled' : ''}>
            </div>
            <div class="form-field">
              <label>Fonction</label>
              <input class="input" value="${DATA.fonction_responsable}" ${!editMode ? 'disabled' : ''}>
            </div>
          </div>
          <div class="tracability">
            <span class="material-icons-outlined">history</span>
            Dernière modification le ${DATA.last_modified} par ${DATA.last_modified_by}
          </div>
        </div>
      </div>
    `;
  }

  function _actionsHTML() {
    if (editMode) {
      return `
        <button class="btn btn-ghost" onclick="CollectivitePage._cancel()">Annuler</button>
        <button class="btn btn-primary" style="margin-left:6px;" onclick="CollectivitePage._save()">
          <span class="material-icons-outlined">check</span>Enregistrer
        </button>
      `;
    }
    return `
      <button class="btn btn-primary" onclick="CollectivitePage._edit()">
        <span class="material-icons-outlined">edit</span>Modifier
      </button>
    `;
  }

  function _edit() {
    editMode = true;
    render(document.getElementById('router-outlet'));
  }
  function _cancel() {
    editMode = false;
    render(document.getElementById('router-outlet'));
    Utils.toast('Modifications annulées', 'info');
  }
  function _save() {
    editMode = false;
    render(document.getElementById('router-outlet'));
    Utils.toast('Fiche collectivité enregistrée', 'success');
  }

  return { render, _edit, _cancel, _save };
})();
window.CollectivitePage = CollectivitePage;
