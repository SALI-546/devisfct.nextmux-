// resources/js/app.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/Dashboard';
import DevisIndex from './components/DevisIndex';
import NouveauDevis from './components/NouveauDevis/New';
import FacturesIndex from './components/FacturesIndex';
import NouvelleFacture from './components/NouvelleFacture/New';
import Projets from './components/Projets';
import DevisView from './components/DevisView'; // Import du composant DevisView
import './global';

const mountComponent = (id, Component) => {
    const root = document.getElementById(id);
    if (root) {
        ReactDOM.createRoot(root).render(<Component />);
    }
};

// Montage des composants sans Router
mountComponent('dashboard-root', Dashboard);
mountComponent('devis-index-root', DevisIndex);
mountComponent('new-devis-root', NouveauDevis);
mountComponent('factures-index-root', FacturesIndex);
mountComponent('new-fact-root', NouvelleFacture);
mountComponent('projets-root', Projets);
mountComponent('devis-view-root', DevisView); // Montage sans Router
