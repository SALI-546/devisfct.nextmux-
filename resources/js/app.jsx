import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/Dashboard';
import CRMClients from './components/CRMClients';
import DevisIndex from './components/DevisIndex';
import NouveauDevis from './components/NouveauDevis/New';
import FacturesIndex from './components/FacturesIndex';
import NouvelleFacture from './components/NouvelleFacture/New';
import Services from './components/Services';
import Projets from './components/Projets';
import Formation from './components/Formation';
import Parametres from './components/Parametres';


const mountComponent = (id, Component) => {
    const root = document.getElementById(id);
    if (root) {
        ReactDOM.createRoot(root).render(<Component />);
    }
};

mountComponent('dashboard-root', Dashboard);
mountComponent('crm-clients-root', CRMClients);
mountComponent('devis-index-root', DevisIndex);
mountComponent('new-devis-root', NouveauDevis);
mountComponent('factures-index-root', FacturesIndex);
mountComponent('new-fact-root', NouvelleFacture);
mountComponent('services-root', Services);
mountComponent('projets-root', Projets);
mountComponent('formation-root', Formation);
mountComponent('parametres-root', Parametres);
