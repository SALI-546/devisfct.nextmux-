import React, { useState } from "react";
import Flag from "react-world-flags"; // Module pour les drapeaux

// Mapping des codes pays (ISO 3166-1 alpha-2)
const countryFlags = {
    Cameroun: "CM",
    Bénin: "BJ",
    Sénégal: "SN",
    "Côte d'Ivoire": "CI",
    Togo: "TG",
};

const Projets = () => {
    const [projects] = useState([
        {
            id: 1,
            category: "Développement",
            title: "Mise à Niveau des Compétences Techniques",
            price: "300,000 XOF",
            description: "Prêt à donner vie à votre projet ? Soumettez-le dès maintenant et laissez nos freelances expérimentés vous proposer leurs meilleures solutions.",
            time: "il y a 4 mois",
            country: "Cameroun"
        },
        {
            id: 2,
            category: "Design",
            title: "Création de Logo Professionnel",
            price: "150,000 XOF",
            description: "Un design unique et professionnel pour représenter votre marque.",
            time: "il y a 1 mois",
            country: "Bénin"
        },
        {
            id: 3,
            category: "Marketing",
            title: "Campagne de Marketing Digital",
            price: "250,000 XOF",
            description: "Boostez votre présence en ligne avec une stratégie marketing complète.",
            time: "il y a 2 mois",
            country: "Sénégal"
        },
        {
            id: 4,
            category: "Développement",
            title: "Application Mobile E-commerce",
            price: "500,000 XOF",
            description: "Développement d'une application mobile complète pour votre boutique en ligne.",
            time: "il y a 3 mois",
            country: "Côte d'Ivoire"
        },
        {
            id: 5,
            category: "Design",
            title: "Refonte de Site Web",
            price: "200,000 XOF",
            description: "Modernisation et optimisation de l'interface utilisateur de votre site web.",
            time: "il y a 5 mois",
            country: "Togo"
        },
        {
            id: 6,
            category: "Marketing",
            title: "Stratégie de Contenu",
            price: "180,000 XOF",
            description: "Création d'un plan de contenu aligné avec vos objectifs marketing.",
            time: "il y a 6 mois",
            country: "Bénin"
        },
        {
            id: 7,
            category: "Développement",
            title: "Système de Gestion de Stock",
            price: "400,000 XOF",
            description: "Solution logicielle complète pour la gestion de votre inventaire.",
            time: "il y a 2 mois",
            country: "Cameroun"
        },
        {
            id: 8,
            category: "Design",
            title: "Identité Visuelle Complète",
            price: "250,000 XOF",
            description: "Création d'une identité visuelle unique pour votre marque.",
            time: "il y a 4 mois",
            country: "Sénégal"
        },
        {
            id: 9,
            category: "Marketing",
            title: "Audit de Présence Digitale",
            price: "150,000 XOF",
            description: "Analyse approfondie de votre stratégie digitale actuelle.",
            time: "il y a 1 mois",
            country: "Côte d'Ivoire"
        },
        {
            id: 10,
            category: "Développement",
            title: "Dashboard de Reporting",
            price: "350,000 XOF",
            description: "Développement d'un tableau de bord analytique personnalisé.",
            time: "il y a 3 mois",
            country: "Togo"
        }
    ]);

    const [filters, setFilters] = useState({ category: "", country: "" });

    // Gestion du filtrage des projets
    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const filteredProjects = projects.filter((project) => {
        return (
            (!filters.category || project.category === filters.category) &&
            (!filters.country || project.country === filters.country)
        );
    });

    return (
        <div className="p-6">
            {/* Titre de la page */}
            <h1 className="text-2xl font-bold mb-6">Projets</h1>

            {/* Filtres */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
                <select
                    className="p-3 border rounded-md w-full sm:w-auto"
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                >
                    <option value="">Toutes les catégories</option>
                    <option value="Développement">Développement</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                </select>

                <select
                    className="p-3 border rounded-md w-full sm:w-auto"
                    value={filters.country}
                    onChange={(e) => handleFilterChange("country", e.target.value)}
                >
                    <option value="">Tous les pays</option>
                    {Object.keys(countryFlags).map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>
            </div>

            {/* Liste des projets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <div
                        key={project.id}
                        className="border rounded-lg p-4 shadow-sm hover:shadow-md flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500 text-sm">{project.category}</span>
                            {countryFlags[project.country] && (
                                <div
                                    title={project.country}
                                    className="text-sm flex items-center gap-2"
                                >
                                    <Flag
                                        code={countryFlags[project.country]}
                                        className="w-6 h-4 rounded-sm"
                                    />
                                    {project.country}
                                </div>
                            )}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 flex-grow">
                            {project.description}
                        </p>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-green-600 font-bold">{project.price}</p>
                            <p className="text-gray-400 text-sm">{project.time}</p>
                        </div>
                        <button
                            className="w-full p-2 border-2 border-nextmux-green text-nextmux-green rounded-md transition duration-300 ease-in-out hover:bg-nextmux-green hover:text-white"
                        >
                            Faire une offre
                        </button>
                    </div>
                ))}
            </div>

            {/* Message si aucun projet trouvé */}
            {filteredProjects.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    Aucun projet ne correspond à vos critères de recherche.
                </div>
            )}
        </div>
    );
};

export default Projets;
