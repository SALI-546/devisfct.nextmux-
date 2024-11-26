import React, { useState, useEffect } from 'react';
import { File, MoreVertical, Share, Eye, Copy, CheckCircle } from 'lucide-react';

const FacturesIndex = () => {
    const [activeCard, setActiveCard] = useState(null);

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
        const handleOutsideClick = () => closeActionsMenu();
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <div>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Générez des factures en un clic</h1>
                <div className="flex justify-between items-center mb-8">
                    <div className="relative w-96">
                        <input
                            type="search"
                            placeholder="Rechercher une facture..."
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

                    {/* Cartes de factures */}
                    {[1, 2, 3].map((card) => (
                        <div
                            key={card}
                            className="relative card bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-nextmux-green"
                        >
                            {/* Header de la carte */}
                            <div className="h-40 bg-gradient-to-br from-gray-200 via-blue-100 to-gray-300 flex items-center justify-center relative overflow-hidden">
                                <File className="w-14 h-14 sm:w-20 sm:h-20 text-blue-600 stroke-2 z-10" />
                            </div>

                            {/* Contenu de la carte */}
                            <a
                                href={`/factures/${card}`}
                                className="block p-6"
                                onClick={(e) => {
                                    if (activeCard === card) e.preventDefault(); // Empêche l'ouverture du lien si le menu est actif
                                }}
                            >
                                <div
                                    className={`status-badge inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${card === 1
                                        ? 'bg-red-100 text-yellow-800'
                                        : card === 2
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        } mb-4`}
                                >
                                    {card === 1 ? 'Non payé' : card === 2 ? 'Payé' : 'Brouillon'}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Facture #{2024 + card}</h3>
                                <div className="flex items-center text-sm text-gray-500">
                                    <span>Client: Entreprise {card}</span>
                                    <span className="mx-2">•</span>
                                    <span>{card === 1 ? '3 500 XOF' : card === 2 ? '2 800 XOF' : '1 200 XOF'}</span>
                                </div>
                                <div className="mt-4 text-sm text-gray-500">
                                    {card === 1
                                        ? 'Créé le 15-03-2024'
                                        : card === 2
                                            ? 'Payé le 14-03-2024'
                                            : 'Modifié le 16-03-2024'}
                                </div>
                            </a>

                            {/* Bouton des trois points */}
                            <div className="absolute top-4 right-4">
                                <button
                                    className="p-2 bg-white rounded-full shadow hover:bg-gray-100 focus:outline-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleActions(card);
                                    }}
                                >
                                    <MoreVertical className="w-5 h-5 text-gray-600" />
                                </button>

                                {/* Menu des actions rapides */}
                                {activeCard === card && (
                                    <div
                                        className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-2 z-10"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {actions.map((action, index) => (
                                            <button
                                                key={index}
                                                className="w-full flex items-center px-3 py-2 hover:bg-gray-100 rounded-md"
                                            >
                                                {action.icon}
                                                <span className="ml-2 text-sm text-gray-800">{action.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FacturesIndex;
