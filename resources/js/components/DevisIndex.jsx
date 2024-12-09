// resources/js/components/DevisIndex.jsx

import React, { useState, useEffect } from 'react';
import { FileText, MoreVertical, Share, Eye, Copy, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DevisIndex = () => {
    const [quotes, setQuotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCard, setActiveCard] = useState(null);
    const [loading, setLoading] = useState(false);

    const actions = [
        { icon: <Share className="w-4 h-4" />, label: 'Partager' },
        { icon: <Eye className="w-4 h-4" />, label: 'Visualiser' },
        { icon: <Copy className="w-4 h-4" />, label: 'Dupliquer' },
        { icon: <CheckCircle className="w-4 h-4" />, label: 'Valider' },
    ];

    const toggleActions = (cardId) => {
        setActiveCard((prevCard) => (prevCard === cardId ? null : cardId));
    };

    const closeActionsMenu = () => {
        setActiveCard(null);
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (!e.target.closest('.actions-menu')) {
                closeActionsMenu();
            }
        };
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchQuotes();
        }, 500); // Ajout d'un délai pour éviter les appels excessifs

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchQuotes = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/quotes', {
                params: {
                    search: searchTerm,
                },
            });
            setQuotes(response.data.data); // Supposant une réponse paginée
        } catch (error) {
            console.error('Erreur lors de la récupération des devis:', error);
            toast.error('Erreur lors de la récupération des devis.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleShare = (quote) => {
        const shareData = {
            title: `Devis ${quote.numero}`,
            text: `Voici le devis #${quote.numero} pour ${quote.client.nom}.`,
            url: window.location.origin + `/devis/${quote.id}`,
        };
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => toast.success('Devis partagé avec succès !'))
                .catch((err) => console.error('Erreur lors du partage:', err));
        } else {
            // Fallback : Copier le lien
            navigator.clipboard.writeText(shareData.url)
                .then(() => toast.success('Lien copié dans le presse-papiers !'))
                .catch((err) => console.error('Erreur lors de la copie du lien:', err));
        }
    };

    const handleView = (quote) => {
        window.location.href = `/devis/${quote.id}`; // Redirection vers la page de visualisation
    };

    const handleDuplicate = async (quote) => {
        try {
            const response = await axios.post(`/api/quotes/${quote.id}/duplicate`);
            toast.success('Devis dupliqué avec succès !');
            fetchQuotes(); // Rafraîchir la liste des devis
        } catch (error) {
            console.error('Erreur lors de la duplication du devis:', error);
            toast.error('Erreur lors de la duplication du devis.');
        }
    };

    const handleValidate = async (quote) => {
        try {
            await axios.put(`/api/quotes/${quote.id}/validate`);
            toast.success('Devis validé avec succès !');
            fetchQuotes(); // Rafraîchir la liste des devis
        } catch (error) {
            console.error('Erreur lors de la validation du devis:', error);
            toast.error('Erreur lors de la validation du devis.');
        }
    };

    const handleAction = (quote, action) => {
        switch (action.label) {
            case 'Partager':
                handleShare(quote);
                break;
            case 'Visualiser':
                handleView(quote);
                break;
            case 'Dupliquer':
                handleDuplicate(quote);
                break;
            case 'Valider':
                handleValidate(quote);
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Tous vos devis en un seul endroit</h1>
                <div className="flex justify-between items-center mb-8">
                    <div className="relative w-96">
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Rechercher un devis..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nextmux-green"
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
                {loading ? (
                    <p className="text-center text-gray-500">Chargement des devis...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* Carte d'ajout */}
                        <a href="/devis/nouveau" className="block">
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
                                <h3 className="text-xl font-semibold text-gray-800">Créer un nouveau devis</h3>
                                <p className="text-sm text-gray-500 mt-2 text-center">
                                    Commencer la rédaction d'un nouveau devis
                                </p>
                            </div>
                        </a>

                        {/* Cartes de devis dynamiques */}
                        {quotes.length > 0 ? (
                            quotes.map((quote) => (
                                <div
                                    key={quote.id}
                                    className="relative card bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-nextmux-green"
                                >
                                    {/* Header de la carte */}
                                    <div className="h-40 bg-gradient-to-r from-nextmux-green to-nextmux-green-dark flex items-center justify-center">
                                        <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-white stroke-2" />
                                    </div>

                                    {/* Contenu de la carte */}
                                    <div className="block p-6">
                                        <div
                                            className={`status-badge inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                quote.statut === 'En cours'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : quote.statut === 'Validé'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                            } mb-4`}
                                        >
                                            {quote.statut}
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Devis #{quote.numero}</h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span>Client: {quote.client.nom}</span>
                                            <span className="mx-2">•</span>
                                            <span>{quote.include_tva ? 'TVA Incluse' : 'TVA Exclue'}</span>
                                        </div>
                                        <div className="mt-4 text-sm text-gray-500">
                                            {new Date(quote.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Bouton des trois points */}
                                    <div className="absolute top-4 right-4 actions-menu">
                                        <button
                                            className="p-2 bg-white rounded-full shadow hover:bg-gray-100 focus:outline-none"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleActions(quote.id);
                                            }}
                                        >
                                            <MoreVertical className="w-5 h-5 text-gray-600" />
                                        </button>

                                        {/* Menu des actions rapides */}
                                        {activeCard === quote.id && (
                                            <div
                                                className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-2 z-10"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {actions.map((action, index) => (
                                                    <button
                                                        key={index}
                                                        className="w-full flex items-center px-3 py-2 hover:bg-gray-100 rounded-md"
                                                        onClick={() => handleAction(quote, action)}
                                                    >
                                                        {action.icon}
                                                        <span className="ml-2 text-sm text-gray-800">{action.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Aucun devis trouvé.</p>
                        )}
                    </div>
                )}
                <ToastContainer />
            </div>
        </div>
    );
};

export default DevisIndex;
