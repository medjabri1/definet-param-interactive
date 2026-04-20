/* ═══════════════════════════════════════════════════════════════
   STATE — Global application state (lightweight store)
   ═══════════════════════════════════════════════════════════════ */

const State = (() => {
  let _state = {
    user: null,          // { nom, prenom, initiales, role }
    theme: 'azur',       // 'azur' | 'green'
    route: null,         // current route string
    tabs: [],            // [{ id, label, icon, route, closable }]
    activeTabId: null,
    famille: null,       // current famille data
    individu: null,      // current individu data
    organisme: null,     // current organisme { id, nom }
  };

  const _listeners = {};

  function get(key) {
    return key ? _state[key] : { ..._state };
  }

  function set(key, value) {
    const prev = _state[key];
    _state[key] = value;
    _emit(key, value, prev);
  }

  function _emit(key, value, prev) {
    (_listeners[key] || []).forEach(fn => fn(value, prev));
    (_listeners['*'] || []).forEach(fn => fn(key, value, prev));
  }

  function on(key, fn) {
    if (!_listeners[key]) _listeners[key] = [];
    _listeners[key].push(fn);
    return () => { _listeners[key] = _listeners[key].filter(f => f !== fn); };
  }

  // ── Tab management ─────────────────────────────────────────
  function openTab(tab) {
    // { id, label, icon, route, closable=true }
    const tabs = _state.tabs;
    const exists = tabs.find(t => t.id === tab.id);
    if (!exists) {
      set('tabs', [...tabs, { closable: true, ...tab }]);
    }
    set('activeTabId', tab.id);
  }

  function closeTab(id) {
    const tabs = _state.tabs.filter(t => t.id !== id);
    set('tabs', tabs);
    // If closed tab was active, activate last tab
    if (_state.activeTabId === id) {
      const last = tabs[tabs.length - 1];
      if (last) {
        set('activeTabId', last.id);
        Router.go(last.route);
      } else {
        set('activeTabId', null);
        Router.go('/dashboard');
      }
    }
  }

  function updateTab(id, updates) {
    set('tabs', _state.tabs.map(t => t.id === id ? { ...t, ...updates } : t));
  }

  return { get, set, on, openTab, closeTab, updateTab };
})();

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA — Simulated backend data
   ═══════════════════════════════════════════════════════════════ */

const MockData = {
  familles: [
    { id: 1, nom: 'DUPONT', prenom_r1: 'Marie', prenom_r2: 'Jean', sexe_r1: 'F', sexe_r2: 'M',
      dob_r1: '1985-06-22', dob_r2: '1982-03-15',
      mobile_r1: '06 12 34 56 78', fixe_r1: '01 44 55 66 77', email_r1: 'marie.dupont@email.fr', profession_r1: 'Infirmière',
      mobile_r2: '07 98 76 54 32', email_r2: 'jean.dupont@email.fr', profession_r2: 'Ingénieur',
      nbenfants: 2, qf: 25120, statut: 'actif', reference: 'FAM-2024-0042', regime: 'Régime général', num_caf: '2 82 03 75 XXX XXX 92', adresse: '12 rue des Lilas, 75012 Paris', date_creation: '2024-01-10' },
    { id: 2, nom: 'MARTIN', prenom_r1: 'Sophie', prenom_r2: null, sexe_r1: 'F',
      dob_r1: '1990-11-08',
      mobile_r1: '06 33 44 55 66', email_r1: 'sophie.martin@email.fr', profession_r1: 'Enseignante',
      nbenfants: 1, qf: 18400, statut: 'actif', reference: 'FAM-2024-0043', regime: 'MSA', num_caf: '2 77 05 69 XXX XXX 12', adresse: '5 allée des Roses, 69003 Lyon', date_creation: '2024-02-15' },
    { id: 3, nom: 'BERNARD', prenom_r1: 'Paul', prenom_r2: 'Lucie', sexe_r1: 'M', sexe_r2: 'F',
      dob_r1: '1978-04-30', dob_r2: '1980-09-12',
      mobile_r1: '06 55 22 11 00', profession_r1: 'Comptable',
      mobile_r2: '07 44 33 22 11', profession_r2: 'Médecin',
      nbenfants: 3, qf: 31200, statut: 'actif', reference: 'FAM-2024-0044', regime: 'Régime général', num_caf: '1 64 08 13 XXX XXX 55', adresse: '27 boulevard Victor Hugo, 13001 Marseille', date_creation: '2024-03-01' },
    { id: 4, nom: 'PETIT', prenom_r1: 'Claire', prenom_r2: 'Thomas', sexe_r1: 'F', sexe_r2: 'M',
      dob_r1: '1988-02-14', dob_r2: '1985-07-20',
      mobile_r1: '06 77 88 99 00', profession_r1: 'Architecte',
      mobile_r2: '07 22 33 44 55', profession_r2: 'Avocat',
      nbenfants: 0, qf: 42000, statut: 'inactif', reference: 'FAM-2023-0039', regime: 'Régime général', num_caf: '2 89 11 75 XXX XXX 88', adresse: '8 rue du Moulin, 44000 Nantes', date_creation: '2023-11-20' },
    { id: 5, nom: 'MOREAU', prenom_r1: 'Isabelle', prenom_r2: null, sexe_r1: 'F',
      dob_r1: '1993-01-25',
      mobile_r1: '06 11 22 33 44', email_r1: 'isabelle.moreau@email.fr', profession_r1: 'Aide soignante',
      nbenfants: 2, qf: 15600, statut: 'actif', reference: 'FAM-2024-0045', regime: 'RSA', num_caf: '2 72 04 75 XXX XXX 03', adresse: '3 impasse du Parc, 31000 Toulouse', date_creation: '2024-03-18' },
    { id: 6, nom: 'LEROY', prenom_r1: 'Antoine', prenom_r2: 'Nathalie', sexe_r1: 'M', sexe_r2: 'F',
      dob_r1: '1975-08-03', dob_r2: '1977-12-18',
      mobile_r1: '06 99 88 77 66', profession_r1: 'Technicien',
      mobile_r2: '07 55 66 77 88', profession_r2: 'Assistante sociale',
      nbenfants: 4, qf: 19800, statut: 'actif', reference: 'FAM-2024-0046', regime: 'Régime général', num_caf: '1 71 06 67 XXX XXX 41', adresse: '14 avenue de la République, 67000 Strasbourg', date_creation: '2024-04-02' },
  ],

  enfants: {
    1: [
      { id: 10, prenom: 'Lucas', nom: 'DUPONT', sexe: 'M', date_naissance: '2021-05-12', age: 4, vaccins_a_jour: true, regime_alimentaire: [] },
      { id: 11, prenom: 'Emma',  nom: 'DUPONT', sexe: 'F', date_naissance: '2018-03-03', age: 7, vaccins_a_jour: false, regime_alimentaire: ['Sans gluten'] },
    ],
    2: [{ id: 20, prenom: 'Léo', nom: 'MARTIN', sexe: 'M', date_naissance: '2020-07-22', age: 5, vaccins_a_jour: true, regime_alimentaire: [] }],
    3: [
      { id: 30, prenom: 'Chloé', nom: 'BERNARD', sexe: 'F', date_naissance: '2019-01-15', age: 6, vaccins_a_jour: true, regime_alimentaire: [] },
      { id: 31, prenom: 'Hugo',  nom: 'BERNARD', sexe: 'M', date_naissance: '2021-09-08', age: 3, vaccins_a_jour: true, regime_alimentaire: [] },
      { id: 32, prenom: 'Inès',  nom: 'BERNARD', sexe: 'F', date_naissance: '2023-02-20', age: 1, vaccins_a_jour: false, regime_alimentaire: [] },
    ],
  },

  contacts: {
    1: [
      { id: 1, nom: 'Martin',  prenom: 'Sophie',  genre: 'F', qualite: 'Grand-mère maternelle',  mobile: '06 11 22 33 44', fixe: '',               a_contacter: true,  autorisee: true  },
      { id: 2, nom: 'Dupont',  prenom: 'Pierre',  genre: 'M', qualite: 'Grand-père paternel',    mobile: '06 55 44 33 22', fixe: '01 44 55 66 77', a_contacter: true,  autorisee: false },
      { id: 3, nom: 'Leroy',   prenom: 'Camille', genre: 'F', qualite: 'Assistante maternelle',  mobile: '06 99 88 77 66', fixe: '',               a_contacter: false, autorisee: true  },
    ],
  },

  inscriptions: {
    1: [
      { id: 200, date_insc: '2025-01-10', date_entree: '2025-02-01', date_sortie: null, type: 'Régulière',     prestation: 'Crèche Soleil',      enfant: 'Lucas',  tarif: 'Tarif QF',      debiteur: 'Marie DUPONT', statut: 'active' },
      { id: 201, date_insc: '2025-01-10', date_entree: '2025-02-01', date_sortie: null, type: 'Régulière',     prestation: 'Périscolaire',        enfant: 'Lucas',  tarif: 'Tarif QF',      debiteur: 'Jean DUPONT',  statut: 'active' },
      { id: 202, date_insc: '2025-01-10', date_entree: '2025-02-01', date_sortie: null, type: 'Occasionnelle', prestation: 'ALSH Mercredi',       enfant: 'Emma',   tarif: 'Tarif horaire', debiteur: 'Marie DUPONT', statut: 'active' },
      { id: 203, date_insc: '2024-09-01', date_entree: '2024-09-01', date_sortie: '2024-12-31', type: 'Régulière', prestation: 'Périscolaire', enfant: 'Emma', tarif: 'Tarif QF', debiteur: 'Jean DUPONT', statut: 'cloturee' },
    ],
  },

  ressources: {
    1: [{ id: 300, revenus_r1: 27200, revenus_r2: 32400, annexe_r1: 3200, annexe_r1_lib: 'Allocations', total: 62800, qf: 25120, qc: 1.0, debut: '2025-01-01', fin: '2025-12-31' }],
  },

  bancaire: {
    1: [
      { id: 400, iban: 'FR76 3000 6000 0112 3456 7890 189', bic: 'BNPAFRPPXXX', domiciliation: 'BNP Paribas Paris',         responsable: 'Marie DUPONT (R1)', rum: 'MD-2024-00042', date_effet: '2024-02-01', regie: 'Régie Petite Enfance', mandat_valide: true,  debiteur_defaut: true,  periodes_suspension: [] },
      { id: 401, iban: 'FR76 1027 8060 0000 1234 5678 912', bic: 'CMCIFRPP',    domiciliation: 'Crédit Mutuel Strasbourg', responsable: 'Jean DUPONT (R2)',  rum: 'JD-2024-00018', date_effet: '2024-04-15', regie: 'Régie Périscolaire',  mandat_valide: false, debiteur_defaut: false, periodes_suspension: [{ debut: '2025-07-01', fin: '2025-08-31', motif: 'Vacances d\'été' }] },
    ],
  },

  comptes: {
    1: [
      {
        id: 500, regie: 'Régie Petite Enfance', icon: 'child_care', color: 'blue',
        solde: -126.50, mode_paiement: 'Prélèvement SEPA', dernier_paiement: '2025-02-28',
        echeance: '2025-03-31',
        lignes: [
          { id: 5001, date: '2025-03-01', libelle: 'Crèche Soleil — Mars 2025',    montant: -312.40, type: 'facture',  statut: 'impayee' },
          { id: 5002, date: '2025-03-01', libelle: 'Prélèvement SEPA Mars',        montant:  185.90, type: 'paiement', statut: 'encaisse' },
          { id: 5003, date: '2025-02-01', libelle: 'Crèche Soleil — Févr. 2025',   montant: -298.70, type: 'facture',  statut: 'soldee' },
          { id: 5004, date: '2025-02-01', libelle: 'Prélèvement SEPA Février',     montant:  298.70, type: 'paiement', statut: 'encaisse' },
          { id: 5005, date: '2025-01-01', libelle: 'Crèche Soleil — Janv. 2025',   montant: -275.00, type: 'facture',  statut: 'soldee' },
          { id: 5006, date: '2025-01-01', libelle: 'Prélèvement SEPA Janvier',     montant:  275.00, type: 'paiement', statut: 'encaisse' },
        ],
      },
      {
        id: 501, regie: 'Régie Périscolaire', icon: 'school', color: 'purple',
        solde: 0, mode_paiement: 'Prélèvement SEPA', dernier_paiement: '2025-03-03',
        echeance: '2025-03-31',
        lignes: [
          { id: 5010, date: '2025-03-01', libelle: 'Périscolaire — Mars 2025',     montant: -89.50, type: 'facture',  statut: 'soldee' },
          { id: 5011, date: '2025-03-03', libelle: 'Prélèvement SEPA Mars',        montant:  89.50, type: 'paiement', statut: 'encaisse' },
          { id: 5012, date: '2025-02-01', libelle: 'Périscolaire — Févr. 2025',    montant: -76.00, type: 'facture',  statut: 'soldee' },
          { id: 5013, date: '2025-02-03', libelle: 'Prélèvement SEPA Février',     montant:  76.00, type: 'paiement', statut: 'encaisse' },
        ],
      },
      {
        id: 502, regie: 'Régie ALSH', icon: 'wb_sunny', color: 'orange',
        solde: 45.00, mode_paiement: 'Virement', dernier_paiement: '2025-02-15',
        echeance: null,
        lignes: [
          { id: 5020, date: '2025-02-01', libelle: 'ALSH Mercredi — Février',      montant: -120.00, type: 'facture',  statut: 'soldee' },
          { id: 5021, date: '2025-02-15', libelle: 'Virement famille DUPONT',      montant:  165.00, type: 'paiement', statut: 'encaisse' },
          { id: 5022, date: '2025-01-01', libelle: 'ALSH Vacances Hiver',          montant: -210.00, type: 'facture',  statut: 'soldee' },
          { id: 5023, date: '2025-01-20', libelle: 'Virement famille DUPONT',      montant:  210.00, type: 'paiement', statut: 'encaisse' },
        ],
      },
    ],
  },

  messages: {
    1: { recus: 14, envoyes: 9, dernier_recu: '2026-03-14', dernier_envoye: '2026-03-10' },
  },

  dashboard: {
    stats: [
      { label: 'Familles',     value: 1248, icon: 'folder_shared',   color: 'blue',   trend: '+4,2%' },
      { label: 'Individus',    value: 3617, icon: 'people',          color: 'teal',   trend: '+2,1%' },
      { label: 'Enfants',      value: 892,  icon: 'child_care',      color: 'brown',  trend: '−1,3%' },
      { label: 'Inscriptions', value: 2104, icon: 'event_available', color: 'purple', trend: '+8,7%' },
      { label: 'Demandes',     value: 347,  icon: 'pending_actions', color: 'info',   trend: '+12%' },
      { label: 'Impayés',      value: 83,   icon: 'warning_amber',   color: 'red',    trend: null, sub: '12 480 €' },
      { label: 'Règlements',   value: 1936, icon: 'payments',        color: 'green',  trend: null, sub: '248 720 €' },
    ],
    activites: [
      { date: '17/03/2026', heure: '09:12', action: 'Nouvelle famille créée — MOREAU Isabelle',      par: 'Sophie L.', section: 'Familles',     icon: 'add_circle',    color: 'blue'   },
      { date: '17/03/2026', heure: '08:47', action: 'Règlement validé — 240 € · Famille DUPONT',     par: 'Système',   section: 'Règlements',   icon: 'payments',      color: 'green'  },
      { date: '16/03/2026', heure: '17:30', action: 'Dossier en attente — Inscription Périscolaire', par: 'Antoine R.',section: 'Inscriptions', icon: 'pending_actions',color: 'orange' },
      { date: '16/03/2026', heure: '14:15', action: 'Impayé détecté — 85 € · Famille BERNARD',       par: 'Système',   section: 'Facturation',  icon: 'warning_amber', color: 'red'    },
      { date: '16/03/2026', heure: '11:02', action: 'Document ajouté — Attestation CAF · LEROY',     par: 'Marie B.',  section: 'Documents',    icon: 'attach_file',   color: 'teal'   },
    ],
  },

  organismes: [
    { id: 1, nom: 'CAF Nord-Est' },
    { id: 2, nom: 'CAF Île-de-France' },
    { id: 3, nom: 'MSA Bourgogne' },
    { id: 4, nom: 'CCAS Bordeaux' },
    { id: 5, nom: 'MDPH Lyon' },
  ],

  professions: {
    1: {
      r1: { csp: 'Cadres et professions intellectuelles supérieures', profession: 'Ingénieure informatique', employeur: 'Tech Solutions SAS', horaires: 'Lun–Ven 9h–18h', complement: 'Bâtiment B – 3ème étage', batiment: 'B', rue: '45 avenue de la République', lieudit: '', code_postal: '75011', ville: 'Paris', tel_portable: '06 12 34 56 78', tel_fixe: '01 23 45 67 89', email: 'marie.dupont@techsolutions.fr' },
      r2: { csp: 'Professions libérales', profession: 'Médecin généraliste', employeur: 'Cabinet Médical du Centre', horaires: 'Lun–Sam 8h–20h', complement: '', batiment: '', rue: '12 rue du Faubourg Saint-Antoine', lieudit: '', code_postal: '75012', ville: 'Paris', tel_portable: '06 98 76 54 32', tel_fixe: '01 43 21 09 87', email: 'jean.dupont@cabinet-medical.fr' },
    },
  },

  revenus: {
    1: [
      {
        id: 1, periode_debut: '2024-01-01', periode_fin: '2024-12-31',
        montant: 52400, nb_parts: 2.5, quotient: 1746,
        declare: false, date_refus: null,
        responsables: [
          { titre: 'Marie DUPONT (R1)', montant: 36000 },
          { titre: 'Jean DUPONT (R2)', montant: 12000 },
        ],
        revenus_annexes: [{ libelle: 'Allocations familiales CAF', montant: 4400 }],
        qf: { total: 52400, nb_parts: 2.5, quotient: 1746, qc: 1680 },
        validite: { debut: '2025-01-01', fin: '2025-12-31' },
      },
      {
        id: 2, periode_debut: '2023-01-01', periode_fin: '2023-12-31',
        montant: 48600, nb_parts: 2.5, quotient: 1620,
        declare: false, date_refus: null,
        responsables: [
          { titre: 'Marie DUPONT (R1)', montant: 33600 },
          { titre: 'Jean DUPONT (R2)', montant: 11000 },
        ],
        revenus_annexes: [{ libelle: 'Allocations familiales CAF', montant: 4000 }],
        qf: { total: 48600, nb_parts: 2.5, quotient: 1620, qc: 1558 },
        validite: { debut: '2024-01-01', fin: '2024-12-31' },
      },
    ],
  },

  doublons: {
    1: [
      { id: 3, nom: 'DUPONT', prenom_r1: 'Marie-Anne', prenom_r2: 'Jean-Paul', adresse: '14 rue des Lilas, 75012 Paris', reference: 'FAM-2023-0087', statut: 'actif', responsable_match: 1, responsable_matched_with: 1 },
      { id: 4, nom: 'DUPONT', prenom_r1: 'Marie', prenom_r2: null,           adresse: '8 bd Voltaire, 75011 Paris',     reference: 'FAM-2024-0103', statut: 'actif', responsable_match: 1, responsable_matched_with: 2 },
      { id: 5, nom: 'DUPONT', prenom_r1: 'Pierre',    prenom_r2: 'Jean',      adresse: '22 rue de la Paix, 75001 Paris', reference: 'FAM-2024-0211', statut: 'actif', responsable_match: 2, responsable_matched_with: 1 },
    ],
  },

  notes: {
    1: {
      a_traiter: [
        { id: 1, description: 'Contacter la famille pour mise à jour des coordonnées bancaires suite au changement de banque signalé par courrier.', date_creation: '2025-03-10T09:15:00', individu: { nom: 'Lefebvre', prenom: 'Sophie' } },
        { id: 2, description: 'Vérifier les justificatifs de revenus pour renouvellement du QF — délai expiré le 31/03.', date_creation: '2025-03-14T11:30:00', individu: { nom: 'Martin', prenom: 'Antoine' } },
      ],
      traitees: [
        { id: 3, description: 'Envoi courrier de rappel impayé effectué par voie postale.', date_creation: '2025-02-18T14:00:00', individu: { nom: 'Lefebvre', prenom: 'Sophie' }, operateur: { nom: 'Bernard', prenom: 'Claire' }, date_traitement: '2025-02-20T10:30:00' },
        { id: 4, description: 'Dossier d\'inscription crèche mis à jour après réception des pièces manquantes.', date_creation: '2025-01-22T08:45:00', individu: { nom: 'Martin', prenom: 'Antoine' }, operateur: { nom: 'Lefebvre', prenom: 'Sophie' }, date_traitement: '2025-01-23T15:00:00' },
      ],
    },
  },

  tags: {
    1: [
      { id: 1, nom: 'Famille prioritaire', sigle: 'PRIO' },
      { id: 2, nom: 'Situation difficile', sigle: 'SDIF' },
    ],
  },

  refTypeTags: [
    { id: 1, nom: 'Famille prioritaire',  sigle: 'PRIO', actif: true },
    { id: 2, nom: 'Situation difficile',   sigle: 'SDIF', actif: true },
    { id: 3, nom: 'Dossier incomplet',     sigle: 'DINC', actif: true },
    { id: 4, nom: 'Suivi social',          sigle: 'SSOC', actif: true },
    { id: 5, nom: 'En contentieux',        sigle: 'CONT', actif: true },
    { id: 6, nom: 'Alerte impayé',         sigle: 'AIMP', actif: true },
  ],
};
window.State = State;
window.MOCK_DATA = typeof MOCK_DATA !== 'undefined' ? MOCK_DATA : undefined;
