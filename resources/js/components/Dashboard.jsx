import React, { useState, useEffect } from 'react';
import { FileText, FileBarChart, Briefcase, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        devis: { total: 0, enCours: 0 },
        factures: { total: 0, enCours: 0, enRetard: 0 },
        projets: { total: 0, enCours: 0, enRetard: 0 }
    });

    useEffect(() => {
        // Ici nous simulerons un appel API
        // À remplacer par un vrai appel API
        const fetchStats = async () => {
            // Simulation de données
            setStats({
                devis: { total: 50, enCours: 10 },
                factures: { total: 100, enCours: 20, enRetard: 5 },
                projets: { total: 30, enCours: 15, enRetard: 1 }
            });
        };

        fetchStats();
    }, []);

    return (
        <div className="min-h-screen py-4 sm:py-6 md:py-8">
            <div className="container mx-auto px-2 sm:px-4">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Par où voulez-vous commencer ?</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    <a href="/devis" className="transform transition-all duration-300 hover:scale-105">
                        <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center h-56 sm:h-64 md:h-72 border-2 border-gray-100 hover:border-nextmux-green">
                            <div className="bg-green-50 p-2 sm:p-3 md:p-4 rounded-full mb-4 sm:mb-5 md:mb-6">
                                <FileText className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-nextmux-green stroke-2" />
                            </div>
                            <h2 className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 md:mb-4 text-gray-800">Créer des Devis</h2>
                            <div className="space-y-1 sm:space-y-2 text-center">
                                <p className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                                    <span className="font-semibold text-nextmux-green">{stats.devis.total}</span> devis au total
                                    <span className="font-semibold text-blue-500">{stats.devis.enCours}</span> en cours
                                </p>
                            </div>
                        </div>
                    </a>

                    <a href="/factures" className="transform transition-all duration-300 hover:scale-105">
                        <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center h-56 sm:h-64 md:h-72 border-2 border-gray-100 hover:border-nextmux-green">
                            <div className="bg-green-50 p-2 sm:p-3 md:p-4 rounded-full mb-4 sm:mb-5 md:mb-6">
                                <FileBarChart className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-nextmux-green stroke-2" />
                            </div>
                            <h2 className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 md:mb-4 text-gray-800">Créer des Factures</h2>
                            <div className="space-y-1 sm:space-y-2 text-center">
                                <p className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                                    <span className="font-semibold text-nextmux-green">{stats.factures.total}</span> factures au total
                                    <span className="font-semibold text-blue-500">{stats.factures.enCours}</span> en cours
                                    <span className="font-semibold text-red-500">{stats.factures.enRetard}</span> en retard
                                </p>
                            </div>
                        </div>
                    </a>

                    <a href="/projets" className="transform transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
                        <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center h-56 sm:h-64 md:h-72 border-2 border-gray-100 hover:border-nextmux-green">
                            <div className="bg-green-50 p-2 sm:p-3 md:p-4 rounded-full mb-4 sm:mb-5 md:mb-6">
                                <Briefcase className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-nextmux-green stroke-2" />
                            </div>
                            <h2 className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 md:mb-4 text-gray-800">Projets</h2>
                            <div className="space-y-1 sm:space-y-2 text-center">
                                <p className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                                    <span className="font-semibold text-nextmux-green">{stats.projets.total}</span> projets au total
                                    <span className="font-semibold text-blue-500">{stats.projets.enCours}</span> en cours
                                    <span className="font-semibold text-red-500">{stats.projets.enRetard}</span> en retard
                                </p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
