import React, { useState, useEffect } from 'react';
import { File, MoreVertical, Share as ShareIcon, Eye, Copy, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FacturesIndex = () => {
    const [activeCard, setActiveCard] = useState(null);
    const [factures, setFactures] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const actions = [
        { icon: <ShareIcon className="w-4 h-4" />, label: 'Partager', action: 'share' },
        { icon: <Eye className="w-4 h-4" />, label: 'Visualiser', action: 'view' },
        { icon: <Copy className="w-4 h-4" />, label: 'Dupliquer', action: 'duplicate' },
        { icon: <CheckCircle className="w-4 h-4" />, label: 'Valider', action: 'validate' },
    ];

    const toggleActions = (invoiceId) => {
        setActiveCard((prevCard) => (prevCard === invoiceId ? null : invoiceId));
    };

    const closeActionsMenu = () => {
        setActiveCard(null);
    };

    useEffect(() => {
        const handleOutsideClick = () => closeActionsMenu();
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        fetchFactures();
    }, [searchQuery]);

    const fetchFactures = async () => {
        try {
            const res = await axios.get('/api/invoices', { params: { search: searchQuery }, withCredentials: true });
            let invoicesData = res.data;
            if (!Array.isArray(invoicesData)) {
                invoicesData = [];
            }
            setFactures(invoicesData);
        } catch (error) {
            console.error("Erreur lors du chargement des factures:", error);
            toast.error('Impossible de charger les factures.');
        }
    };

    const handleActionClick = async (factureId, action) => {
        closeActionsMenu();
        const urlBase = window.location.origin;
        switch (action) {
            case 'share':
                try {
                    const shareUrl = `${urlBase}/facture/${factureId}`;
                    if (navigator.share) {
                        await navigator.share({
                            title: `Facture #${factureId}`,
                            text: 'Voici votre facture.',
                            url: shareUrl,
                        });
                        toast.success('Facture partagée avec succès !');
                    } else {
                        await navigator.clipboard.writeText(shareUrl);
                        toast.success('Lien copié dans le presse-papiers !');
                    }
                } catch (err) {
                    console.error('Erreur lors du partage:', err);
                }
                break;
            case 'view':
                window.location.href = `/facture/${factureId}`;
                break;
            case 'duplicate':
                try {
                    await axios.post(`/api/invoices/${factureId}/duplicate`, {}, { withCredentials: true });
                    toast.success('Facture dupliquée avec succès !');
                    fetchFactures();
                } catch (err) {
                    console.error('Erreur duplication:', err);
                    toast.error('Impossible de dupliquer la facture.');
                }
                break;
            case 'validate':
                try {
                    await axios.post(`/api/invoices/${factureId}/validate`, {}, { withCredentials: true });
                    toast.success('Facture validée avec succès !');
                    fetchFactures();
                } catch (err) {
                    console.error('Erreur validation:', err);
                    toast.error('Impossible de valider la facture.');
                }
                break;
            default:
                break;
        }
    };

    const getStatusClass = (statut) => {
        // Adapter selon vos statuts réels
        const st = statut.toLowerCase();
        if (st.includes('payée') || st.includes('payé')) {
            return 'bg-green-100 text-green-800';
        } else if (st.includes('non') || st.includes('impayé')) {
            return 'bg-red-100 text-yellow-800';
        } else {
            return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (statut) => {
        return statut;
    };

    const getDateLabel = (statut, dateEmission) => {
        const d = new Date(dateEmission).toLocaleDateString();
        const st = statut.toLowerCase();
        if (st.includes('payée') || st.includes('payé')) {
            return `Payé le ${d}`;
        } else if (st.includes('non') || st.includes('impayé')) {
            return `Créé le ${d}`;
        } else {
            return `Modifié le ${d}`;
        }
    };

    return (
        <div>
            <ToastContainer />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Générez des factures en un clic</h1>
                <div className="flex justify-between items-center mb-8">
                    <div className="relative w-96">
                        <input
                            type="search"
                            placeholder="Rechercher une facture..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400 absolute left-3 top-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Carte d'ajout */}
                    <a href="/factures/nouveau" className="block">
                        <div className="card bg-white rounded-xl p-6 flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-200 hover:border-nextmux-green">
                            <div className="w-16 h-16 bg-nextmux-green rounded-full flex items-center justify-center mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">Créer une facture</h3>
                            <p className="text-sm text-gray-500 mt-2 text-center">
                                Commencer la rédaction d'une nouvelle facture
                            </p>
                        </div>
                    </a>

                    {factures.map((facture) => {
                        const total = facture.items.reduce((sum, i) => sum + (i.quantite * i.prix), 0);
                        const statusClass = getStatusClass(facture.statut);
                        const statusLabel = getStatusLabel(facture.statut);
                        const dateLabel = getDateLabel(facture.statut, facture.date_emission);

                        return (
                            <div
                                key={facture.id}
                                className="relative card bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-nextmux-green"
                            >
                                <div className="h-40 bg-gradient-to-br from-gray-200 via-blue-100 to-gray-300 flex items-center justify-center relative overflow-hidden">
                                    <File className="w-14 h-14 sm:w-20 sm:h-20 text-blue-600 stroke-2 z-10" />
                                </div>

                                <a
                                    href={`/facture/${facture.id}`}
                                    className="block p-6"
                                    onClick={(e) => {
                                        if (activeCard === facture.id) e.preventDefault();
                                    }}
                                >
                                    <div className={`status-badge inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClass} mb-4`}>
                                        {statusLabel}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Facture #{facture.numero}</h3>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span>Client: {facture.client ? facture.client.entreprise : 'N/A'}</span>
                                        <span className="mx-2">•</span>
                                        <span>{total.toFixed(2)} XOF</span>
                                    </div>
                                    <div className="mt-4 text-sm text-gray-500">
                                        {dateLabel}
                                    </div>
                                </a>

                                <div className="absolute top-4 right-4">
                                    <button
                                        className="p-2 bg-white rounded-full shadow hover:bg-gray-100 focus:outline-none"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleActions(facture.id);
                                        }}
                                    >
                                        <MoreVertical className="w-5 h-5 text-gray-600" />
                                    </button>

                                    {activeCard === facture.id && (
                                        <div
                                            className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-2 z-10"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {actions.map((action, index) => (
                                                <button
                                                    key={index}
                                                    className="w-full flex items-center px-3 py-2 hover:bg-gray-100 rounded-md"
                                                    onClick={() => handleActionClick(facture.id, action.action)}
                                                >
                                                    {action.icon}
                                                    <span className="ml-2 text-sm text-gray-800">{action.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FacturesIndex;
