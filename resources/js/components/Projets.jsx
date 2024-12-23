import React, { useState, useEffect } from "react";
import axios from "axios";
import Flag from "react-world-flags"; // Module pour les drapeaux
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

const Projets = () => {
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const [filters, setFilters] = useState({ category: "", country: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const projectsPerPage = 3; // Nombre de projets par page

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError(null); // Réinitialiser l'erreur avant de faire une nouvelle requête
            try {
                const response = await axios.get("http://localhost:8000/api/projects", {
                    params: filters,
                });
                setProjects(response.data.projects);
                setCategories(response.data.categories);
                setCountries(response.data.countries);
                setCurrentPage(1); // Réinitialiser la page actuelle lors du changement de filtre
            } catch (err) {
                console.error(err);
                setError("Erreur lors de la récupération des projets.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [filters]);

    // Gestion du filtrage des projets
    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    // Calculer les projets à afficher pour la page actuelle
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    // Changer la page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Total de pages
    const totalPages = Math.ceil(projects.length / projectsPerPage);

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
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <select
                    className="p-3 border rounded-md w-full sm:w-auto"
                    value={filters.country}
                    onChange={(e) => handleFilterChange("country", e.target.value)}
                >
                    <option value="">Tous les pays</option>
                    {countries.map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>
            </div>

            {/* Liste des projets */}
            {loading ? (
                <div className="text-center text-gray-500">Chargement des projets...</div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentProjects.map((project) => (
                            <div
                                key={project.id}
                                className="border rounded-lg p-4 shadow-sm hover:shadow-md flex flex-col bg-gray-50"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-500 text-sm">{project.category}</span>
                                    {project.country && (
                                        <div
                                            title={project.country}
                                            className="text-sm flex items-center gap-2"
                                        >
                                            <Flag
                                                code={project.country}
                                                className="w-6 h-4 rounded-sm"
                                            />
                                            {project.country}
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                                <p
                                    className="text-sm text-gray-600 mb-4 flex-grow"
                                    dangerouslySetInnerHTML={{ __html: project.description }}
                                ></p>
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

                    {/* Pagination */}
                    <div className="flex justify-center mt-6 space-x-3">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-6 py-2 border-2 border-nextmux-green text-nextmux-green rounded-full shadow-md transition-all duration-300 ease-in-out hover:bg-nextmux-green hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <MdArrowBackIos />
                            Précédent
                        </button>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-6 py-2 border-2 border-nextmux-green text-nextmux-green rounded-full shadow-md transition-all duration-300 ease-in-out hover:bg-nextmux-green hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Suivant
                            <MdArrowForwardIos />
                        </button>
                    </div>

                    {/* Message si aucun projet trouvé */}
                    {projects.length === 0 && (
                        <div className="text-center text-gray-500 mt-8">
                            Aucun projet ne correspond à vos critères de recherche.
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Projets;
